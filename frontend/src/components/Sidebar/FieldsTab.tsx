"use client";

import { MapPin, AlertTriangle } from "lucide-react";
import { getCurrentStage } from "../../data/stageDefinitions";

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
  };
  areaHa?: number;
  variety?: string;
}

interface FieldsTabProps {
  fields: Field[];
  selectedFieldId: string | null;
  onFieldSelect: (id: string) => void;
  lang: "ms" | "en";
  onAddField?: () => void;
}

const ALERT_COLORS = {
  critical: "var(--accent-red)",
  warning: "var(--accent-yellow)",
  healthy: "var(--accent-green)",
};

const ALERT_LABELS = {
  critical: { ms: "Kritikal", en: "Critical" },
  warning: { ms: "Amaran", en: "Warning" },
  healthy: { ms: "Sihat", en: "Healthy" },
};

export default function FieldsTab({
  fields,
  selectedFieldId,
  onFieldSelect,
  lang,
  onAddField,
}: FieldsTabProps) {
  // Sort: Critical → Warning → Healthy
  const sorted = [...fields].sort((a, b) => {
    const order = { critical: 0, warning: 1, healthy: 2 };
    return order[a.alertLevel] - order[b.alertLevel];
  });

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
          {lang === "ms"
            ? `${fields.length} LADANG SAYA`
            : `${fields.length} MY FIELDS`}
        </span>
      </div>

      {/* Field list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
        {sorted.map((field) => {
          const isSelected = field.id === selectedFieldId;
          const alertColor = ALERT_COLORS[field.alertLevel];
          const alertLabel = ALERT_LABELS[field.alertLevel][lang];
          const { stage: stageRaw, daysSince } = getCurrentStage(
            field.transplantingDate,
          );
          const stage = stageRaw as { nameMy: string; nameEn: string };
          const stageName = lang === "ms" ? stage.nameMy : stage.nameEn;

          return (
            <button
              key={field.id}
              onClick={() => onFieldSelect(field.id)}
              style={{
                width: "100%",
                marginBottom: "6px",
                padding: "12px 14px",
                background: isSelected
                  ? "var(--bg-elevated)"
                  : "var(--bg-base)",
                border: `1px solid ${isSelected ? alertColor + "60" : "var(--border-subtle)"}`,
                borderLeft: `3px solid ${alertColor}`,
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    alertColor + "60";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "var(--bg-elevated)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "var(--border-subtle)";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "var(--bg-base)";
                  (e.currentTarget as HTMLButtonElement).style.borderLeftColor =
                    alertColor;
                }
              }}
            >
              {/* Field name + alert badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontFamily: "IBM Plex Sans, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    color: "var(--text-primary)",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {field.name}
                </span>
                <span
                  style={{
                    fontSize: "0.625rem",
                    fontFamily: "IBM Plex Mono, monospace",
                    fontWeight: 600,
                    color: alertColor,
                    padding: "1px 6px",
                    borderRadius: "10px",
                    background: alertColor + "15",
                    border: `1px solid ${alertColor}30`,
                    flexShrink: 0,
                  }}
                >
                  {alertLabel}
                </span>
              </div>

              {/* Stage + location */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontFamily: "IBM Plex Sans, sans-serif",
                    color: "var(--text-secondary)",
                  }}
                >
                  {stageName} · {lang === "ms" ? "Hari" : "Day"} {daysSince}
                </span>
              </div>

              {/* Indices */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
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

              {/* Alert message */}
              {field.activeAlert && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "4px",
                    paddingTop: "4px",
                    borderTop: "1px solid var(--border-subtle)",
                  }}
                >
                  <AlertTriangle
                    size={11}
                    color={alertColor}
                    style={{ flexShrink: 0, marginTop: "1px" }}
                  />
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      color: alertColor,
                      fontFamily: "IBM Plex Sans, sans-serif",
                      lineHeight: 1.4,
                    }}
                  >
                    {lang === "ms"
                      ? field.activeAlert.message_ms
                      : field.activeAlert.message_en}
                  </span>
                </div>
              )}

              {/* Location */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <MapPin size={10} color="var(--text-muted)" />
                <span
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--text-muted)",
                    fontFamily: "IBM Plex Sans, sans-serif",
                  }}
                >
                  {field.location}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Add field button */}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid var(--border-subtle)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onAddField}
          style={{
            width: "100%",
            padding: "8px",
            background: "transparent",
            border: "1px dashed var(--border)",
            borderRadius: "8px",
            color: "var(--text-secondary)",
            fontSize: "0.8125rem",
            fontFamily: "IBM Plex Sans, sans-serif",
            cursor: "pointer",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--accent-green)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--accent-green)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--border)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-secondary)";
          }}
        >
          <span>+</span>
          <span>{lang === "ms" ? "Tambah Ladang Baru" : "Add New Field"}</span>
        </button>
      </div>
    </div>
  );
}
