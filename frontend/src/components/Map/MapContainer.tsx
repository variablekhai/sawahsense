"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Wheat, Pencil, Info } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface Field {
  id: string;
  name: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  centroid: [number, number];
  alertLevel: "healthy" | "warning" | "critical";
  latestIndices: { ndvi: number; evi: number; lswi: number };
  activeAlert?: {
    type: string;
    message_ms: string;
    message_en: string;
  };
  heatmapBounds?: [[number, number], [number, number]];
  tileBasePath?: string;
  acquisitionDates?: Array<{ date: string; cloudPct: number }>;
}

interface NewFieldDraft {
  latlngs: [number, number][];
  layer: any;
}

interface MapContainerProps {
  fields: Field[];
  selectedFieldId: string | null;
  onFieldSelect: (fieldId: string | null) => void;
  onFieldAdd?: (
    field: Omit<Field, "id" | "timeSeries" | "transplantingDate">,
  ) => void;
  activeIndex: "NDVI" | "EVI" | "LSWI";
  onActiveIndexChange: (index: "NDVI" | "EVI" | "LSWI") => void;
  lang: "ms" | "en";
  onAmbientCardTrigger: (field: Field) => void;
  /** The currently selected satellite acquisition date (from BottomPanel) */
  selectedDate: string | null;
  /** Height of the bottom panel in px so the legend floats above it */
  bottomOffset?: number;
  /** Imperative ref so the sidebar/parent can trigger draw mode */
  startDrawingRef?: React.MutableRefObject<(() => void) | null>;
  /** Imperative ref so the sidebar/parent can cancel drawing mode */
  cancelDrawingRef?: React.MutableRefObject<(() => void) | null>;
  /** Imperative ref so the onboarding sidebar can fly to a location */
  flyToRef?: React.MutableRefObject<
    ((lat: number, lng: number) => void) | null
  >;
  /** When true, AddFieldModal is suppressed — parent uses confirmFieldRef instead */
  suppressFieldModal?: boolean;
  /** Imperative ref to confirm the drawn field from onboarding step 3 */
  confirmFieldRef?: React.MutableRefObject<
    ((name: string, variety: string, sowingDate: string) => void) | null
  >;
  /** Inform parent/sidebar when field-adding flow is active and if a draft polygon exists */
  onAddFieldStateChange?: (isAdding: boolean, hasDraft?: boolean) => void;
  /** Initial map center — defaults to first field centroid */
  initialCenter?: [number, number];
  /** Initial map zoom level */
  initialZoom?: number;
}

const ALERT_COLORS = {
  critical: "#f85149",
  warning: "#d29922",
  healthy: "#3fb950",
};

// ─── Index legend definitions  ────────────────────────────────────────────────
const INDEX_LEGENDS = {
  NDVI: {
    label: { ms: "Indeks Kehijauan (NDVI)", en: "Vegetation Index (NDVI)" },
    description: {
      ms: "Menunjukkan kepadatan dan tahap kesihatan tanaman. Nilai tinggi bermaksud tanaman rimbun dan subur.",
      en: "Measures crop density and health. Higher values indicate lush, healthy vegetation.",
    },
    stops: [
      {
        value: "< 0.2",
        color: "#8b0000",
        label: { ms: "Tiada tumbuhan", en: "No vegetation" },
      },
      {
        value: "0.2–0.4",
        color: "#d29922",
        label: { ms: "Tumbuhan nipis", en: "Sparse / young" },
      },
      {
        value: "0.4–0.6",
        color: "#74c476",
        label: { ms: "Sederhana", en: "Moderate" },
      },
      {
        value: "0.6–0.75",
        color: "#3fb950",
        label: { ms: "Sihat", en: "Healthy" },
      },
      {
        value: "> 0.75",
        color: "#1a7f37",
        label: { ms: "Sangat sihat", en: "Very healthy" },
      },
    ],
  },
  EVI: {
    label: { ms: "Kehijauan Kanopi (EVI)", en: "Canopy Greenness (EVI)" },
    description: {
      ms: "Mengukur kesihatan tanaman dengan lebih tepat di kawasan padi yang sangat lebat dan padat.",
      en: "Accurately monitors crop health, especially in very dense and thick paddy fields.",
    },
    stops: [
      {
        value: "< 0.15",
        color: "#8b0000",
        label: { ms: "Sangat rendah", en: "Very low" },
      },
      {
        value: "0.15–0.35",
        color: "#d29922",
        label: { ms: "Rendah", en: "Low" },
      },
      {
        value: "0.35–0.55",
        color: "#74c476",
        label: { ms: "Sederhana", en: "Moderate" },
      },
      {
        value: "0.55–0.70",
        color: "#3fb950",
        label: { ms: "Baik", en: "Good" },
      },
      {
        value: "> 0.70",
        color: "#1a7f37",
        label: { ms: "Sangat baik", en: "Excellent" },
      },
    ],
  },
  LSWI: {
    label: { ms: "Kandungan Air (LSWI)", en: "Water Content (LSWI)" },
    description: {
      ms: "Mengukur jumlah cecair dalam daun dan tanah. Penting untuk tahu jika padi sedang kekeringan.",
      en: "Detects the amount of moisture in leaves and soil. Useful to know if the paddy needs more water.",
    },
    stops: [
      {
        value: "< 0.1",
        color: "#f85149",
        label: { ms: "Kering kritikal", en: "Critically dry" },
      },
      {
        value: "0.1–0.25",
        color: "#d29922",
        label: { ms: "Kering", en: "Dry / low water" },
      },
      {
        value: "0.25–0.40",
        color: "#58a6ff",
        label: { ms: "Mencukupi", en: "Sufficient" },
      },
      {
        value: "0.40–0.55",
        color: "#2171b5",
        label: { ms: "Baik", en: "Good" },
      },
      {
        value: "> 0.55",
        color: "#084594",
        label: { ms: "Penuh air", en: "Well saturated" },
      },
    ],
  },
};

// ─── Add Field Modal ──────────────────────────────────────────────────────────
interface AddFieldModalProps {
  draft: NewFieldDraft;
  onConfirm: (name: string, variety: string, sowingDate: string) => void;
  onCancel: () => void;
  lang: "ms" | "en";
}

function AddFieldModal({
  draft,
  onConfirm,
  onCancel,
  lang,
}: AddFieldModalProps) {
  const [name, setName] = useState("");
  const [variety, setVariety] = useState("MR263");
  const [sowingDate, setSowingDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  // Calculate approximate area from latlngs (shoelace formula)
  const areaSqkm = (() => {
    if (draft.latlngs.length < 3) return 0;
    let area = 0;
    const n = draft.latlngs.length;
    for (let i = 0; i < n; i++) {
      const [lat1, lng1] = draft.latlngs[i];
      const [lat2, lng2] = draft.latlngs[(i + 1) % n];
      area += lng1 * lat2 - lng2 * lat1;
    }
    // Convert to ha (rough: 1 deg lat ≈ 111km, 1 deg lng ≈ 111*cos(lat) km)
    const lat = (draft.latlngs[0][0] * Math.PI) / 180;
    const haPerDegSq = (111000 * 111000 * Math.cos(lat)) / 10000;
    return Math.abs(area / 2) * haPerDegSq;
  })();

  const handleConfirm = () => {
    if (!name.trim() || !sowingDate) return;
    onConfirm(name.trim(), variety, sowingDate);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          padding: "28px 28px 24px",
          width: "360px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          animation: "fade-in 0.2s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: "var(--accent-green-dim)",
              border: "1px solid var(--accent-green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Wheat size={16} color="var(--accent-green)" strokeWidth={1.5} />
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "1.0625rem",
                color: "var(--text-primary)",
              }}
            >
              {lang === "ms" ? "Ladang Baru" : "New Field"}
            </h3>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                fontFamily: "IBM Plex Sans, sans-serif",
              }}
            >
              {lang === "ms"
                ? `Kawasan: ~${areaSqkm.toFixed(1)} ha`
                : `Area: ~${areaSqkm.toFixed(1)} ha`}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Field Name */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "0.8125rem",
                fontFamily: "IBM Plex Sans, sans-serif",
                color: "var(--text-secondary)",
                fontWeight: 500,
              }}
            >
              {lang === "ms" ? "Nama Ladang *" : "Field Name *"}
            </label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              placeholder={
                lang === "ms"
                  ? "cth: Petak G — Ladang Saya"
                  : "e.g. Plot G — My Field"
              }
            />
          </div>

          {/* Variety */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "0.8125rem",
                fontFamily: "IBM Plex Sans, sans-serif",
                color: "var(--text-secondary)",
                fontWeight: 500,
              }}
            >
              {lang === "ms" ? "Varieti Padi" : "Paddy Variety"}
            </label>
            <select
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "9px 12px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--text-primary)",
                fontSize: "0.875rem",
                fontFamily: "IBM Plex Sans, sans-serif",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="MR263">MR263</option>
              <option value="MR219">MR219</option>
              <option value="MR284">MR284</option>
              <option value="MR308">MR308</option>
              <option value="lain">Lain-lain / Other</option>
            </select>
          </div>

          {/* Sowing Date */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "0.8125rem",
                fontFamily: "IBM Plex Sans, sans-serif",
                color: "var(--text-secondary)",
                fontWeight: 500,
              }}
            >
              {lang === "ms" ? "Tarikh Menyemai *" : "Sowing Date *"}
            </label>
            <Input
              type="date"
              value={sowingDate}
              onChange={(e) => setSowingDate(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <Button variant="outline" onClick={onCancel} style={{ flex: 1 }}>
            {lang === "ms" ? "Batal" : "Cancel"}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!name.trim() || !sowingDate}
            style={{ flex: 2 }}
          >
            <Wheat
              size={14}
              color={
                name.trim() && sowingDate ? "#0d1117" : "var(--text-muted)"
              }
              strokeWidth={2}
            />
            {lang === "ms" ? "Tambah Ladang" : "Add Field"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Index Toggle + Legend ────────────────────────────────────────────────────
interface IndexToggleBarProps {
  activeIndex: "NDVI" | "EVI" | "LSWI";
  onActiveIndexChange: (i: "NDVI" | "EVI" | "LSWI") => void;
  lang: "ms" | "en";
  bottomOffset?: number;
}

function IndexToggleBar({
  activeIndex,
  onActiveIndexChange,
  lang,
  bottomOffset = 52,
}: IndexToggleBarProps) {
  const [showLegend, setShowLegend] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const indices = [
    { key: "NDVI" as const, color: "#3fb950" },
    { key: "EVI" as const, color: "#39d353" },
    { key: "LSWI" as const, color: "#58a6ff" },
  ];

  const legend = INDEX_LEGENDS[activeIndex];

  const handleIndexClick = (key: "NDVI" | "EVI" | "LSWI") => {
    if (key === activeIndex) {
      setShowLegend((s) => !s);
    } else {
      onActiveIndexChange(key);
      setShowLegend(true);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: `${bottomOffset + 12}px`,
        right: "16px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        alignItems: "flex-end",
        transition: "bottom 0.3s ease",
      }}
    >
      {/* Index buttons */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          background: "rgba(22, 27, 34, 0.92)",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          padding: "4px",
          backdropFilter: "blur(8px)",
        }}
      >
        {indices.map(({ key, color }) => {
          const isActive = activeIndex === key;
          return (
            <button
              key={key}
              onClick={() => handleIndexClick(key)}
              title={
                lang === "ms"
                  ? "Klik untuk tukar / tunjuk legenda"
                  : "Click to switch / show legend"
              }
              style={{
                padding: "4px 12px",
                borderRadius: "20px",
                border: "none",
                background: isActive ? color + "20" : "transparent",
                color: isActive ? color : "var(--text-secondary)",
                fontSize: "0.75rem",
                fontFamily: "IBM Plex Mono, monospace",
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s ease",
                outline: isActive ? `1px solid ${color}40` : "none",
              }}
            >
              {key}
            </button>
          );
        })}
      </div>

      {/* Legend panel */}
      {showLegend && (
        <div
          className="animate-fade-in"
          style={{
            background: "rgba(22, 27, 34, 0.96)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "10px 12px",
            backdropFilter: "blur(12px)",
            minWidth: "200px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  fontSize: "0.625rem",
                  fontFamily: "IBM Plex Mono, monospace",
                  color: "var(--text-muted)",
                  letterSpacing: "0.08em",
                }}
              >
                {legend.label[lang].toUpperCase()}
              </span>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  padding: "4px 8px",
                  marginLeft: "2px",
                }}
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
              >
                <Info
                  size={14}
                  color="var(--text-muted)"
                  style={{ cursor: "help" }}
                />
                {showInfo && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "100%",
                      right: "-8px",
                      marginBottom: "4px",
                      width: "200px",
                      padding: "10px",
                      background: "rgba(13, 17, 23, 0.98)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      color: "var(--text-secondary)",
                      fontSize: "0.6875rem",
                      fontFamily: "IBM Plex Sans, sans-serif",
                      lineHeight: 1.4,
                      textAlign: "right",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                      zIndex: 1000,
                      wordBreak: "break-word",
                    }}
                  >
                    {legend.description[lang]}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowLegend(false)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "0.875rem",
                lineHeight: 1,
                padding: "0 2px",
              }}
            >
              ×
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {legend.stops.map((stop) => (
              <div
                key={stop.value}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    width: 28,
                    height: 10,
                    borderRadius: "3px",
                    background: stop.color,
                    flexShrink: 0,
                    display: "inline-block",
                    boxShadow: `0 0 6px ${stop.color}60`,
                  }}
                />
                <span
                  style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: "0.625rem",
                    color: "var(--text-secondary)",
                    minWidth: "52px",
                  }}
                >
                  {stop.value}
                </span>
                <span
                  style={{
                    fontFamily: "IBM Plex Sans, sans-serif",
                    fontSize: "0.6875rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {stop.label[lang]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main MapContainer ─────────────────────────────────────────────────────────
export default function MapContainer({
  fields,
  selectedFieldId,
  onFieldSelect,
  onFieldAdd,
  activeIndex,
  onActiveIndexChange,
  lang,
  onAmbientCardTrigger,
  selectedDate,
  bottomOffset = 40,
  startDrawingRef,
  cancelDrawingRef,
  flyToRef,
  suppressFieldModal = false,
  confirmFieldRef,
  onAddFieldStateChange,
  initialCenter = [3.481, 101.0268],
  initialZoom,
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const polygonsRef = useRef<Map<string, any>>(new Map());
  const markersRef = useRef<Map<string, any>>(new Map());
  const overlaysRef = useRef<Map<string, any>>(new Map());
  const polygonDrawHandlerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [newFieldDraft, setNewFieldDraft] = useState<NewFieldDraft | null>(
    null,
  );

  const initMap = useCallback(async () => {
    if (typeof window === "undefined" || mapInstanceRef.current) return;

    const L = (await import("leaflet")).default;
    await import("leaflet/dist/leaflet.css");

    try {
      await import("leaflet-draw/dist/leaflet.draw.css");
      await import("leaflet-draw");
    } catch (e) {
      console.warn("leaflet-draw not loaded:", e);
    }

    // Centre on first field (or Sekinchan/Malaysia fallback)
    const map = L.map(mapRef.current!, {
      center: initialCenter,
      zoom: initialZoom || 14,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri &mdash; Esri, Maxar, GeoEye",
        maxZoom: 19,
      },
    ).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    // Setup leaflet-draw feature group
    const drawnItems = new (L as any).FeatureGroup().addTo(map);

    // Listen for polygon completion
    map.on("draw:created", (e: any) => {
      const layer = e.layer;
      drawnItems.clearLayers(); // only keep latest
      drawnItems.addLayer(layer);

      const latlngs: [number, number][] = layer
        .getLatLngs()[0]
        .map((ll: any) => [ll.lat, ll.lng]);
      setNewFieldDraft({ latlngs, layer });
      setDrawMode(false);
      polygonDrawHandlerRef.current?.disable?.();
      polygonDrawHandlerRef.current = null;
    });

    map.on("draw:drawstart", () => setDrawMode(true));
    map.on("draw:drawstop", () => setDrawMode(false));

    // Store draw items ref on map for later access
    (map as any)._drawnItemsLayer = drawnItems;
    mapInstanceRef.current = map;
    setMapReady(true);
  }, []);

  useEffect(() => {
    initMap();

    let observer: ResizeObserver | null = null;
    if (mapRef.current) {
      observer = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      observer.observe(mapRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initMap]);

  // Render field polygons
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const load = async () => {
      const L = (await import("leaflet")).default;
      const map = mapInstanceRef.current;

      polygonsRef.current.forEach((p) => map.removeLayer(p));
      markersRef.current.forEach((m) => map.removeLayer(m));
      overlaysRef.current.forEach((o) => map.removeLayer(o));
      polygonsRef.current.clear();
      markersRef.current.clear();
      overlaysRef.current.clear();

      for (const field of fields) {
        const isSelected = field.id === selectedFieldId;
        const alertColor = ALERT_COLORS[field.alertLevel];

        const isHeatmapVisible =
          !!field.tileBasePath && !!field.heatmapBounds && !!selectedDate;
        const tileUrl = isHeatmapVisible
          ? `${field.tileBasePath}/${activeIndex.toLowerCase()}/${selectedDate}.png`
          : null;

        const polygon = L.polygon(
          field.geometry.coordinates[0].map(
            ([lng, lat]) => [lat, lng] as [number, number],
          ),
          {
            color: isSelected ? "#39d353" : alertColor,
            fillColor: isSelected ? "#39d353" : alertColor,
            fillOpacity: isHeatmapVisible ? 0 : isSelected ? 0.22 : 0.14,
            weight: isSelected ? 2.5 : 1.5,
          },
        ).addTo(map);

        const dotIcon = L.divIcon({
          html: `<div style="
            width: 10px; height: 10px; border-radius: 50%;
            background: ${alertColor};
            border: 2px solid #0d1117;
            box-shadow: 0 0 ${isSelected ? "8px" : "4px"} ${alertColor}80;
          "></div>`,
          className: "",
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });

        const marker = L.marker(field.centroid, { icon: dotIcon }).addTo(map);

        const tooltipHtml = `
          <div style="font-family:'IBM Plex Sans',sans-serif;min-width:240px;max-width:420px;white-space:normal;word-break:break-word;overflow-wrap:anywhere;">
            <div style="font-weight:600;color:#e6edf3;margin-bottom:6px;font-size:0.875rem;">${field.name}</div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:0.75rem;color:#c9d1d9;display:flex;gap:10px;flex-wrap:wrap;">
              <span>NDVI <span style="color:#3fb950;font-weight:600;">${field.latestIndices.ndvi.toFixed(2)}</span></span>
              <span>EVI <span style="color:#39d353;font-weight:600;">${field.latestIndices.evi.toFixed(2)}</span></span>
              <span>LSWI <span style="color:#58a6ff;font-weight:600;">${field.latestIndices.lswi.toFixed(2)}</span></span>
            </div>
            ${field.activeAlert ? `<div style="color:${alertColor};font-size:0.75rem;margin-top:6px;line-height:1.4;font-weight:500;">&#9651; ${lang === "ms" ? field.activeAlert.message_ms : field.activeAlert.message_en}</div>` : ""}
          </div>
        `;

        polygon.bindTooltip(tooltipHtml, {
          sticky: true,
          className: "sawahsense-tooltip",
        });

        const handleClick = () => {
          onFieldSelect(field.id);
          if (field.activeAlert) onAmbientCardTrigger(field);
          map.flyTo(field.centroid, 14, { animate: true, duration: 0.8 });
        };

        polygon.on("click", handleClick);
        marker.on("click", handleClick);

        polygonsRef.current.set(field.id, polygon);
        markersRef.current.set(field.id, marker);

        if (tileUrl && field.heatmapBounds) {
          const overlay = L.imageOverlay(tileUrl, field.heatmapBounds, {
            opacity: isSelected ? 0.92 : 0.72,
            interactive: true,
          }).addTo(map);

          overlay.on("click", handleClick);
          overlay.bindTooltip(tooltipHtml, {
            sticky: true,
            className: "sawahsense-tooltip",
          });

          overlaysRef.current.set(field.id, overlay);
        }
      }
    };
    load();
  }, [
    mapReady,
    fields,
    selectedFieldId,
    onFieldSelect,
    onAmbientCardTrigger,
    lang,
    activeIndex,
    selectedDate,
  ]);

  // Fly to selected field
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !selectedFieldId) return;
    const field = fields.find((f) => f.id === selectedFieldId);
    if (field)
      mapInstanceRef.current.flyTo(field.centroid, 14, {
        animate: true,
        duration: 0.8,
      });
  }, [selectedFieldId, mapReady, fields]);

  // Toggle draw mode — also exposed via startDrawingRef for sidebar button
  const startDrawing = useCallback(async () => {
    if (!mapInstanceRef.current) return;
    const L = (await import("leaflet")).default;
    const map = mapInstanceRef.current;

    // Activate polygon draw directly
    if (!(L as any).Draw) {
      console.warn("leaflet-draw not available");
      return;
    }

    const polygonHandler = new (L as any).Draw.Polygon(map, {
      shapeOptions: {
        color: "#3fb950",
        fillColor: "#3fb950",
        fillOpacity: 0.15,
        weight: 2,
        dashArray: "5 5",
      },
      showArea: true,
      metric: true,
    });
    polygonDrawHandlerRef.current = polygonHandler;
    polygonHandler.enable();
    setDrawMode(true);
  }, []);

  const cancelDrawing = useCallback(() => {
    polygonDrawHandlerRef.current?.disable?.();
    polygonDrawHandlerRef.current = null;

    if (
      mapInstanceRef.current &&
      (mapInstanceRef.current as any)._drawnItemsLayer
    ) {
      (mapInstanceRef.current as any)._drawnItemsLayer.clearLayers();
    }
    setNewFieldDraft(null);
    setDrawMode(false);
  }, []);

  // Expose startDrawing & flyTo imperatively so the sidebar can trigger them
  const flyTo = useCallback((lat: number, lng: number) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([lat, lng], 15, {
      animate: true,
      duration: 1.2,
    });
  }, []);

  useEffect(() => {
    if (startDrawingRef) startDrawingRef.current = startDrawing;
    if (cancelDrawingRef) cancelDrawingRef.current = cancelDrawing;
    if (flyToRef) flyToRef.current = flyTo;
    return () => {
      if (startDrawingRef) startDrawingRef.current = null;
      if (cancelDrawingRef) cancelDrawingRef.current = null;
      if (flyToRef) flyToRef.current = null;
    };
  }, [
    startDrawingRef,
    startDrawing,
    cancelDrawingRef,
    cancelDrawing,
    flyToRef,
    flyTo,
  ]);

  const isAddingField = drawMode || !!newFieldDraft;

  useEffect(() => {
    onAddFieldStateChange?.(isAddingField, !!newFieldDraft);
  }, [isAddingField, newFieldDraft, onAddFieldStateChange]);

  // Handle new field confirmed from modal
  const handleFieldConfirm = useCallback(
    (name: string, variety: string, sowingDate: string) => {
      if (!newFieldDraft || !mapInstanceRef.current) return;
      const map = mapInstanceRef.current;

      // Remove the drawn preview layer
      if ((map as any)._drawnItemsLayer) {
        (map as any)._drawnItemsLayer.clearLayers();
      }

      // Calculate centroid
      const lats = newFieldDraft.latlngs.map((ll) => ll[0]);
      const lngs = newFieldDraft.latlngs.map((ll) => ll[1]);
      const centroid: [number, number] = [
        lats.reduce((a, b) => a + b, 0) / lats.length,
        lngs.reduce((a, b) => a + b, 0) / lngs.length,
      ];

      const coords = [...newFieldDraft.latlngs, newFieldDraft.latlngs[0]].map(
        ([lat, lng]) => [lng, lat],
      );

      // Log the field data to the console so the user can copy it!
      const approxAreaHa = (() => {
        if (newFieldDraft.latlngs.length < 3) return 0;
        let area = 0;
        const n = newFieldDraft.latlngs.length;
        for (let i = 0; i < n; i++) {
          const [lat1, lng1] = newFieldDraft.latlngs[i];
          const [lat2, lng2] = newFieldDraft.latlngs[(i + 1) % n];
          area += lng1 * lat2 - lng2 * lat1;
        }
        const lat = (newFieldDraft.latlngs[0][0] * Math.PI) / 180;
        const haPerDegSq = (111000 * 111000 * Math.cos(lat)) / 10000;
        return Math.abs(area / 2) * haPerDegSq;
      })();

      console.log(`\n\n🌾 NEW FIELD DATA FOR '${name}':`);
      console.log("Centroid (lat, lng):", JSON.stringify(centroid));
      console.log(
        "Coordinates (GeoJSON polygon format):",
        JSON.stringify([coords]),
      );
      console.log(`Approx Area: ${approxAreaHa.toFixed(2)} ha`);
      console.log("----------------------------\n\n");

      if (onFieldAdd) {
        onFieldAdd({
          name,
          location: "Sekinchan, Selangor",
          geometry: { type: "Polygon", coordinates: [coords] },
          centroid,
          alertLevel: "healthy",
          latestIndices: { ndvi: 0.45, evi: 0.38, lswi: 0.25 },
          areaHa: undefined,
          variety,
          transplantingDate: sowingDate,
        } as any);
      }

      setNewFieldDraft(null);
      setDrawMode(false);
    },
    [newFieldDraft, onFieldAdd],
  );

  const handleFieldCancel = useCallback(() => {
    cancelDrawing();
  }, [cancelDrawing]);

  // Register confirmFieldRef after handleFieldConfirm is defined
  useEffect(() => {
    if (confirmFieldRef) confirmFieldRef.current = handleFieldConfirm;
    return () => {
      if (confirmFieldRef) confirmFieldRef.current = null;
    };
  }, [confirmFieldRef, handleFieldConfirm]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Index Toggle + Legend */}
      <IndexToggleBar
        activeIndex={activeIndex}
        onActiveIndexChange={onActiveIndexChange}
        lang={lang}
        bottomOffset={bottomOffset}
      />

      {/* Draw field button — top-right, below zoom controls */}
      <div
        style={{
          position: "absolute",
          top: "90px",
          right: "10px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "6px",
        }}
      >
        <button
          onClick={startDrawing}
          disabled={drawMode}
          title={
            lang === "ms"
              ? "Lukis sempadan ladang baru"
              : "Draw new field boundary"
          }
          style={{
            width: 30,
            height: 30,
            background: drawMode
              ? "var(--accent-green-dim)"
              : "rgba(22, 27, 34, 0.96)",
            border: `1px solid ${drawMode ? "var(--accent-green)" : "var(--border)"}`,
            borderRadius: "4px",
            color: drawMode ? "var(--accent-green)" : "var(--text-secondary)",
            cursor: drawMode ? "not-allowed" : "pointer",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s ease",
            boxShadow: "0 1px 5px rgba(0,0,0,0.65)",
          }}
        >
          {drawMode ? (
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--accent-green)",
                animation: "pulse-dot 1s ease-in-out infinite",
              }}
            />
          ) : (
            <Pencil size={13} />
          )}
        </button>
        {drawMode && (
          <p
            style={{
              margin: 0,
              fontSize: "0.6875rem",
              fontFamily: "IBM Plex Mono, monospace",
              color: "var(--text-muted)",
              background: "rgba(13,17,23,0.9)",
              padding: "4px 8px",
              borderRadius: "6px",
              whiteSpace: "nowrap",
              border: "1px solid var(--border)",
            }}
          >
            {lang === "ms"
              ? "Klik tandai sempadan, dwi-klik selesai"
              : "Click to mark boundary, dbl-click to finish"}
          </p>
        )}
      </div>

      {/* New Field Confirmation Modal — suppressed during onboarding (sidebar step 3 handles it) */}
      {newFieldDraft && !suppressFieldModal && (
        <AddFieldModal
          draft={newFieldDraft}
          onConfirm={handleFieldConfirm}
          onCancel={handleFieldCancel}
          lang={lang}
        />
      )}
    </div>
  );
}
