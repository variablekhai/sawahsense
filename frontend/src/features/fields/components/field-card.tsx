import { useState } from "react";
import { AlertTriangle, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  getCurrentStage,
  getStageTranslationKey,
} from "@/features/fields/lib/stage-definitions";
import type { Field, Lang } from "@/types";

const ALERT_COLORS: Record<Field["alertLevel"], string> = {
  critical: "#E24B4A",
  warning: "#BA7517",
  healthy: "#639922",
};

const INDEX_COLORS = {
  NDVI: "#3fb950",
  EVI: "#74c476",
  LSWI: "#58a6ff",
} as const;

const CYCLE_DAYS = 1100;

interface FieldCardProps {
  field: Field;
  isSelected: boolean;
  onFieldSelect: (id: string) => void;
  lang: Lang;
}

export function FieldCard({
  field,
  isSelected,
  onFieldSelect,
  lang,
}: FieldCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();
  const alertColor = ALERT_COLORS[field.alertLevel];
  const alertLabel = t(`common.${field.alertLevel}`).toUpperCase();
  const isActive = isSelected || isHovered;

  const { stage, daysSince } = getCurrentStage(field.transplantingDate) as {
    stage: { nameMy: string; nameEn: string };
    daysSince: number;
  };
  const stageName = t(getStageTranslationKey(stage));
  const progressPct = Math.min(
    100,
    Math.max(0, Math.round((daysSince / CYCLE_DAYS) * 100)),
  );

  return (
    <button
      onClick={() => onFieldSelect(field.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={[
        "w-full cursor-pointer rounded-[10px] border p-3 text-left transition-all duration-150",
        "flex flex-col gap-2",
        isSelected
          ? "bg-(--bg-elevated) border-(--border-subtle)"
          : "bg-(--bg-base) border-(--border-subtle) hover:bg-(--bg-elevated) hover:border-(--border-subtle)",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span
            className="truncate text-[13px] font-semibold text-(--text-primary)"
            style={{ fontFamily: "IBM Plex Sans, sans-serif" }}
          >
            {field.name}
          </span>
          <div className="flex items-center gap-1">
            <MapPin size={9} color="var(--text-muted)" className="shrink-0" />
            <span
              className="truncate text-[11px] text-(--text-muted)"
              style={{ fontFamily: "IBM Plex Sans, sans-serif" }}
            >
              {field.location}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="mt-0.5 size-2 shrink-0 rounded-full"
            style={{ background: alertColor }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className="text-[11.5px] text-(--text-secondary)"
          style={{ fontFamily: "IBM Plex Sans, sans-serif" }}
        >
          {stageName}
        </span>
        <span
          className="rounded-md border px-1.5 py-0.5 text-[10px]"
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            borderColor: isActive
              ? "rgba(255,255,255,0.35)"
              : "var(--border-subtle)",
            background: isActive
              ? "rgba(255,255,255,0.08)"
              : "var(--bg-elevated)",
            color: isActive ? "#ffffff" : "var(--text-muted)",
          }}
        >
          {t("stages.day")} {daysSince} / {CYCLE_DAYS}
        </span>
      </div>

      <div
        className="h-[3px] overflow-hidden rounded-full"
        style={{
          background: isActive
            ? "rgba(255,255,255,0.22)"
            : "var(--border-subtle)",
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%`, background: alertColor }}
        />
      </div>

      <div
        className="flex overflow-hidden rounded-lg border"
        style={{
          fontFamily: "IBM Plex Mono, monospace",
          borderColor: isActive
            ? "rgba(255,255,255,0.3)"
            : "var(--border-subtle)",
        }}
      >
        {[
          { key: "NDVI", value: field.latestIndices.ndvi, color: INDEX_COLORS.NDVI },
          { key: "EVI", value: field.latestIndices.evi, color: INDEX_COLORS.EVI },
          { key: "LSWI", value: field.latestIndices.lswi, color: INDEX_COLORS.LSWI },
        ].map((item, index, items) => (
          <div
            key={item.key}
            className={[
              "flex flex-1 flex-col items-center gap-0.5 py-1.5",
              index < items.length - 1 ? "border-r" : "",
            ].join(" ")}
            style={{
              borderColor:
                index < items.length - 1
                  ? isActive
                    ? "rgba(255,255,255,0.3)"
                    : "var(--border-subtle)"
                  : undefined,
            }}
          >
            <span
              className="text-[9px] uppercase tracking-wide"
              style={{ color: isActive ? "#ffffff" : "var(--text-muted)" }}
            >
              {item.key}
            </span>
            <span
              className="text-[12px] font-semibold"
              style={{ color: item.color }}
            >
              {item.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {field.activeAlert && (
        <div
          className="flex items-start gap-1.5 rounded-md px-2 py-1.5"
          style={{
            background: `${alertColor}15`,
            fontFamily: "IBM Plex Sans, sans-serif",
          }}
        >
          <AlertTriangle
            size={10}
            color={alertColor}
            className="mt-px shrink-0"
          />
          <span
            className="text-[11px] leading-snug"
            style={{ color: alertColor }}
          >
            {lang === "ms"
              ? field.activeAlert.message_ms
              : field.activeAlert.message_en}
          </span>
        </div>
      )}
    </button>
  );
}

export default FieldCard;
