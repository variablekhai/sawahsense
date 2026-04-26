"use client";

import Image from "next/image";
import { Bell, ChevronRight, Menu } from "lucide-react";

interface NavbarProps {
  selectedFieldName?: string | null;
  alertCount?: number;
  lang: "ms" | "en";
  onLangToggle: () => void;
  onAlertClick?: () => void;
  onMenuClick?: () => void;
}

export function Navbar({
  selectedFieldName,
  alertCount = 0,
  lang,
  onLangToggle,
  onAlertClick,
  onMenuClick,
}: NavbarProps) {
  return (
    <nav
      style={{
        height: "var(--navbar-height)",
        background: "var(--bg-base)",
        borderBottom: "1px solid var(--border)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      {/* Left: Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            style={{
              padding: "4px",
              background: "transparent",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "4px",
            }}
          >
            <Menu size={20} />
          </button>
        )}
        <Image
          src="/logo.png"
          alt="SawahSense logo"
          width={28}
          height={28}
          style={{ borderRadius: "6px" }}
          priority
        />
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          SawahSense
        </span>
      </div>

      {/* Center: Breadcrumb */}
      {!onMenuClick && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.8125rem",
            color: "var(--text-secondary)",
            fontFamily: "IBM Plex Sans, sans-serif",
          }}
        >
          <span>{lang === "ms" ? "Semua Ladang" : "All Fields"}</span>
          {selectedFieldName && (
            <>
              <ChevronRight size={12} style={{ opacity: 0.5 }} />
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                {selectedFieldName}
              </span>
            </>
          )}
        </div>
      )}

      {/* Right: Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Language toggle */}
        <button
          onClick={onLangToggle}
          style={{
            padding: "4px 10px",
            borderRadius: "20px",
            border: "1px solid var(--border)",
            background: "var(--bg-surface)",
            color: "var(--text-secondary)",
            fontSize: "0.75rem",
            fontFamily: "IBM Plex Mono, monospace",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
            letterSpacing: "0.03em",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.color = "var(--text-primary)";
            (e.target as HTMLButtonElement).style.borderColor =
              "var(--accent-green)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.color =
              "var(--text-secondary)";
            (e.target as HTMLButtonElement).style.borderColor = "var(--border)";
          }}
        >
          {lang === "ms" ? "BM | EN" : "EN | BM"}
        </button>

        {/* Notification bell — opens alerts sidebar */}
        <button
          onClick={onAlertClick}
          title={lang === "ms" ? "Lihat amaran" : "View alerts"}
          style={{
            position: "relative",
            width: 32,
            height: 32,
            borderRadius: "6px",
            border: "1px solid var(--border)",
            background:
              alertCount > 0 ? "var(--accent-red-dim)" : "var(--bg-surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <Bell
            size={14}
            color={
              alertCount > 0 ? "var(--accent-red)" : "var(--text-secondary)"
            }
          />
          {alertCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "var(--accent-red)",
                color: "#fff",
                fontSize: "0.625rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "IBM Plex Mono, monospace",
              }}
            >
              {alertCount > 9 ? "9+" : alertCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
