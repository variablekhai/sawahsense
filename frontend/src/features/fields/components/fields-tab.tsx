"use client";

import { FieldCard } from "@/features/fields/components/field-card";
import type { Field, Lang } from "@/types";

interface FieldsTabProps {
  fields: Field[];
  selectedFieldId: string | null;
  onFieldSelect: (id: string) => void;
  lang: Lang;
  onAddField?: () => void;
  isAddingField?: boolean;
  onCancelAddField?: () => void;
}

export function FieldsTab({
  fields,
  selectedFieldId,
  onFieldSelect,
  lang,
  onAddField,
  isAddingField = false,
  onCancelAddField,
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
        {sorted.map((field) => (
          <div key={field.id} style={{ marginBottom: "6px" }}>
            <FieldCard
              field={field}
              isSelected={field.id === selectedFieldId}
              onFieldSelect={onFieldSelect}
              lang={lang}
            />
          </div>
        ))}
      </div>

      {/* Add field button */}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid var(--border-subtle)",
          flexShrink: 0,
        }}
      >
        {isAddingField && (
          <div
            style={{
              marginBottom: "8px",
              padding: "6px 8px",
              border: "1px solid var(--accent-green)40",
              background: "var(--accent-green-dim)",
              borderRadius: "6px",
              color: "var(--accent-green)",
              fontSize: "0.75rem",
              fontFamily: "IBM Plex Sans, sans-serif",
            }}
          >
            {lang === "ms"
              ? "Sedang tambah ladang: lukis sempadan di peta atau batal."
              : "Adding field: draw a boundary on the map or cancel."}
          </div>
        )}
        <button
          onClick={isAddingField ? onCancelAddField : onAddField}
          style={{
            width: "100%",
            padding: "8px",
            background: isAddingField ? "var(--accent-red-dim)" : "transparent",
            border: isAddingField
              ? "1px solid var(--accent-red)"
              : "1px dashed var(--border)",
            borderRadius: "8px",
            color: isAddingField ? "var(--accent-red)" : "var(--text-secondary)",
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
            if (isAddingField) return;
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--accent-green)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--accent-green)";
          }}
          onMouseLeave={(e) => {
            if (isAddingField) return;
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--border)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-secondary)";
          }}
        >
          <span>{isAddingField ? "×" : "+"}</span>
          <span>
            {isAddingField
              ? lang === "ms"
                ? "Batal Tambah Ladang"
                : "Cancel Adding Field"
              : lang === "ms"
                ? "Tambah Ladang Baru"
                : "Add New Field"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default FieldsTab;
