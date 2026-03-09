"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import IndexChart from "./IndexChart";
import DateCarousel from "./DateCarousel";
import GDDStrip from "./GDDStrip";
import { useGDD } from "../../hooks/useGDD";

interface Field {
  id: string;
  name: string;
  centroid: [number, number];
  transplantingDate: string;
  latestIndices: { ndvi: number; evi: number; lswi: number };
  timeSeries: Array<{
    date: string;
    ndvi: number;
    evi: number;
    lswi: number;
    cloudPct: number;
  }>;
  acquisitionDates?: Array<{ date: string; cloudPct: number }>;
}

interface BottomPanelProps {
  selectedField: Field | null;
  source: "live" | "demo";
  lang: "ms" | "en";
  sidebarWidth: number;
  /** Lifted from page.tsx — shared with MapContainer */
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  /** Lifted state so page.tsx can compute panel height for the indices legend offset */
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  isMobile?: boolean;
}

export default function BottomPanel({
  selectedField,
  source,
  lang,
  sidebarWidth,
  selectedDate,
  onDateSelect,
  expanded,
  onExpandedChange,
  isMobile = false,
}: BottomPanelProps) {
  const { gdd, loading: gddLoading } = useGDD(selectedField);

  const panelHeight = expanded ? 280 : 40;

  // Use acquisitionDates for datechips if available (richer cloud data),
  // else fall back to timeSeries so legacy/user-drawn fields still work
  const carouselDates =
    selectedField?.acquisitionDates ?? selectedField?.timeSeries ?? [];

  return (
    <div
      className="panel-transition"
      style={{
        position: "fixed",
        bottom: 0,
        left: isMobile ? 0 : sidebarWidth,
        right: 0,
        height: panelHeight,
        background: "rgba(22, 27, 34, 0.97)",
        borderTop: "1px solid var(--border)",
        zIndex: 800,
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Collapsed bar / Expand header */}
      <div
        style={{
          height: 40,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: "16px",
          cursor: "pointer",
          borderBottom: expanded ? "1px solid var(--border-subtle)" : "none",
        }}
        onClick={() => onExpandedChange(!expanded)}
      >
        {/* Field name or prompt */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {selectedField ? (
            <>
              <span
                style={{
                  fontFamily: "IBM Plex Sans, sans-serif",
                  fontWeight: 500,
                  fontSize: "0.8125rem",
                  color: "var(--text-primary)",
                }}
              >
                {selectedField.name}
              </span>
              <span
                style={{ width: 1, height: 12, background: "var(--border)" }}
              />
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "0.6875rem",
                }}
              >
                <span style={{ color: "#3fb950" }}>
                  NDVI {selectedField.latestIndices.ndvi.toFixed(2)}
                </span>
                <span style={{ color: "#74c476" }}>
                  EVI {selectedField.latestIndices.evi.toFixed(2)}
                </span>
                <span style={{ color: "#58a6ff" }}>
                  LSWI {selectedField.latestIndices.lswi.toFixed(2)}
                </span>
              </div>

              {/* Demo/live badge */}
              <span
                style={{
                  marginLeft: 4,
                  fontSize: "0.5625rem",
                  fontFamily: "IBM Plex Mono, monospace",
                  color:
                    source === "live"
                      ? "var(--accent-green)"
                      : "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background:
                      source === "live"
                        ? "var(--accent-green)"
                        : "var(--text-muted)",
                    display: "inline-block",
                  }}
                />
                {source === "live" ? "Live" : "Demo"}
              </span>
            </>
          ) : (
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                fontFamily: "IBM Plex Sans, sans-serif",
              }}
            >
              {lang === "ms"
                ? "Pilih ladang untuk melihat sejarah indeks"
                : "Select a field to view index history"}
            </span>
          )}
        </div>

        {/* Expand/collapse toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--text-muted)",
            fontSize: "0.6875rem",
            fontFamily: "IBM Plex Mono, monospace",
          }}
        >
          <span>{lang === "ms" ? "SEJARAH INDEKS" : "INDEX HISTORY"}</span>
          {expanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && selectedField && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            overflow: isMobile ? "auto" : "hidden",
          }}
        >
          {/* Main chart area */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Index chart */}
            <div style={{ flex: 1, padding: "8px 16px 0", overflow: "hidden" }}>
              <IndexChart
                timeSeries={selectedField.timeSeries}
                transplantingDate={selectedField.transplantingDate}
                selectedDate={selectedDate}
                lang={lang}
              />
            </div>

            {/* Date carousel — uses acquisitionDates when available */}
            <div style={{ flexShrink: 0, padding: "0 16px 8px" }}>
              <DateCarousel
                timeSeries={carouselDates}
                selectedDate={selectedDate}
                onDateSelect={onDateSelect}
                lang={lang}
              />
            </div>
          </div>

          {/* GDD Strip */}
          <div
            style={{
              width: isMobile ? "100%" : "130px",
              height: isMobile ? "80px" : "auto",
              flexShrink: 0,
              borderLeft: isMobile ? "none" : "1px solid var(--border-subtle)",
              borderTop: isMobile ? "1px solid var(--border-subtle)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GDDStrip gdd={gdd} loading={gddLoading} lang={lang} />
          </div>
        </div>
      )}
    </div>
  );
}
