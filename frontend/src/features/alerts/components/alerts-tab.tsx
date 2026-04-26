"use client";

import { useState } from "react";
import { Wheat } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AlertsCard } from "@/features/alerts/components/alerts-card";
import type { Field, Lang } from "@/types";

interface AlertsTabProps {
  fields: Field[];
  onFieldSelect: (id: string) => void;
  onCreateTask: () => void;
  lang: Lang;
}

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

        {activeAlerts.map((field) => (
          <div key={field.id} style={{ marginBottom: "8px" }}>
            <AlertsCard
              field={field}
              lang={lang}
              timestamp={getTimestamp(field.id)}
              onFieldSelect={onFieldSelect}
              onCreateTask={onCreateTask}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlertsTab;
