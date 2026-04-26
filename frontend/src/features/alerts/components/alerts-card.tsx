"use client";

import { AlertTriangle, MapPin, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  getCurrentStage,
  getStageTranslationKey,
} from "@/features/fields/lib/stage-definitions";
import type { Field, Lang } from "@/types";

const LEVEL_CONFIG: Record<Field["alertLevel"], { color: string; bg: string }> =
  {
    critical: {
      color: "#E24B4A",
      bg: "rgba(226, 75, 74, 0.14)",
    },
    warning: {
      color: "#BA7517",
      bg: "rgba(186, 117, 23, 0.14)",
    },
    healthy: {
      color: "#639922",
      bg: "rgba(99, 153, 34, 0.14)",
    },
  };

const INDEX_COLORS = {
  NDVI: "#3fb950",
  EVI: "#74c476",
  LSWI: "#58a6ff",
} as const;

const CYCLE_DAYS = 110;

interface AlertsCardProps {
  field: Field;
  lang: Lang;
  timestamp: string;
  onFieldSelect: (id: string) => void;
  onCreateTask: () => void;
}

export function AlertsCard({
  field,
  lang,
  timestamp,
  onFieldSelect,
  onCreateTask,
}: AlertsCardProps) {
  const { t } = useTranslation();
  const config = LEVEL_CONFIG[field.alertLevel];
  const { stage: stageRaw, daysSince } = getCurrentStage(
    field.transplantingDate,
  );
  const stage = stageRaw as { key: string };
  const stageName = t(getStageTranslationKey(stage));
  const progressPct = Math.min(100, Math.round((daysSince / CYCLE_DAYS) * 100));

  return (
    <div className="overflow-hidden rounded-[10px] border border-(--border-subtle) bg-(--bg-base)">
      <div
        className="flex items-center justify-between gap-2 border-b border-(--border-subtle) px-3 py-2.5"
        style={{ background: config.bg }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: config.color }}
          />
          <span
            className="truncate text-[13px] font-semibold"
            style={{
              fontFamily: "IBM Plex Sans, sans-serif",
              color: config.color,
            }}
          >
            {field.name}
          </span>
        </div>
        <span
          className="shrink-0 text-[10px]"
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            color: config.color,
            opacity: 0.75,
          }}
        >
          {t(`common.${field.alertLevel}`)}
        </span>
      </div>

      <div className="flex flex-col gap-2 px-3 pb-3 pt-2.5">
        <div className="flex items-start gap-1.5 rounded-md text-justify py-1.5">
          <p
            className="m-0 text-[11.5px] leading-snug"
            style={{
              fontFamily: "IBM Plex Sans, sans-serif",
              color: config.color,
            }}
          >
            {lang === "ms"
              ? field.activeAlert?.message_ms
              : field.activeAlert?.message_en}
          </p>
        </div>

        <span
          className="text-[10px] text-(--text-muted)"
          style={{ fontFamily: "IBM Plex Mono, monospace" }}
        >
          {timestamp}
        </span>

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex gap-1.5">
            <button
              onClick={() => onFieldSelect(field.id)}
              className="cursor-pointer rounded-md border border-(--border) bg-transparent px-2.5 py-1 text-[11px] text-(--text-secondary) transition-colors hover:bg-(--bg-elevated)"
              style={{
                fontFamily: "IBM Plex Sans, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <MapPin size={9} />
              {t("fields.viewOnMap")}
            </button>
            <button
              onClick={onCreateTask}
              className="cursor-pointer rounded-md px-2.5 py-1 text-[11px] transition-colors"
              style={{
                fontFamily: "IBM Plex Sans, sans-serif",
                background: config.bg,
                border: `1px solid ${config.color}40`,
                color: config.color,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Plus size={9} />
              {t("alerts.createTask")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertsCard;
