"use client";

import { useEffect, useRef } from "react";
import { Wheat } from "lucide-react";

interface PakTaniAmbientCardProps {
  field: {
    id: string;
    name: string;
    activeAlert?: {
      message_ms: string;
      message_en: string;
    };
  } | null;
  insight: string | null;
  loading: boolean;
  onDismiss: () => void;
  onOpenFullPanel: () => void;
  lang: "ms" | "en";
}

export default function PakTaniAmbientCard({
  field,
  insight,
  loading,
  onDismiss,
  onOpenFullPanel,
  lang,
}: PakTaniAmbientCardProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss after 12 seconds
  useEffect(() => {
    if (!field) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onDismiss();
    }, 12000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [field?.id, onDismiss]);

  if (!field) return null;

  const alertMsg = field.activeAlert
    ? lang === "ms"
      ? field.activeAlert.message_ms
      : field.activeAlert.message_en
    : null;

  const displayText =
    insight ||
    alertMsg ||
    (lang === "ms"
      ? "Sedang membaca data ladang anda..."
      : "Reading your field data...");

  return (
    <div
      className="animate-fade-in"
      style={{
        position: "absolute",
        bottom: "4px",
        left: "12px",
        zIndex: 900,
        width: "300px",
        background: "rgba(22, 27, 34, 0.96)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        overflow: "hidden",
        backdropFilter: "blur(16px)",
        boxShadow: "0 16px 48px rgba(0, 0, 0, 0.6)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 14px 8px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Wheat size={14} color="var(--accent-green)" strokeWidth={1.5} />
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 600,
              fontSize: "0.8125rem",
              color: "var(--text-primary)",
            }}
          >
            Pak Tani
          </span>
          <span
            style={{
              width: "1px",
              height: "12px",
              background: "var(--border)",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              fontFamily: "IBM Plex Sans, sans-serif",
            }}
          >
            {field.name}
          </span>
        </div>
        <button
          onClick={onDismiss}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            padding: "0 2px",
            lineHeight: 1,
            fontFamily: "IBM Plex Mono, monospace",
          }}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px" }}>
        {loading && !insight ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: "2px solid var(--accent-green)",
                borderTopColor: "transparent",
              }}
              className="animate-spin"
            />
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                fontFamily: "IBM Plex Sans, sans-serif",
              }}
            >
              {lang === "ms"
                ? "Pak Tani sedang membaca data..."
                : "Pak Tani reading field data..."}
            </span>
          </div>
        ) : (
          <p
            style={{
              fontSize: "0.8125rem",
              lineHeight: 1.55,
              color: "var(--text-primary)",
              fontFamily: "IBM Plex Sans, sans-serif",
              margin: 0,
            }}
          >
            {displayText}
          </p>
        )}

        {insight && (
          <div
            style={{
              marginTop: "10px",
              paddingTop: "10px",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontSize: "0.6875rem",
                color: "var(--accent-teal)",
                fontFamily: "IBM Plex Mono, monospace",
              }}
            >
              ✦
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                fontFamily: "IBM Plex Sans, sans-serif",
              }}
            >
              {lang === "ms"
                ? "Semak kawasan yang menunjukkan perubahan terbesar."
                : "Check areas showing the biggest changes."}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "8px 14px 12px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={() => {
            onOpenFullPanel();
            onDismiss();
          }}
          style={{
            background: "var(--accent-green-dim)",
            border: "1px solid var(--accent-green)",
            borderRadius: "6px",
            color: "var(--accent-green)",
            fontSize: "0.75rem",
            fontFamily: "IBM Plex Sans, sans-serif",
            fontWeight: 500,
            padding: "5px 12px",
            cursor: "pointer",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {lang === "ms" ? "Tanya lebih lanjut" : "Ask more"} →
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "2px",
          background: "var(--accent-green)",
          width: "100%",
          transformOrigin: "left",
          animation: "shrink 12s linear forwards",
        }}
      />
      <style>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}
