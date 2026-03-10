"use client";

import { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Pencil,
  Wheat,
  ChevronRight,
  Check,
  Search,
  Loader2,
} from "lucide-react";
import { Input } from "../ui/Input";

// ─── Types ────────────────────────────────────────────────────────────────────
interface OnboardingSidebarProps {
  lang: "ms" | "en";
  /** Called when user confirms their location so the map can fly there */
  onLocationConfirm: (lat: number, lng: number, label: string) => void;
  /** Called to trigger Leaflet draw mode on the map */
  onStartDrawing: () => void;
  isDrawingField: boolean;
  /** True if the user has completed drawing a draft polygon */
  hasDrawnDraft: boolean;
  /** Called when drawing is complete and the form is submitted */
  onFieldDetailsConfirm: (
    name: string,
    variety: string,
    sowingDate: string,
  ) => void;
  /** Called after onboarding is fully done so parent can hide it */
  onComplete: () => void;
}

type Step = 1 | 2 | 3;

interface GeoResult {
  display_name: string;
  lat: string;
  lon: string;
}

const VARIETIES = [
  "MR297",
  "MR269",
  "MR284",
  "MR263",
  "MR219",
  "MR308",
  "Lain-lain / Other",
];

// ─── Step progress dots ───────────────────────────────────────────────────────
function StepDots({ step }: { step: Step }) {
  const steps: Step[] = [1, 2, 3];
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
      }}
    >
      {steps.map((s) => (
        <div
          key={s}
          style={{
            width: s === step ? 22 : s < step ? 8 : 8,
            height: 8,
            borderRadius: 99,
            background:
              s === step
                ? "var(--accent-green)"
                : s < step
                  ? "var(--accent-green)"
                  : "var(--border)",
            opacity: s < step ? 0.5 : 1,
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

// ─── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <p
      style={{
        margin: "0 0 6px",
        fontSize: "0.625rem",
        fontFamily: "IBM Plex Mono, monospace",
        letterSpacing: "0.1em",
        color: "var(--text-muted)",
      }}
    >
      {text}
    </p>
  );
}

// ─── Primary button ───────────────────────────────────────────────────────────
function PrimaryBtn({
  onClick,
  disabled,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "10px 14px",
        background: disabled ? "var(--bg-elevated)" : "var(--accent-green)",
        border: "none",
        borderRadius: 8,
        color: disabled ? "var(--text-muted)" : "#0d1117",
        fontFamily: "IBM Plex Sans, sans-serif",
        fontWeight: 600,
        fontSize: "0.875rem",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        transition: "all 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

// ─── Step 1: Location Search ──────────────────────────────────────────────────
function Step1({
  lang,
  onConfirm,
}: {
  lang: "ms" | "en";
  onConfirm: (lat: number, lng: number, label: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<GeoResult | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = async (q: string) => {
    if (!q.trim() || q.length < 3) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + " Malaysia")}&format=json&limit=5&countrycodes=my`;
      const res = await fetch(url, { headers: { "Accept-Language": "ms,en" } });
      const data: GeoResult[] = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    }
    setSearching(false);
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (r: GeoResult) => {
    setSelected(r);
    setQuery(r.display_name.split(",")[0]);
    setResults([]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Icon + heading */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "var(--accent-green-dim)",
            border: "1px solid var(--accent-green)40",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MapPin size={17} color="var(--accent-green)" strokeWidth={1.5} />
        </div>
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--text-primary)",
            }}
          >
            {lang === "ms" ? "Di mana ladang anda?" : "Where is your farm?"}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              fontFamily: "IBM Plex Sans, sans-serif",
              marginTop: 2,
            }}
          >
            {lang === "ms"
              ? "Cari kawasan penanaman anda"
              : "Search your paddy area"}
          </p>
        </div>
      </div>

      {/* Search input */}
      <div style={{ position: "relative" }}>
        <SectionLabel
          text={lang === "ms" ? "CARIAN LOKASI" : "LOCATION SEARCH"}
        />
        <div style={{ position: "relative" }}>
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
            }}
            placeholder={
              lang === "ms"
                ? "cth: Sekinchan, Selangor…"
                : "e.g. Sekinchan, Selangor…"
            }
            style={{ paddingRight: 36, width: "100%", boxSizing: "border-box" }}
          />
          <div
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          >
            {searching ? (
              <Loader2
                size={14}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <Search size={14} />
            )}
          </div>
        </div>

        {/* Dropdown results */}
        {results.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              marginTop: 4,
              zIndex: 100,
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
          >
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => handleSelect(r)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "transparent",
                  border: "none",
                  borderBottom:
                    i < results.length - 1
                      ? "1px solid var(--border-subtle)"
                      : "none",
                  color: "var(--text-primary)",
                  fontSize: "0.8125rem",
                  fontFamily: "IBM Plex Sans, sans-serif",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "block",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "var(--bg-elevated)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                }}
              >
                <div
                  style={{
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.display_name.split(",")[0]}
                </div>
                <div
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--text-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginTop: 1,
                  }}
                >
                  {r.display_name.split(",").slice(1, 3).join(",")}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected confirmation */}
      {selected && (
        <div
          style={{
            padding: "8px 10px",
            background: "var(--accent-green-dim)",
            border: "1px solid var(--accent-green)40",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Check size={13} color="var(--accent-green)" />
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--accent-green)",
              fontFamily: "IBM Plex Sans, sans-serif",
            }}
          >
            {selected.display_name.split(",").slice(0, 2).join(",")}
          </span>
        </div>
      )}

      <PrimaryBtn
        disabled={!selected}
        onClick={() => {
          if (selected)
            onConfirm(
              parseFloat(selected.lat),
              parseFloat(selected.lon),
              selected.display_name,
            );
        }}
      >
        {lang === "ms" ? "Pergi ke Lokasi" : "Go to Location"}
        <ChevronRight size={14} />
      </PrimaryBtn>
    </div>
  );
}

function Step2({
  lang,
  isDrawingField,
  hasDrawnDraft,
  onStartDrawing,
  onReady,
}: {
  lang: "ms" | "en";
  isDrawingField: boolean;
  hasDrawnDraft: boolean;
  onStartDrawing: () => void;
  onReady: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Icon + heading */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(58, 169, 255, 0.1)",
            border: "1px solid rgba(58, 169, 255, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Pencil size={17} color="#58a6ff" strokeWidth={1.5} />
        </div>
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--text-primary)",
            }}
          >
            {lang === "ms" ? "Lukis sempadan ladang" : "Draw field boundary"}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              fontFamily: "IBM Plex Sans, sans-serif",
              marginTop: 2,
            }}
          >
            {lang === "ms"
              ? "Klik tepi-tepi ladang anda di peta"
              : "Click the edges of your field on the map"}
          </p>
        </div>
      </div>

      {/* Instructions card */}
      <div
        style={{
          background: "var(--bg-base)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 8,
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {[
          {
            num: "1",
            ms: "Klik butang di bawah untuk mula melukis",
            en: "Click the button below to start drawing",
          },
          {
            num: "2",
            ms: "Klik pada peta untuk menandakan setiap penjuru ladang",
            en: "Click on the map to mark each corner of your field",
          },
          {
            num: "3",
            ms: "Klik dua kali untuk menutup sempadan",
            en: "Double-click to close the boundary",
          },
        ].map((step) => (
          <div
            key={step.num}
            style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "0.625rem",
                fontFamily: "IBM Plex Mono, monospace",
                color: "var(--text-secondary)",
              }}
            >
              {step.num}
            </div>
            <span
              style={{
                fontSize: "0.8125rem",
                fontFamily: "IBM Plex Sans, sans-serif",
                color: "var(--text-secondary)",
                lineHeight: 1.4,
                paddingTop: 1,
              }}
            >
              {lang === "ms" ? step.ms : step.en}
            </span>
          </div>
        ))}
      </div>

      {/* Drawing state feedback */}
      {isDrawingField && (
        <div
          style={{
            padding: "8px 12px",
            background: "rgba(58, 169, 255, 0.08)",
            border: "1px solid rgba(58, 169, 255, 0.3)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#58a6ff",
              animation: "pulse-dot 1s ease-in-out infinite",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "0.8125rem",
              color: "#58a6ff",
              fontFamily: "IBM Plex Sans, sans-serif",
            }}
          >
            {lang === "ms"
              ? "Melukis… klik dua kali untuk selesai"
              : "Drawing… double-click to finish"}
          </span>
        </div>
      )}

      {/* Waiting for drawing done — show "Next" prompt */}
      {!isDrawingField && !hasDrawnDraft && (
        <button
          onClick={isDrawingField ? undefined : onStartDrawing}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "#58a6ff",
            border: "none",
            borderRadius: 8,
            color: "#0d1117",
            fontFamily: "IBM Plex Sans, sans-serif",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "all 0.15s ease",
          }}
        >
          <Pencil size={14} />
          {lang === "ms" ? "Mula Lukis" : "Start Drawing"}
        </button>
      )}

      {/* "I've drawn it" — this is called after draw:created fires */}
      <button
        onClick={onReady}
        disabled={!hasDrawnDraft}
        style={{
          width: "100%",
          padding: "9px 14px",
          background: hasDrawnDraft ? "var(--accent-green)" : "transparent",
          border: hasDrawnDraft ? "none" : "1px solid var(--border)",
          borderRadius: 8,
          color: hasDrawnDraft ? "#0d1117" : "var(--text-muted)",
          fontFamily: "IBM Plex Sans, sans-serif",
          fontWeight: hasDrawnDraft ? 600 : 400,
          fontSize: "0.8125rem",
          cursor: hasDrawnDraft ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          transition: "all 0.15s ease",
        }}
      >
        {lang === "ms" ? "Sudah dilukis →" : "Field drawn →"}
      </button>
    </div>
  );
}

// ─── Step 3: Field Details ────────────────────────────────────────────────────
function Step3({
  lang,
  onConfirm,
}: {
  lang: "ms" | "en";
  onConfirm: (name: string, variety: string, sowingDate: string) => void;
}) {
  const [name, setName] = useState("");
  const [variety, setVariety] = useState("MR297");
  const [sowingDate, setSowingDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  const selectStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 12px",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-primary)",
    fontSize: "0.875rem",
    fontFamily: "IBM Plex Sans, sans-serif",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Icon + heading */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "var(--accent-green-dim)",
            border: "1px solid var(--accent-green)40",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Wheat size={17} color="var(--accent-green)" strokeWidth={1.5} />
        </div>
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--text-primary)",
            }}
          >
            {lang === "ms" ? "Maklumat ladang" : "Field details"}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              fontFamily: "IBM Plex Sans, sans-serif",
              marginTop: 2,
            }}
          >
            {lang === "ms" ? "Tiga perkara sahaja" : "Just three things"}
          </p>
        </div>
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Name */}
        <div>
          <SectionLabel
            text={lang === "ms" ? "NAMA LADANG *" : "FIELD NAME *"}
          />
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={lang === "ms" ? "cth: Petak G" : "e.g. Plot G"}
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>

        {/* Variety */}
        <div>
          <SectionLabel
            text={lang === "ms" ? "VARIETI PADI" : "PADDY VARIETY"}
          />
          <select
            value={variety}
            onChange={(e) => setVariety(e.target.value)}
            style={selectStyle}
          >
            {VARIETIES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Sowing date */}
        <div>
          <SectionLabel
            text={lang === "ms" ? "TARIKH MENYEMAI *" : "SOWING DATE *"}
          />
          <Input
            type="date"
            value={sowingDate}
            onChange={(e) => setSowingDate(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box" }}
          />
        </div>
      </div>

      <PrimaryBtn
        disabled={!name.trim() || !sowingDate}
        onClick={() => {
          if (name.trim() && sowingDate)
            onConfirm(name.trim(), variety, sowingDate);
        }}
      >
        <Wheat size={14} />
        {lang === "ms" ? "Tambah Ladang — Mula!" : "Add Field — Let's go!"}
      </PrimaryBtn>
    </div>
  );
}

export default function OnboardingSidebar({
  lang,
  onLocationConfirm,
  onStartDrawing,
  isDrawingField,
  hasDrawnDraft,
  onFieldDetailsConfirm,
  onComplete,
}: OnboardingSidebarProps) {
  const [step, setStep] = useState<Step>(1);
  const [fieldDrawn, setFieldDrawn] = useState(false);

  // Automatically advance to step 3 once a polygon is completed
  // (isDrawingField flips false after draw:created, and the "Field drawn" button triggers onReady)
  const handleDrawReady = () => {
    setStep(3);
  };

  const handleFieldConfirm = (
    name: string,
    variety: string,
    sowingDate: string,
  ) => {
    onFieldDetailsConfirm(name, variety, sowingDate);
    onComplete();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "var(--navbar-height)",
        left: 0,
        bottom: 0,
        width: "var(--sidebar-width)",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        zIndex: 900,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 16px 12px",
          borderBottom: "1px solid var(--border-subtle)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontSize: "0.625rem",
              fontFamily: "IBM Plex Mono, monospace",
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
            }}
          >
            {lang === "ms" ? "PERSEDIAAN" : "SETUP"} —{" "}
            {lang === "ms" ? "LANGKAH" : "STEP"} {step} / 3
          </span>
        </div>
        <StepDots step={step} />
      </div>

      {/* Step content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        {step === 1 && (
          <Step1
            lang={lang}
            onConfirm={(lat, lng, label) => {
              onLocationConfirm(lat, lng, label);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <Step2
            lang={lang}
            isDrawingField={isDrawingField}
            hasDrawnDraft={hasDrawnDraft}
            onStartDrawing={onStartDrawing}
            onReady={handleDrawReady}
          />
        )}
        {step === 3 && <Step3 lang={lang} onConfirm={handleFieldConfirm} />}
      </div>

      {/* Back navigation (steps 2 & 3) */}
      {step > 1 && (
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid var(--border-subtle)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setStep((s) => (s - 1) as Step)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              fontFamily: "IBM Plex Sans, sans-serif",
              cursor: "pointer",
              padding: "4px 0",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            ← {lang === "ms" ? "Kembali" : "Back"}
          </button>
        </div>
      )}
    </div>
  );
}
