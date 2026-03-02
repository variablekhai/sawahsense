"use client";

interface GDDData {
  accumulated: number;
  target: number;
  remaining: number;
  daysRemaining: number;
  percentComplete: number;
  predictedHarvestDate: string;
  source: "live" | "estimated";
}

interface GDDStripProps {
  gdd: GDDData | null;
  loading: boolean;
  lang: "ms" | "en";
}

export default function GDDStrip({ gdd, loading, lang }: GDDStripProps) {
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          padding: "8px",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "2px solid var(--border)",
            borderTopColor: "var(--accent-green)",
          }}
          className="animate-spin"
        />
        <span
          style={{
            fontSize: "0.5625rem",
            fontFamily: "IBM Plex Mono, monospace",
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          {lang === "ms" ? "Mengira GDD..." : "Calculating GDD..."}
        </span>
      </div>
    );
  }

  if (!gdd) {
    return (
      <div style={{ padding: "8px", textAlign: "center" }}>
        <span
          style={{
            fontSize: "0.625rem",
            fontFamily: "IBM Plex Mono, monospace",
            color: "var(--text-muted)",
          }}
        >
          {lang === "ms" ? "GDD N/A" : "GDD N/A"}
        </span>
      </div>
    );
  }

  const pct = gdd.percentComplete;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (pct / 100) * circumference;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        padding: "8px 4px",
      }}
    >
      {/* Label */}
      <span
        style={{
          fontSize: "0.5625rem",
          fontFamily: "IBM Plex Mono, monospace",
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {lang === "ms" ? "Menuai" : "Harvest"}
      </span>

      {/* Circular progress */}
      <div style={{ position: "relative", width: 72, height: 72 }}>
        <svg width={72} height={72} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx={36}
            cy={36}
            r={radius}
            fill="none"
            stroke="var(--bg-elevated)"
            strokeWidth={5}
          />
          {/* Progress */}
          <circle
            cx={36}
            cy={36}
            r={radius}
            fill="none"
            stroke="var(--accent-green)"
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
            strokeDashoffset={0}
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
        </svg>
        {/* Center text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "0.875rem",
              fontFamily: "IBM Plex Mono, monospace",
              fontWeight: 600,
              color: "var(--accent-green)",
              lineHeight: 1,
            }}
          >
            {pct}%
          </span>
        </div>
      </div>

      {/* GDD numbers */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            margin: 0,
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.6875rem",
            color: "var(--text-primary)",
            fontWeight: 600,
          }}
        >
          {gdd.accumulated.toLocaleString()}/{gdd.target.toLocaleString()}
        </p>
        <p
          style={{
            margin: "2px 0 0",
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.5625rem",
            color: "var(--text-muted)",
          }}
        >
          GDD
        </p>
      </div>

      {/* Days remaining */}
      <div
        style={{
          padding: "4px 8px",
          background: "var(--accent-green-dim)",
          border: "1px solid var(--accent-green)",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: "0.6875rem",
            color: "var(--accent-green)",
            fontWeight: 600,
          }}
        >
          ~{gdd.daysRemaining} {lang === "ms" ? "hari" : "days"}
        </p>
        <p
          style={{
            margin: "2px 0 0",
            fontFamily: "IBM Plex Sans, sans-serif",
            fontSize: "0.5625rem",
            color: "var(--text-secondary)",
          }}
        >
          {gdd.predictedHarvestDate}
        </p>
      </div>

      {/* Source indicator */}
      <span
        style={{
          fontSize: "0.5rem",
          fontFamily: "IBM Plex Mono, monospace",
          color: "var(--text-muted)",
        }}
      >
        {gdd.source === "live" ? "● Open-Meteo" : "● Est."}
      </span>
    </div>
  );
}
