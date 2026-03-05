#!/usr/bin/env python3
"""
generate_heatmaps.py — SawahSense Demo Heatmap Tile Generator
Sekinchan Season 2 2025 edition.

Generates spatially realistic heatmap PNGs from demoFields.js data.
Output: /public/demo-tiles/{fieldId}/{index}/{date}.png

Run from the backend directory:
  uv run python generate_heatmaps.py
"""

import os
import json
import math
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from scipy.ndimage import gaussian_filter
from PIL import Image, ImageDraw

# ── Config ─────────────────────────────────────────────────────────────────────
FRONTEND_PUBLIC = os.path.join(os.path.dirname(__file__), "../frontend/public")
OUTPUT_DIR = os.path.join(FRONTEND_PUBLIC, "demo-tiles")
IMG_SIZE = 256

# ── Color maps (match frontend IndexToggleBar legend exactly) ──────────────────
CMAPS = {
    "ndvi": {
        "cmap": mcolors.LinearSegmentedColormap.from_list("ndvi", [
            "#8b0000",   # < 0.2 — no vegetation / bare/flooded soil
            "#d29922",   # 0.2–0.4 — sparse/young
            "#74c476",   # 0.4–0.6 — moderate
            "#3fb950",   # 0.6–0.75 — healthy
            "#1a7f37",   # > 0.75 — very healthy
        ]),
        "vmin": 0.0, "vmax": 1.0,
    },
    "evi": {
        "cmap": mcolors.LinearSegmentedColormap.from_list("evi", [
            "#8b0000",   # < 0.15 — very low
            "#d29922",   # 0.15–0.35 — low
            "#74c476",   # 0.35–0.55 — moderate
            "#3fb950",   # 0.55–0.70 — good
            "#1a7f37",   # > 0.70 — excellent
        ]),
        "vmin": 0.0, "vmax": 0.9,
    },
    "lswi": {
        "cmap": mcolors.LinearSegmentedColormap.from_list("lswi", [
            "#f85149",   # < 0.10 — critically dry / water stress
            "#d29922",   # 0.10–0.25 — dry
            "#58a6ff",   # 0.25–0.40 — sufficient
            "#2171b5",   # 0.40–0.55 — good
            "#084594",   # > 0.55 — well saturated (early transplant)
        ]),
        "vmin": -0.1, "vmax": 0.7,
    },
}

# ── Field polygons [lng, lat] — mirrors demoFields.js, keep in sync ───────────
FIELDS = {
    "f1": {
        "name": "Petak A — Sekinchan Utara",
        "coords": [
            [101.12468719482423, 3.5275135499933956],
            [101.13683223724367, 3.535651981068987],
            [101.13893508911134, 3.5323537833894094],
            [101.12674713134767, 3.524300991785054],
        ],
        # Healthy benchmark — no stress patch
        "stress_patch": None,
    },
    "f2": {
        "name": "Petak B — Sekinchan Tengah",
        "coords": [
            [101.12264871597291, 3.530683263209576],
            [101.13472938537599, 3.5387359994553473],
            [101.13674640655518, 3.535651981068987],
            [101.12464427948, 3.5277277201459274],
        ],
        # Healthy MR269 — no stress patch (lower base values from variety
        # difference, not a problem)
        "stress_patch": None,
    },
    "f3": {
        "name": "Petak C — Sekinchan Timur",
        "coords": [
            [101.12052440643312, 3.533895799348431],
            [101.13271236419679, 3.5420341744251918],
            [101.13477230072023, 3.5387359994553473],
            [101.1226272583008, 3.5307689309842245],
        ],
        # BLB (Bacterial Leaf Blight):
        #   Directional spread from SE canal inlet (bottom_right in pixel space)
        #   Affects NDVI + EVI only — LSWI unchanged (disease, not water stress)
        #   Visible from Oct 20 onwards
        "stress_patch": {
            "indices": ["ndvi", "evi"],
            "dates_after": "2025-10-20",
            "corner": "bottom_right",   # SE corner = south=bottom, east=right
            "size": 0.38,               # grows to ~35-40% of field
            "depression": -0.20,        # local drop vs field mean
        },
    },
    "f4": {
        "name": "Petak D — Sekinchan Selatan",
        "coords": [
            [101.10434532165529, 3.5323537833894094],
            [101.11627578735353, 3.5401923379032407],
            [101.11829280853273, 3.5371083243634605],
            [101.10631942749023, 3.529184075874131],
        ],
        # Irrigation channel blockage — uniform LSWI collapse across field
        # (not a corner patch — the whole field is drying from canal inlet loss)
        # The base LSWI values already encode the drop.
        # Use a large-coverage patch for slight additional spatial realism.
        "stress_patch": {
            "indices": ["lswi"],
            "dates_after": "2025-11-04",
            "corner": "center",         # custom: near-uniform whole-field drop
            "size": 0.85,
            "depression": -0.06,        # mild extra — base values carry the story
        },
    },
    "f5": {
        "name": "Petak E — Ladang Komuniti",
        "coords": [
            [101.10219955444336, 3.5355663137451248],
            [101.11421585083009, 3.5434476743868255],
            [101.11623287200929, 3.540278004799458],
            [101.10421657562256, 3.5323966172006482],
        ],
        # Healthy community plot — no stress
        "stress_patch": None,
    },
    "f6": {
        "name": "Petak F — Sekinchan Baru",
        "coords": [
            [101.08988285064699, 3.5658492182458636],
            [101.10352993011475, 3.570603586713232],
            [101.10486030578615, 3.5670485207196885],
            [101.0911273956299, 3.5622513014403294],
        ],
        # Nitrogen deficiency (Oct 5–Oct 25) — uniform, field-wide EVI underperformance.
        # The base values already show the low EVI. Slight amplitude increase
        # during the deficiency window is handled via wider noise amplitude below.
        "stress_patch": None,
    },
}

# ── Per-field, per-date index values (clear acquisitions only) ─────────────────
# Matches demoFields.js timeSeries exactly. Cloudy dates omitted — no PNG needed.
INDEX_DATA = {
    # ── F1: Healthy MR297 benchmark ───────────────────────────────────────────
    "f1": {
        "2025-09-05": {"ndvi": 0.21, "evi": 0.17, "lswi": 0.61},
        "2025-09-10": {"ndvi": 0.27, "evi": 0.22, "lswi": 0.58},
        "2025-09-20": {"ndvi": 0.38, "evi": 0.31, "lswi": 0.53},
        "2025-09-30": {"ndvi": 0.50, "evi": 0.44, "lswi": 0.46},
        "2025-10-05": {"ndvi": 0.59, "evi": 0.52, "lswi": 0.41},
        "2025-10-15": {"ndvi": 0.68, "evi": 0.61, "lswi": 0.36},
        "2025-10-20": {"ndvi": 0.72, "evi": 0.65, "lswi": 0.33},
        "2025-10-25": {"ndvi": 0.75, "evi": 0.68, "lswi": 0.30},
        "2025-11-04": {"ndvi": 0.80, "evi": 0.73, "lswi": 0.27},
        "2025-11-09": {"ndvi": 0.82, "evi": 0.75, "lswi": 0.25},
        "2025-11-19": {"ndvi": 0.79, "evi": 0.72, "lswi": 0.22},
        "2025-11-24": {"ndvi": 0.74, "evi": 0.67, "lswi": 0.19},
        "2025-11-29": {"ndvi": 0.67, "evi": 0.60, "lswi": 0.16},
        "2025-12-04": {"ndvi": 0.55, "evi": 0.47, "lswi": 0.12},
    },
    # ── F2: Healthy MR269 — naturally ~7% lower NDVI/EVI than MR297 ──────────
    "f2": {
        "2025-09-05": {"ndvi": 0.20, "evi": 0.16, "lswi": 0.63},
        "2025-09-10": {"ndvi": 0.25, "evi": 0.20, "lswi": 0.60},
        "2025-09-20": {"ndvi": 0.35, "evi": 0.29, "lswi": 0.55},
        "2025-09-30": {"ndvi": 0.47, "evi": 0.41, "lswi": 0.47},
        "2025-10-05": {"ndvi": 0.55, "evi": 0.48, "lswi": 0.42},
        "2025-10-15": {"ndvi": 0.63, "evi": 0.56, "lswi": 0.37},
        "2025-10-20": {"ndvi": 0.67, "evi": 0.60, "lswi": 0.34},
        "2025-10-25": {"ndvi": 0.70, "evi": 0.63, "lswi": 0.31},
        "2025-11-04": {"ndvi": 0.74, "evi": 0.67, "lswi": 0.28},
        "2025-11-09": {"ndvi": 0.76, "evi": 0.69, "lswi": 0.26},
        "2025-11-19": {"ndvi": 0.73, "evi": 0.66, "lswi": 0.23},
        "2025-11-24": {"ndvi": 0.68, "evi": 0.61, "lswi": 0.20},
        "2025-11-29": {"ndvi": 0.62, "evi": 0.55, "lswi": 0.17},
        "2025-12-04": {"ndvi": 0.50, "evi": 0.43, "lswi": 0.13},
    },
    # ── F3: BLB outbreak — NDVI/EVI drop from Oct 20, LSWI unaffected ────────
    "f3": {
        "2025-09-05": {"ndvi": 0.22, "evi": 0.18, "lswi": 0.60},
        "2025-09-10": {"ndvi": 0.28, "evi": 0.23, "lswi": 0.57},
        "2025-09-20": {"ndvi": 0.39, "evi": 0.32, "lswi": 0.52},
        "2025-09-30": {"ndvi": 0.51, "evi": 0.45, "lswi": 0.45},
        "2025-10-05": {"ndvi": 0.60, "evi": 0.53, "lswi": 0.40},
        "2025-10-15": {"ndvi": 0.70, "evi": 0.63, "lswi": 0.35},
        "2025-10-20": {"ndvi": 0.67, "evi": 0.59, "lswi": 0.34},  # BLB visible
        "2025-10-25": {"ndvi": 0.63, "evi": 0.55, "lswi": 0.33},
        "2025-11-04": {"ndvi": 0.58, "evi": 0.49, "lswi": 0.31},  # 35% affected
        "2025-11-09": {"ndvi": 0.61, "evi": 0.53, "lswi": 0.30},
        "2025-11-19": {"ndvi": 0.64, "evi": 0.57, "lswi": 0.27},
        "2025-11-24": {"ndvi": 0.61, "evi": 0.54, "lswi": 0.24},
        "2025-11-29": {"ndvi": 0.55, "evi": 0.48, "lswi": 0.20},
        "2025-12-04": {"ndvi": 0.44, "evi": 0.37, "lswi": 0.14},  # harvest loss
    },
    # ── F4: Water stress — LSWI collapses Nov 4+, NDVI/EVI stay healthy ───────
    "f4": {
        "2025-09-05": {"ndvi": 0.22, "evi": 0.17, "lswi": 0.60},
        "2025-09-10": {"ndvi": 0.28, "evi": 0.22, "lswi": 0.57},
        "2025-09-20": {"ndvi": 0.37, "evi": 0.30, "lswi": 0.52},
        "2025-09-30": {"ndvi": 0.49, "evi": 0.43, "lswi": 0.46},
        "2025-10-05": {"ndvi": 0.58, "evi": 0.51, "lswi": 0.41},
        "2025-10-15": {"ndvi": 0.67, "evi": 0.60, "lswi": 0.36},
        "2025-10-20": {"ndvi": 0.71, "evi": 0.64, "lswi": 0.33},
        "2025-10-25": {"ndvi": 0.74, "evi": 0.67, "lswi": 0.30},
        "2025-11-04": {"ndvi": 0.76, "evi": 0.69, "lswi": 0.18},  # ⚠️ LSWI drop!
        "2025-11-09": {"ndvi": 0.74, "evi": 0.66, "lswi": 0.14},  # critical
        "2025-11-19": {"ndvi": 0.73, "evi": 0.65, "lswi": 0.21},  # recovering
        "2025-11-24": {"ndvi": 0.70, "evi": 0.63, "lswi": 0.19},
        "2025-11-29": {"ndvi": 0.64, "evi": 0.57, "lswi": 0.16},
        "2025-12-04": {"ndvi": 0.52, "evi": 0.45, "lswi": 0.13},
    },
    # ── F5: Healthy community plot (transplanted Sep 8) ───────────────────────
    "f5": {
        "2025-09-05": {"ndvi": 0.11, "evi": 0.09, "lswi": 0.68},  # pre-transplant
        "2025-09-10": {"ndvi": 0.20, "evi": 0.16, "lswi": 0.64},
        "2025-09-20": {"ndvi": 0.34, "evi": 0.28, "lswi": 0.56},
        "2025-09-30": {"ndvi": 0.48, "evi": 0.42, "lswi": 0.48},
        "2025-10-05": {"ndvi": 0.57, "evi": 0.51, "lswi": 0.43},
        "2025-10-15": {"ndvi": 0.66, "evi": 0.60, "lswi": 0.38},
        "2025-10-20": {"ndvi": 0.71, "evi": 0.64, "lswi": 0.34},
        "2025-10-25": {"ndvi": 0.74, "evi": 0.67, "lswi": 0.31},
        "2025-11-04": {"ndvi": 0.79, "evi": 0.72, "lswi": 0.28},
        "2025-11-09": {"ndvi": 0.81, "evi": 0.74, "lswi": 0.26},
        "2025-11-19": {"ndvi": 0.78, "evi": 0.71, "lswi": 0.23},
        "2025-11-24": {"ndvi": 0.73, "evi": 0.66, "lswi": 0.20},
        "2025-11-29": {"ndvi": 0.66, "evi": 0.59, "lswi": 0.17},
        "2025-12-04": {"ndvi": 0.54, "evi": 0.46, "lswi": 0.13},
    },
    # ── F6: Nitrogen deficiency Oct 5–25, corrected with urea Oct 8 ───────────
    "f6": {
        "2025-09-05": {"ndvi": 0.10, "evi": 0.08, "lswi": 0.66},  # pre-transplant
        "2025-09-10": {"ndvi": 0.20, "evi": 0.16, "lswi": 0.62},
        "2025-09-20": {"ndvi": 0.30, "evi": 0.24, "lswi": 0.56},
        "2025-09-30": {"ndvi": 0.41, "evi": 0.34, "lswi": 0.49},  # EVI lagging
        "2025-10-05": {"ndvi": 0.48, "evi": 0.40, "lswi": 0.44},  # 🟡 alert fires
        "2025-10-15": {"ndvi": 0.56, "evi": 0.47, "lswi": 0.39},  # recovering
        "2025-10-20": {"ndvi": 0.61, "evi": 0.53, "lswi": 0.36},
        "2025-10-25": {"ndvi": 0.66, "evi": 0.58, "lswi": 0.33},  # back in range
        "2025-11-04": {"ndvi": 0.73, "evi": 0.66, "lswi": 0.29},  # fully recovered
        "2025-11-09": {"ndvi": 0.76, "evi": 0.69, "lswi": 0.27},
        "2025-11-19": {"ndvi": 0.74, "evi": 0.67, "lswi": 0.24},
        "2025-11-24": {"ndvi": 0.70, "evi": 0.63, "lswi": 0.21},
        "2025-11-29": {"ndvi": 0.63, "evi": 0.56, "lswi": 0.18},
        "2025-12-04": {"ndvi": 0.51, "evi": 0.44, "lswi": 0.14},
    },
}

# ── Helper functions ───────────────────────────────────────────────────────────

def get_bounds(coords):
    """Get [[south, west], [north, east]] from polygon coords in [lng, lat]."""
    lngs = [c[0] for c in coords]
    lats = [c[1] for c in coords]
    return [[min(lats), min(lngs)], [max(lats), max(lngs)]]


def make_polygon_mask(coords, img_size, bounds):
    """Create a binary mask image of the polygon shape."""
    south, west = bounds[0]
    north, east = bounds[1]
    mask = Image.new("L", (img_size, img_size), 0)
    draw = ImageDraw.Draw(mask)

    def to_pixel(lng, lat):
        px = int((lng - west) / (east - west) * img_size)
        py = int((1 - (lat - south) / (north - south)) * img_size)
        return (px, py)

    pixels = [to_pixel(c[0], c[1]) for c in coords]
    draw.polygon(pixels, fill=255)
    return np.array(mask)


def make_noise_field(size, base_value, amplitude, seed=42):
    """Generate smooth spatial noise around a base value."""
    rng = np.random.default_rng(seed)
    noise = rng.random((size, size))
    smoothed = gaussian_filter(noise, sigma=size * 0.10)
    smoothed = gaussian_filter(smoothed, sigma=size * 0.05)
    smoothed = (smoothed - smoothed.mean()) / (smoothed.std() + 1e-8)
    smoothed = smoothed * amplitude
    return np.clip(base_value + smoothed, 0.0, 1.0)


def add_stress_patch(field_arr, corner, size_frac, depression, img_size):
    """Add a localized stress patch — feathered edges for realism."""
    h, w = field_arr.shape
    ph = int(h * size_frac)
    pw = int(w * size_frac)
    patch_mask = np.zeros((h, w))

    if corner == "bottom_left":
        patch_mask[h - ph:, :pw] = 1.0
    elif corner == "top_right":
        patch_mask[:ph, w - pw:] = 1.0
    elif corner == "bottom_right":
        patch_mask[h - ph:, w - pw:] = 1.0
    elif corner == "top_left":
        patch_mask[:ph, :pw] = 1.0
    elif corner == "center":
        # Near-uniform coverage (water stress / irrigation loss)
        cy, cx = h // 2, w // 2
        for y in range(h):
            for x in range(w):
                dist = math.hypot(x - cx, y - cy) / (max(h, w) * 0.7)
                patch_mask[y, x] = max(0.0, 1.0 - dist)

    patch_mask = gaussian_filter(patch_mask, sigma=ph * 0.4)
    return np.clip(field_arr + patch_mask * depression, 0.0, 1.0)


def value_to_rgba(value_array, index_key):
    """Convert 2D index values to RGBA using index-specific colormap."""
    cfg = CMAPS[index_key]
    norm = mcolors.Normalize(vmin=cfg["vmin"], vmax=cfg["vmax"])
    mapper = plt.cm.ScalarMappable(norm=norm, cmap=cfg["cmap"])
    rgba = mapper.to_rgba(value_array)
    return (rgba * 255).astype(np.uint8)


def should_stress(field_cfg, index_key, date_str):
    sp = field_cfg.get("stress_patch")
    if not sp:
        return False
    if index_key not in sp["indices"]:
        return False
    return date_str >= sp["dates_after"]


# ── Main generation ────────────────────────────────────────────────────────────

def generate_all():
    total = 0
    bounds_map = {}

    for field_id, field_cfg in FIELDS.items():
        coords = field_cfg["coords"]
        bounds = get_bounds(coords)
        bounds_map[field_id] = bounds
        polygon_mask = make_polygon_mask(coords, IMG_SIZE, bounds)

        dates_for_field = INDEX_DATA.get(field_id, {})

        for date_str, indices in dates_for_field.items():
            for index_key, base_value in indices.items():
                out_dir = os.path.join(OUTPUT_DIR, field_id, index_key)
                os.makedirs(out_dir, exist_ok=True)
                out_path = os.path.join(out_dir, f"{date_str}.png")

                seed = abs(hash(f"{field_id}{date_str}{index_key}")) % (2**31)

                # Wider spatial variance for stressed fields
                has_stress = field_cfg.get("stress_patch") is not None
                # Nitrogen window (F6 Oct 5–Oct 25) gets slightly wider amplitude
                is_f6_n_window = (field_id == "f6"
                                  and "2025-10-05" <= date_str <= "2025-10-25")
                amplitude = 0.09 if (has_stress or is_f6_n_window) else 0.065

                value_field = make_noise_field(IMG_SIZE, base_value, amplitude, seed=seed)

                if should_stress(field_cfg, index_key, date_str):
                    sp = field_cfg["stress_patch"]
                    value_field = add_stress_patch(
                        value_field,
                        corner=sp["corner"],
                        size_frac=sp["size"],
                        depression=sp["depression"],
                        img_size=IMG_SIZE,
                    )

                value_field = np.clip(value_field, 0.0, 1.0)
                rgba = value_to_rgba(value_field, index_key)

                # Apply polygon mask — outside polygon goes fully transparent
                alpha_mask = (polygon_mask > 128).astype(np.float32)
                rgba[:, :, 3] = (alpha_mask * 200).astype(np.uint8)

                img = Image.fromarray(rgba, "RGBA")
                img.save(out_path, "PNG")
                total += 1
                print(f"  ✓ {field_id}/{index_key}/{date_str}.png")

    # Write bounds JSON for frontend use
    bounds_path = os.path.join(OUTPUT_DIR, "bounds.json")
    with open(bounds_path, "w") as f:
        json.dump(bounds_map, f, indent=2)
    print(f"\n  ✓ bounds.json written")
    print(f"\n✅ Generated {total} heatmap tiles → {OUTPUT_DIR}")


if __name__ == "__main__":
    print("🌾 SawahSense — Generating Sekinchan Season 2 2025 heatmap tiles...\n")
    generate_all()
