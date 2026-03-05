/**
 * SawahSense Demo Field Data — Sekinchan, Selangor (IADA Barat Laut Selangor)
 * Season 2 / Musim Kedua 2025
 *   Transplanting : Sep 3–10, 2025
 *   Expected harvest : late Nov – early Dec 2025 (~90–100 days)
 *   Demo "now"    : Nov 4, 2025  (Booting / Early Heading, D+55–62)
 *
 * Dominant variety : MR297 (Siraj) — high-yielding, blast/BPH moderately resistant
 * Managing authority : IADA Barat Laut Selangor (BLS)
 * Yield benchmark : 8–12 t/ha  (vs national avg 4 t/ha)
 *
 * Three demo stories:
 *   F3 — Bacterial Leaf Blight (BLB) outbreak detected Oct 20 via NDVI/EVI patch in SE quadrant
 *   F4 — Irrigation channel blockage: LSWI collapses at heading while NDVI stays green (NDVI alone misses it!)
 *   F6 — Nitrogen deficiency caught at D+30, corrected with urea — near-full recovery
 *
 * Heatmap tiles: /public/demo-tiles/{fieldId}/{ndvi|evi|lswi}/{YYYY-MM-DD}.png
 * Set NEXT_PUBLIC_DEMO=true in .env.local to enable demo mode.
 */

// ── Transplanting dates ───────────────────────────────────────────────────────
const T1 = "2025-09-03"; // F1 — healthy benchmark
const T2 = "2025-09-05"; // F2 — healthy, MR269 variety
const T3 = "2025-09-06"; // F3 — BLB outbreak (critical)
const T4 = "2025-09-04"; // F4 — irrigation blockage / water stress (warning)
const T5 = "2025-09-08"; // F5 — healthy community plot
const T6 = "2025-09-10"; // F6 — nitrogen deficiency, corrected (warning → recovering)

// ── Helpers ───────────────────────────────────────────────────────────────────
function getBounds(coords) {
  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ];
}
function tilePath(fieldId) {
  return `/demo-tiles/${fieldId}`;
}

// ── Shared Sentinel-2 acquisition calendar (Sep 5 – Dec 4, 2025) ─────────────
// 5-day revisit | coastal Selangor — frequent inter-monsoon cloud cover
// Cloudy passes: Sep 15 (72%), Sep 25 (65%), Oct 10 (58%), Oct 30 (61%), Nov 14 (55%)
const SENTINEL_CALENDAR = [
  { date: "2025-09-05", cloudPct: 8 },
  { date: "2025-09-10", cloudPct: 6 },
  { date: "2025-09-15", cloudPct: 72 }, // ☁️ disabled
  { date: "2025-09-20", cloudPct: 11 },
  { date: "2025-09-25", cloudPct: 65 }, // ☁️ disabled
  { date: "2025-09-30", cloudPct: 9 },
  { date: "2025-10-05", cloudPct: 5 },
  { date: "2025-10-10", cloudPct: 58 }, // ☁️ disabled
  { date: "2025-10-15", cloudPct: 8 },
  { date: "2025-10-20", cloudPct: 7 },
  { date: "2025-10-25", cloudPct: 6 },
  { date: "2025-10-30", cloudPct: 61 }, // ☁️ disabled
  { date: "2025-11-04", cloudPct: 5 },
  { date: "2025-11-09", cloudPct: 4 },
  { date: "2025-11-14", cloudPct: 55 }, // ☁️ disabled
  { date: "2025-11-19", cloudPct: 8 },
  { date: "2025-11-24", cloudPct: 6 },
  { date: "2025-11-29", cloudPct: 5 },
  { date: "2025-12-04", cloudPct: 4 },
];

// ── DEMO_FIELDS ───────────────────────────────────────────────────────────────
export const DEMO_FIELDS = [
  // ══════════════════════════════════════════════════════════════════════
  // F1 — HEALTHY: MR297, textbook season — benchmark field
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "f1",
    name: "Petak A — Sekinchan Utara",
    location: "Sekinchan, Selangor",
    areaHa: 2.2,
    variety: "MR297",
    transplantingDate: T1,
    alertLevel: "healthy",
    // latestIndices = Nov 4 (D+62, booting/early heading — demo "now")
    latestIndices: { ndvi: 0.8, evi: 0.73, lswi: 0.27 },
    activeAlert: undefined,
    centroid: [3.5299550765592116, 101.13180041313173],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.12468719482423, 3.5275135499933956],
          [101.13683223724367, 3.535651981068987],
          [101.13893508911134, 3.5323537833894094],
          [101.12674713134767, 3.524300991785054],
          [101.12468719482423, 3.5275135499933956],
        ],
      ],
    },
    acquisitionDates: SENTINEL_CALENDAR,
    timeSeries: [
      { date: "2025-09-05", ndvi: 0.21, evi: 0.17, lswi: 0.61, cloudPct: 8 },
      { date: "2025-09-10", ndvi: 0.27, evi: 0.22, lswi: 0.58, cloudPct: 6 },
      { date: "2025-09-15", ndvi: 0.3, evi: 0.24, lswi: 0.56, cloudPct: 72 },
      { date: "2025-09-20", ndvi: 0.38, evi: 0.31, lswi: 0.53, cloudPct: 11 },
      { date: "2025-09-25", ndvi: 0.44, evi: 0.38, lswi: 0.5, cloudPct: 65 },
      { date: "2025-09-30", ndvi: 0.5, evi: 0.44, lswi: 0.46, cloudPct: 9 },
      { date: "2025-10-05", ndvi: 0.59, evi: 0.52, lswi: 0.41, cloudPct: 5 },
      { date: "2025-10-10", ndvi: 0.63, evi: 0.57, lswi: 0.38, cloudPct: 58 },
      { date: "2025-10-15", ndvi: 0.68, evi: 0.61, lswi: 0.36, cloudPct: 8 },
      { date: "2025-10-20", ndvi: 0.72, evi: 0.65, lswi: 0.33, cloudPct: 7 },
      { date: "2025-10-25", ndvi: 0.75, evi: 0.68, lswi: 0.3, cloudPct: 6 },
      { date: "2025-10-30", ndvi: 0.77, evi: 0.71, lswi: 0.28, cloudPct: 61 },
      { date: "2025-11-04", ndvi: 0.8, evi: 0.73, lswi: 0.27, cloudPct: 5 },
      { date: "2025-11-09", ndvi: 0.82, evi: 0.75, lswi: 0.25, cloudPct: 4 },
      { date: "2025-11-14", ndvi: 0.81, evi: 0.74, lswi: 0.23, cloudPct: 55 },
      { date: "2025-11-19", ndvi: 0.79, evi: 0.72, lswi: 0.22, cloudPct: 8 },
      { date: "2025-11-24", ndvi: 0.74, evi: 0.67, lswi: 0.19, cloudPct: 6 },
      { date: "2025-11-29", ndvi: 0.67, evi: 0.6, lswi: 0.16, cloudPct: 5 },
      { date: "2025-12-04", ndvi: 0.55, evi: 0.47, lswi: 0.12, cloudPct: 4 },
    ],
    tileBasePath: tilePath("f1"),
    heatmapBounds: getBounds([
      [101.12468719482423, 3.5275135499933956],
      [101.13683223724367, 3.535651981068987],
      [101.13893508911134, 3.5323537833894094],
      [101.12674713134767, 3.524300991785054],
    ]),
  },

  // ══════════════════════════════════════════════════════════════════════
  // F2 — HEALTHY: MR269 — naturally 5–8% lower EVI/NDVI than MR297
  //   Shows SawahSense is variety-aware (no false alarm for variety diff)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "f2",
    name: "Petak B — Sekinchan Tengah",
    location: "Sekinchan, Selangor",
    areaHa: 1.6,
    variety: "MR269",
    transplantingDate: T2,
    alertLevel: "healthy",
    latestIndices: { ndvi: 0.74, evi: 0.67, lswi: 0.28 },
    activeAlert: undefined,
    centroid: [3.5331997409699594, 101.12969219684601],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.12264871597291, 3.530683263209576],
          [101.13472938537599, 3.5387359994553473],
          [101.13674640655518, 3.535651981068987],
          [101.12464427948, 3.5277277201459274],
          [101.12264871597291, 3.530683263209576],
        ],
      ],
    },
    acquisitionDates: SENTINEL_CALENDAR,
    timeSeries: [
      { date: "2025-09-05", ndvi: 0.2, evi: 0.16, lswi: 0.63, cloudPct: 8 },
      { date: "2025-09-10", ndvi: 0.25, evi: 0.2, lswi: 0.6, cloudPct: 6 },
      { date: "2025-09-15", ndvi: 0.28, evi: 0.23, lswi: 0.58, cloudPct: 72 },
      { date: "2025-09-20", ndvi: 0.35, evi: 0.29, lswi: 0.55, cloudPct: 11 },
      { date: "2025-09-25", ndvi: 0.41, evi: 0.35, lswi: 0.51, cloudPct: 65 },
      { date: "2025-09-30", ndvi: 0.47, evi: 0.41, lswi: 0.47, cloudPct: 9 },
      { date: "2025-10-05", ndvi: 0.55, evi: 0.48, lswi: 0.42, cloudPct: 5 },
      { date: "2025-10-10", ndvi: 0.59, evi: 0.53, lswi: 0.39, cloudPct: 58 },
      { date: "2025-10-15", ndvi: 0.63, evi: 0.56, lswi: 0.37, cloudPct: 8 },
      { date: "2025-10-20", ndvi: 0.67, evi: 0.6, lswi: 0.34, cloudPct: 7 },
      { date: "2025-10-25", ndvi: 0.7, evi: 0.63, lswi: 0.31, cloudPct: 6 },
      { date: "2025-10-30", ndvi: 0.72, evi: 0.65, lswi: 0.29, cloudPct: 61 },
      { date: "2025-11-04", ndvi: 0.74, evi: 0.67, lswi: 0.28, cloudPct: 5 },
      { date: "2025-11-09", ndvi: 0.76, evi: 0.69, lswi: 0.26, cloudPct: 4 },
      { date: "2025-11-14", ndvi: 0.75, evi: 0.68, lswi: 0.24, cloudPct: 55 },
      { date: "2025-11-19", ndvi: 0.73, evi: 0.66, lswi: 0.23, cloudPct: 8 },
      { date: "2025-11-24", ndvi: 0.68, evi: 0.61, lswi: 0.2, cloudPct: 6 },
      { date: "2025-11-29", ndvi: 0.62, evi: 0.55, lswi: 0.17, cloudPct: 5 },
      { date: "2025-12-04", ndvi: 0.5, evi: 0.43, lswi: 0.13, cloudPct: 4 },
    ],
    tileBasePath: tilePath("f2"),
    heatmapBounds: getBounds([
      [101.12264871597291, 3.530683263209576],
      [101.13472938537599, 3.5387359994553473],
      [101.13674640655518, 3.535651981068987],
      [101.12464427948, 3.5277277201459274],
    ]),
  },

  // ══════════════════════════════════════════════════════════════════════
  // F3 — CRITICAL: Bacterial Leaf Blight (BLB / Hawar Daun Bakteria)
  //   First detectable: Oct 20 (D+47) — SE quadrant NDVI patch
  //   Spreads along irrigation rows from SE canal inlet
  //   Historical ref: Sekinchan 2016 BLB caused 50–70% loss
  //   Nov 4: ~35% field affected | est. 30–40% yield loss at harvest
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "f3",
    name: "Petak C — Sekinchan Timur",
    location: "Sekinchan, Selangor",
    areaHa: 3.1,
    variety: "MR297",
    transplantingDate: T3,
    alertLevel: "critical",
    latestIndices: { ndvi: 0.58, evi: 0.49, lswi: 0.31 },
    activeAlert: {
      type: "BLB_OUTBREAK",
      message_ms:
        "Anomali NDVI/EVI dikesan di kawasan Tenggara ladang — corak bermula dari pintu air dan merebak mengikut alur irigasi mencirikan Hawar Daun Bakteria (BLB). Sekinchan pernah kehilangan 50–70% hasil akibat BLB pada 2016.",
      message_en:
        "NDVI/EVI anomaly detected in SE quadrant — directional spread from water inlet along irrigation rows is consistent with Bacterial Leaf Blight (BLB). Sekinchan lost 50–70% yield to BLB in 2016.",
      percentDrop: 22,
      daysSpan: 5,
      detectedDate: "2025-10-20",
    },
    centroid: [3.5363587260532987, 101.12765908241273],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.12052440643312, 3.533895799348431],
          [101.13271236419679, 3.5420341744251918],
          [101.13477230072023, 3.5387359994553473],
          [101.1226272583008, 3.5307689309842245],
          [101.12052440643312, 3.533895799348431],
        ],
      ],
    },
    acquisitionDates: SENTINEL_CALENDAR,
    timeSeries: [
      { date: "2025-09-05", ndvi: 0.22, evi: 0.18, lswi: 0.6, cloudPct: 8 },
      { date: "2025-09-10", ndvi: 0.28, evi: 0.23, lswi: 0.57, cloudPct: 6 },
      { date: "2025-09-15", ndvi: 0.31, evi: 0.25, lswi: 0.55, cloudPct: 72 },
      { date: "2025-09-20", ndvi: 0.39, evi: 0.32, lswi: 0.52, cloudPct: 11 },
      { date: "2025-09-25", ndvi: 0.45, evi: 0.39, lswi: 0.48, cloudPct: 65 },
      { date: "2025-09-30", ndvi: 0.51, evi: 0.45, lswi: 0.45, cloudPct: 9 },
      { date: "2025-10-05", ndvi: 0.6, evi: 0.53, lswi: 0.4, cloudPct: 5 },
      { date: "2025-10-10", ndvi: 0.65, evi: 0.58, lswi: 0.37, cloudPct: 58 },
      { date: "2025-10-15", ndvi: 0.7, evi: 0.63, lswi: 0.35, cloudPct: 8 },
      // ⚠️ Oct 20 D+47 — BLB first detectable: SE corner NDVI 22% below field mean
      { date: "2025-10-20", ndvi: 0.67, evi: 0.59, lswi: 0.34, cloudPct: 7 },
      { date: "2025-10-25", ndvi: 0.63, evi: 0.55, lswi: 0.33, cloudPct: 6 },
      { date: "2025-10-30", ndvi: 0.6, evi: 0.51, lswi: 0.32, cloudPct: 61 },
      // 🔴 Nov 4 D+62 — ~35% field affected, spreading
      { date: "2025-11-04", ndvi: 0.58, evi: 0.49, lswi: 0.31, cloudPct: 5 },
      { date: "2025-11-09", ndvi: 0.61, evi: 0.53, lswi: 0.3, cloudPct: 4 },
      { date: "2025-11-14", ndvi: 0.63, evi: 0.55, lswi: 0.27, cloudPct: 55 },
      { date: "2025-11-19", ndvi: 0.64, evi: 0.57, lswi: 0.27, cloudPct: 8 },
      { date: "2025-11-24", ndvi: 0.61, evi: 0.54, lswi: 0.24, cloudPct: 6 },
      { date: "2025-11-29", ndvi: 0.55, evi: 0.48, lswi: 0.2, cloudPct: 5 },
      // Harvest ~30–40% yield loss
      { date: "2025-12-04", ndvi: 0.44, evi: 0.37, lswi: 0.14, cloudPct: 4 },
    ],
    tileBasePath: tilePath("f3"),
    heatmapBounds: getBounds([
      [101.12052440643312, 3.533895799348431],
      [101.13271236419679, 3.5420341744251918],
      [101.13477230072023, 3.5387359994553473],
      [101.1226272583008, 3.5307689309842245],
    ]),
  },

  // ══════════════════════════════════════════════════════════════════════
  // F4 — WARNING: Irrigation channel blockage — water stress at heading
  //   NDVI/EVI look perfectly green — only LSWI reveals the hidden crisis
  //   This is the key demo for why NDVI alone is insufficient
  //   Alert fires Nov 4. Channel cleared Nov 15–17. Est. 15–20% yield loss.
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "f4",
    name: "Petak D — Sekinchan Selatan",
    location: "Sekinchan, Selangor",
    areaHa: 2.5,
    variety: "MR297",
    transplantingDate: T4,
    alertLevel: "warning",
    latestIndices: { ndvi: 0.76, evi: 0.69, lswi: 0.18 },
    activeAlert: {
      type: "LSWI_LOW",
      message_ms:
        "LSWI (indeks kelembapan) ladang turun terlalu cepat — 47% di bawah paras normal untuk peringkat pembungaan. NDVI dan EVI masih normal — tanaman kelihatan hijau tetapi sebenarnya mengalami tekanan air. Semak pintu air dan saluran masuk segera.",
      message_en:
        "Moisture index (LSWI) dropped sharply — 47% below expected for heading stage. NDVI/EVI still normal — crop looks healthy but is water-stressed internally. Check irrigation inlet immediately.",
      percentDrop: 47,
      detectedDate: "2025-11-04",
    },
    centroid: [3.5347096303825603, 101.11130833625795],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.10434532165529, 3.5323537833894094],
          [101.11627578735353, 3.5401923379032407],
          [101.11829280853273, 3.5371083243634605],
          [101.10631942749023, 3.529184075874131],
          [101.10434532165529, 3.5323537833894094],
        ],
      ],
    },
    acquisitionDates: SENTINEL_CALENDAR,
    timeSeries: [
      { date: "2025-09-05", ndvi: 0.22, evi: 0.17, lswi: 0.6, cloudPct: 8 },
      { date: "2025-09-10", ndvi: 0.28, evi: 0.22, lswi: 0.57, cloudPct: 6 },
      { date: "2025-09-15", ndvi: 0.3, evi: 0.24, lswi: 0.55, cloudPct: 72 },
      { date: "2025-09-20", ndvi: 0.37, evi: 0.3, lswi: 0.52, cloudPct: 11 },
      { date: "2025-09-25", ndvi: 0.43, evi: 0.37, lswi: 0.49, cloudPct: 65 },
      { date: "2025-09-30", ndvi: 0.49, evi: 0.43, lswi: 0.46, cloudPct: 9 },
      { date: "2025-10-05", ndvi: 0.58, evi: 0.51, lswi: 0.41, cloudPct: 5 },
      { date: "2025-10-10", ndvi: 0.62, evi: 0.55, lswi: 0.38, cloudPct: 58 },
      { date: "2025-10-15", ndvi: 0.67, evi: 0.6, lswi: 0.36, cloudPct: 8 },
      { date: "2025-10-20", ndvi: 0.71, evi: 0.64, lswi: 0.33, cloudPct: 7 },
      { date: "2025-10-25", ndvi: 0.74, evi: 0.67, lswi: 0.3, cloudPct: 6 },
      { date: "2025-10-30", ndvi: 0.75, evi: 0.68, lswi: 0.24, cloudPct: 61 },
      // ⚠️ Nov 4 D+62 — LSWI collapses (channel blocked), NDVI/EVI still healthy!
      { date: "2025-11-04", ndvi: 0.76, evi: 0.69, lswi: 0.18, cloudPct: 5 },
      { date: "2025-11-09", ndvi: 0.74, evi: 0.66, lswi: 0.14, cloudPct: 4 },
      { date: "2025-11-14", ndvi: 0.73, evi: 0.65, lswi: 0.17, cloudPct: 55 },
      // Channel cleared Nov 15–17 — LSWI recovering
      { date: "2025-11-19", ndvi: 0.73, evi: 0.65, lswi: 0.21, cloudPct: 8 },
      { date: "2025-11-24", ndvi: 0.7, evi: 0.63, lswi: 0.19, cloudPct: 6 },
      { date: "2025-11-29", ndvi: 0.64, evi: 0.57, lswi: 0.16, cloudPct: 5 },
      { date: "2025-12-04", ndvi: 0.52, evi: 0.45, lswi: 0.13, cloudPct: 4 },
    ],
    tileBasePath: tilePath("f4"),
    heatmapBounds: getBounds([
      [101.10434532165529, 3.5323537833894094],
      [101.11627578735353, 3.5401923379032407],
      [101.11829280853273, 3.5371083243634605],
      [101.10631942749023, 3.529184075874131],
    ]),
  },

  // ══════════════════════════════════════════════════════════════════════
  // F5 — HEALTHY: Community plot, daily managed — second benchmark
  //   Transplanted Sep 8. Highest peak NDVI due to consistent management.
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "f5",
    name: "Petak E — Ladang Komuniti",
    location: "Sekinchan, Selangor",
    areaHa: 4.0,
    variety: "MR297",
    transplantingDate: T5,
    alertLevel: "healthy",
    latestIndices: { ndvi: 0.79, evi: 0.72, lswi: 0.28 },
    activeAlert: undefined,
    centroid: [3.5379221525330142, 101.10921621322632],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.10219955444336, 3.5355663137451248],
          [101.11421585083009, 3.5434476743868255],
          [101.11623287200929, 3.540278004799458],
          [101.10421657562256, 3.5323966172006482],
          [101.10219955444336, 3.5355663137451248],
        ],
      ],
    },
    acquisitionDates: SENTINEL_CALENDAR,
    // Note: transplanted Sep 8 — Sep 5 is pre-transplant (bare flooded soil)
    timeSeries: [
      { date: "2025-09-05", ndvi: 0.11, evi: 0.09, lswi: 0.68, cloudPct: 8 }, // pre-transplant
      { date: "2025-09-10", ndvi: 0.2, evi: 0.16, lswi: 0.64, cloudPct: 6 }, // D+2
      { date: "2025-09-15", ndvi: 0.24, evi: 0.19, lswi: 0.61, cloudPct: 72 },
      { date: "2025-09-20", ndvi: 0.34, evi: 0.28, lswi: 0.56, cloudPct: 11 },
      { date: "2025-09-25", ndvi: 0.41, evi: 0.35, lswi: 0.52, cloudPct: 65 },
      { date: "2025-09-30", ndvi: 0.48, evi: 0.42, lswi: 0.48, cloudPct: 9 },
      { date: "2025-10-05", ndvi: 0.57, evi: 0.51, lswi: 0.43, cloudPct: 5 },
      { date: "2025-10-10", ndvi: 0.62, evi: 0.56, lswi: 0.4, cloudPct: 58 },
      { date: "2025-10-15", ndvi: 0.66, evi: 0.6, lswi: 0.38, cloudPct: 8 },
      { date: "2025-10-20", ndvi: 0.71, evi: 0.64, lswi: 0.34, cloudPct: 7 },
      { date: "2025-10-25", ndvi: 0.74, evi: 0.67, lswi: 0.31, cloudPct: 6 },
      { date: "2025-10-30", ndvi: 0.77, evi: 0.7, lswi: 0.29, cloudPct: 61 },
      { date: "2025-11-04", ndvi: 0.79, evi: 0.72, lswi: 0.28, cloudPct: 5 },
      { date: "2025-11-09", ndvi: 0.81, evi: 0.74, lswi: 0.26, cloudPct: 4 },
      { date: "2025-11-14", ndvi: 0.8, evi: 0.73, lswi: 0.24, cloudPct: 55 },
      { date: "2025-11-19", ndvi: 0.78, evi: 0.71, lswi: 0.23, cloudPct: 8 },
      { date: "2025-11-24", ndvi: 0.73, evi: 0.66, lswi: 0.2, cloudPct: 6 },
      { date: "2025-11-29", ndvi: 0.66, evi: 0.59, lswi: 0.17, cloudPct: 5 },
      { date: "2025-12-04", ndvi: 0.54, evi: 0.46, lswi: 0.13, cloudPct: 4 },
    ],
    tileBasePath: tilePath("f5"),
    heatmapBounds: getBounds([
      [101.10219955444336, 3.5355663137451248],
      [101.11421585083009, 3.5434476743868255],
      [101.11623287200929, 3.540278004799458],
      [101.10421657562256, 3.5323966172006482],
    ]),
  },

  // ══════════════════════════════════════════════════════════════════════
  // F6 — WARNING (resolved): Nitrogen deficiency detected early at D+30
  //   Wrong NPK ratio at basal — EVI uniformly low (field-wide, no patches)
  //   Alert fired Oct 5. Urea top-dressed Oct 8. Fully recovered by Nov 4.
  //   Key story: early detection = correctable outcome
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "f6",
    name: "Petak F — Sekinchan Baru",
    location: "Sekinchan, Selangor",
    areaHa: 1.8,
    variety: "MR297",
    transplantingDate: T6,
    alertLevel: "warning",
    latestIndices: { ndvi: 0.73, evi: 0.66, lswi: 0.29 },
    activeAlert: {
      type: "EVI_LOW_NUTRIENT",
      message_ms:
        "EVI ladang 17% lebih rendah daripada julat normal untuk Hari 30 peringkat anakan — corak seragam merata ladang menunjukkan kekurangan nutrien (bukan serangan perosak). Semak nisbah NPK baja basal yang digunakan.",
      message_en:
        "Field EVI 17% below expected for Day 30 tillering — uniform field-wide pattern indicates nutrient deficiency (not pest). Check basal fertiliser NPK ratio. MR297 standard: 15:15:15.",
      percentDrop: 17,
      detectedDate: "2025-10-05",
      resolvedDate: "2025-10-25",
    },
    centroid: [3.5664381567797783, 101.09735012054443],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.08988285064699, 3.5658492182458636],
          [101.10352993011475, 3.570603586713232],
          [101.10486030578615, 3.5670485207196885],
          [101.0911273956299, 3.5622513014403294],
          [101.08988285064699, 3.5658492182458636],
        ],
      ],
    },
    acquisitionDates: SENTINEL_CALENDAR,
    // Transplanted Sep 10 — Sept 5 data is pre-transplant bare soil
    timeSeries: [
      { date: "2025-09-05", ndvi: 0.1, evi: 0.08, lswi: 0.66, cloudPct: 8 }, // pre-transplant
      { date: "2025-09-10", ndvi: 0.2, evi: 0.16, lswi: 0.62, cloudPct: 6 }, // D+0 transplanting
      { date: "2025-09-15", ndvi: 0.23, evi: 0.18, lswi: 0.59, cloudPct: 72 },
      { date: "2025-09-20", ndvi: 0.3, evi: 0.24, lswi: 0.56, cloudPct: 11 },
      { date: "2025-09-25", ndvi: 0.36, evi: 0.29, lswi: 0.52, cloudPct: 65 },
      { date: "2025-09-30", ndvi: 0.41, evi: 0.34, lswi: 0.49, cloudPct: 9 }, // ⚠️ EVI 0.10 below expected
      { date: "2025-10-05", ndvi: 0.48, evi: 0.4, lswi: 0.44, cloudPct: 5 }, // 🟡 Alert fires — EVI 17% low
      { date: "2025-10-10", ndvi: 0.52, evi: 0.44, lswi: 0.41, cloudPct: 58 },
      { date: "2025-10-15", ndvi: 0.56, evi: 0.47, lswi: 0.39, cloudPct: 8 }, // recovering after urea Oct 8
      { date: "2025-10-20", ndvi: 0.61, evi: 0.53, lswi: 0.36, cloudPct: 7 },
      { date: "2025-10-25", ndvi: 0.66, evi: 0.58, lswi: 0.33, cloudPct: 6 }, // back in normal range
      { date: "2025-10-30", ndvi: 0.7, evi: 0.63, lswi: 0.31, cloudPct: 61 },
      { date: "2025-11-04", ndvi: 0.73, evi: 0.66, lswi: 0.29, cloudPct: 5 }, // fully recovered
      { date: "2025-11-09", ndvi: 0.76, evi: 0.69, lswi: 0.27, cloudPct: 4 },
      { date: "2025-11-14", ndvi: 0.75, evi: 0.68, lswi: 0.25, cloudPct: 55 },
      { date: "2025-11-19", ndvi: 0.74, evi: 0.67, lswi: 0.24, cloudPct: 8 },
      { date: "2025-11-24", ndvi: 0.7, evi: 0.63, lswi: 0.21, cloudPct: 6 },
      { date: "2025-11-29", ndvi: 0.63, evi: 0.56, lswi: 0.18, cloudPct: 5 },
      { date: "2025-12-04", ndvi: 0.51, evi: 0.44, lswi: 0.14, cloudPct: 4 },
    ],
    tileBasePath: tilePath("f6"),
    heatmapBounds: getBounds([
      [101.08988285064699, 3.5658492182458636],
      [101.10352993011475, 3.570603586713232],
      [101.10486030578615, 3.5670485207196885],
      [101.0911273956299, 3.5622513014403294],
    ]),
  },
];

// ── Exports ────────────────────────────────────────────────────────────────────

export function getFieldsSortedByAlert() {
  const order = { critical: 0, warning: 1, healthy: 2 };
  return [...DEMO_FIELDS].sort(
    (a, b) => order[a.alertLevel] - order[b.alertLevel],
  );
}

/**
 * Get the latest non-cloudy acquisition date for a field.
 */
export function getLatestClearDate(field) {
  if (!field.acquisitionDates) return null;
  const clear = [...field.acquisitionDates]
    .reverse()
    .find((d) => d.cloudPct <= 40);
  return clear?.date ?? null;
}

/**
 * Build the heatmap tile URL for a given field, index, and date.
 * Returns null if the field has no tile config.
 */
export function getHeatmapTileUrl(field, index, date) {
  if (!field.tileBasePath || !date) return null;
  return `${field.tileBasePath}/${index.toLowerCase()}/${date}.png`;
}
