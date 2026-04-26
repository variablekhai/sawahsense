"use client";

import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Cloud } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DatePoint {
  date: string;
  cloudPct: number;
}

interface DateCarouselProps {
  timeSeries: DatePoint[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  lang: "ms" | "en";
}

export function DateCarousel({
  timeSeries,
  selectedDate,
  onDateSelect,
  lang,
}: DateCarouselProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -120 : 120,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [timeSeries]);

  if (!timeSeries || timeSeries.length === 0) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <button
        onClick={() => scroll("left")}
        style={{
          flexShrink: 0,
          width: 20,
          height: 20,
          borderRadius: "4px",
          border: "1px solid var(--border)",
          background: "var(--bg-elevated)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--text-muted)",
        }}
      >
        <ChevronLeft size={10} />
      </button>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowX: "auto",
          display: "flex",
          gap: "5px",
          scrollbarWidth: "none",
          alignItems: "center",
          padding: "2px 0",
        }}
      >
        {timeSeries.map((point) => {
          const isCloudy = point.cloudPct > 40;
          const isSelected = point.date === selectedDate;
          const dateLabel = new Date(point.date).toLocaleDateString("en-GB", {
            month: "short",
            day: "numeric",
          });

          return (
            <button
              key={point.date}
              onClick={() => !isCloudy && onDateSelect(point.date)}
              disabled={isCloudy}
              style={{
                flexShrink: 0,
                padding: "3px 8px",
                borderRadius: "12px",
                border: `1px solid ${isSelected ? "var(--accent-blue)" : isCloudy ? "var(--border-subtle)" : "var(--border)"}`,
                background: isSelected
                  ? "var(--accent-blue-dim)"
                  : isCloudy
                    ? "transparent"
                    : "var(--bg-elevated)",
                color: isSelected
                  ? "var(--accent-blue)"
                  : isCloudy
                    ? "var(--text-muted)"
                    : "var(--text-secondary)",
                fontSize: "0.6875rem",
                fontFamily: "IBM Plex Mono, monospace",
                cursor: isCloudy ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "3px",
                opacity: isCloudy ? 0.45 : 1,
                transition: "all 0.15s ease",
              }}
              title={
                isCloudy
                  ? `${t("bottomPanel.cloudy")}: ${point.cloudPct}%`
                  : `${t("bottomPanel.clear")}: ${point.cloudPct}% ${t("bottomPanel.cloudCover").toLowerCase()}`
              }
            >
              {isCloudy && <Cloud size={8} />}
              {dateLabel}
              {isSelected && (
                <span
                  style={{
                    fontFamily: "IBM Plex Sans, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  *
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scroll("right")}
        style={{
          flexShrink: 0,
          width: 20,
          height: 20,
          borderRadius: "4px",
          border: "1px solid var(--border)",
          background: "var(--bg-elevated)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--text-muted)",
        }}
      >
        <ChevronRight size={10} />
      </button>
    </div>
  );
}

export default DateCarousel;
