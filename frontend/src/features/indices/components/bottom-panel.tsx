"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DateCarousel } from "@/features/indices/components/date-carousel";
import { GDDStrip } from "@/features/indices/components/gdd-strip";
import { IndexChart } from "@/features/indices/components/index-chart";
import { useGDD } from "@/features/indices/hooks/use-gdd";
import type { Field, Lang } from "@/types";

interface BottomPanelProps {
  selectedField: Field | null;
  source: "live" | "demo";
  lang: Lang;
  sidebarWidth: number;
  /** Lifted from page.tsx — shared with MapContainer */
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  /** Lifted state so page.tsx can compute panel height for the indices legend offset */
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  isMobile?: boolean;
}

export function BottomPanel({
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
  const { t } = useTranslation();
  const { gdd, loading: gddLoading } = useGDD(selectedField);

  const panelHeight = expanded ? (isMobile ? 380 : 280) : isMobile ? 48 : 40;

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
          minHeight: isMobile ? 48 : 40,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          padding: "6px 16px",
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
            flexWrap: isMobile ? "wrap" : "nowrap",
            gap: "8px",
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
                  gap: "8px",
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
                {!isMobile && (
                  <span style={{ color: "#58a6ff" }}>
                    LSWI {selectedField.latestIndices.lswi.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Demo/live badge */}
              {!isMobile && (
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
                    whiteSpace: "nowrap",
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
                  {source === "live" ? t("common.live") : t("common.demo")}
                </span>
              )}
            </>
          ) : (
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                fontFamily: "IBM Plex Sans, sans-serif",
              }}
            >
              {t("bottomPanel.noField")}
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
            whiteSpace: "nowrap",
          }}
        >
          {!isMobile && (
            <span>{t("bottomPanel.indexHistory").toUpperCase()}</span>
          )}
          {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && selectedField && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            overflowY: isMobile ? "auto" : "hidden",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Main chart area */}
          <div
            style={{
              flex: isMobile ? "none" : 1,
              height: isMobile ? "280px" : "auto", // Ensure the chart gets its space before scrolling
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
            <div style={{ flexShrink: 0, padding: "8px 16px 12px" }}>
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
              minHeight: isMobile ? "100px" : "auto",
              flexShrink: 0,
              borderLeft: isMobile ? "none" : "1px solid var(--border-subtle)",
              borderTop: isMobile ? "1px solid var(--border-subtle)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: isMobile ? "16px" : 0, // Extra padding at bottom for mobile scrolling
              paddingTop: isMobile ? "8px" : 0,
            }}
          >
            <GDDStrip gdd={gdd} loading={gddLoading} lang={lang} />
          </div>
        </div>
      )}
    </div>
  );
}

export default BottomPanel;
