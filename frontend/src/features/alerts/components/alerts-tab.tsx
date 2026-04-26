"use client";

import { useState } from "react";
import { MapPin, Plus, Circle, Wheat } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  getCurrentStage,
  getStageTranslationKey,
} from "@/features/fields/lib/stage-definitions";

interface Field {
  id: string;
  name: string;
  location: string;
  alertLevel: "healthy" | "warning" | "critical";
  latestIndices: { ndvi: number; evi: number; lswi: number };
  transplantingDate: string;
  activeAlert?: {
    type: string;
    message_ms: string;
    message_en: string;
    percentDrop?: number;
    daysSpan?: number;
  };
}

interface AlertsTabProps {
  fields: Field[];
  onFieldSelect: (id: string) => void;
  onCreateTask: () => void;
  lang: "ms" | "en";
}

const LEVEL_CONFIG = {
  critical: {
    color: "var(--accent-red)",
    bg: "var(--accent-red-dim)",
    icon: Circle,
  },
  warning: {
    color: "var(--accent-yellow)",
    bg: "var(--accent-yellow-dim)",
    icon: Circle,
  },
  healthy: {
    color: "var(--accent-green)",
    bg: "var(--accent-green-dim)",
    icon: Circle,
  },
};

export function AlertsTab({
  fields,
  onFieldSelect,
  onCreateTask,
  lang,
}: AlertsTabProps) {
  const { t } = useTranslation();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const alertFields = fields.filter(
    (f) => f.alertLevel !== "healthy" && f.activeAlert,
  );
  const activeAlerts = alertFields.filter((f) => !dismissedIds.has(f.id));

  const getTimestamp = (fieldId: string) => {
    // Simulate different timestamps
    const offsets: Record<string, string> = {
      f3: lang === "ms" ? "Semalam · 06:14 pagi" : "Yesterday · 6:14 AM",
      f4: lang === "ms" ? "2 hari lepas · 09:30 pagi" : "2 days ago · 9:30 AM",
    };
    return offsets[fieldId] || t("alerts.yesterday");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px 8px",
          borderBottom: "1px solid var(--border-subtle)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "0.6875rem",
            fontFamily: "IBM Plex Mono, monospace",
            color: "var(--text-muted)",
            letterSpacing: "0.08em",
          }}
        >
          {activeAlerts.length > 0
            ? t("alerts.activeAlertsCount", { count: activeAlerts.length }).toUpperCase()
            : t("sidebar.noAlerts").toUpperCase()}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
        {activeAlerts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "32px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Wheat size={28} color="var(--accent-green)" strokeWidth={1.5} />
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--accent-green)",
                fontFamily: "IBM Plex Sans, sans-serif",
                margin: 0,
              }}
            >
              {t("sidebar.noAlerts")}
            </p>
          </div>
        )}

        {activeAlerts.map((field) => {
          const config = LEVEL_CONFIG[field.alertLevel];
          const { stage: stageRaw, daysSince } = getCurrentStage(
            field.transplantingDate,
          );
          const stage = stageRaw as { key: string };
          const stageName = t(getStageTranslationKey(stage));

          return (
            <div
              key={field.id}
              style={{
                marginBottom: "8px",
                borderRadius: "8px",
                border: `1px solid ${config.color}30`,
                background: "var(--bg-base)",
                overflow: "hidden",
              }}
            >
              {/* Alert header */}
              <div
                style={{
                  background: config.bg,
                  borderBottom: `1px solid ${config.color}20`,
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Circle size={8} color={config.color} fill={config.color} />
                  <span
                    style={{
                      fontFamily: "IBM Plex Sans, sans-serif",
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      color: config.color,
                    }}
                  >
                    {field.name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "0.625rem",
                    fontFamily: "IBM Plex Mono, monospace",
                    color: config.color,
                    opacity: 0.7,
                  }}
                >
                  {t(`common.${field.alertLevel}`)}
                </span>
              </div>

              {/* Alert content */}
              <div style={{ padding: "10px 12px" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.8125rem",
                    fontFamily: "IBM Plex Sans, sans-serif",
                    color: "var(--text-primary)",
                    lineHeight: 1.5,
                  }}
                >
                  {lang === "ms"
                    ? field.activeAlert!.message_ms
                    : field.activeAlert!.message_en}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "6px",
                  }}
                >
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontFamily: "IBM Plex Mono, monospace",
                        color: "var(--text-muted)",
                      }}
                    >
                      {stageName} · {t("stages.day")} {daysSince}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      color: "var(--text-muted)",
                      fontFamily: "IBM Plex Sans, sans-serif",
                    }}
                  >
                    {getTimestamp(field.id)}
                  </span>
                </div>

                {/* Index values */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "6px",
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: "0.6875rem",
                  }}
                >
                  <span style={{ color: "#3fb950" }}>
                    NDVI {field.latestIndices.ndvi.toFixed(2)}
                  </span>
                  <span style={{ color: "#74c476" }}>
                    EVI {field.latestIndices.evi.toFixed(2)}
                  </span>
                  <span style={{ color: "#58a6ff" }}>
                    LSWI {field.latestIndices.lswi.toFixed(2)}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                  <button
                    onClick={() => onFieldSelect(field.id)}
                    style={{
                      padding: "4px 10px",
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      color: "var(--text-secondary)",
                      fontSize: "0.6875rem",
                      fontFamily: "IBM Plex Sans, sans-serif",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <MapPin size={10} />
                    {t("fields.viewOnMap")}
                  </button>
                  <button
                    onClick={onCreateTask}
                    style={{
                      padding: "4px 10px",
                      background: config.bg,
                      border: `1px solid ${config.color}40`,
                      borderRadius: "6px",
                      color: config.color,
                      fontSize: "0.6875rem",
                      fontFamily: "IBM Plex Sans, sans-serif",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Plus size={10} />
                    {t("alerts.createTask")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AlertsTab;
