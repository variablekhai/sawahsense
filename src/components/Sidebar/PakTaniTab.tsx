"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Send, RotateCcw, Wheat, Circle } from "lucide-react";
import { getCurrentStage } from "../../data/stageDefinitions";
import { getSuggestedQuestions } from "../../data/suggestedQuestions";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Field {
  id: string;
  name: string;
  location: string;
  transplantingDate: string;
  alertLevel: "healthy" | "warning" | "critical";
  latestIndices: { ndvi: number; evi: number; lswi: number };
  activeAlert?: {
    type: string;
    message_ms: string;
    message_en: string;
  };
}

interface PakTaniTabProps {
  fields: Field[];
  selectedField: Field | null;
  onFieldSelect: (id: string) => void;
  messages: Message[];
  loading: boolean;
  insightLoading: boolean;
  onSend: (msg: string) => void;
  onLoadInsight: () => void;
  lang: "ms" | "en";
}

export default function PakTaniTab({
  fields,
  selectedField,
  onFieldSelect,
  messages,
  loading,
  insightLoading,
  onSend,
  onLoadInsight,
  lang,
}: PakTaniTabProps) {
  const [input, setInput] = useState("");
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-load insight when field changes
  useEffect(() => {
    if (selectedField) onLoadInsight();
  }, [selectedField?.id]);

  const stageResult = selectedField
    ? getCurrentStage(selectedField.transplantingDate)
    : { stage: null, daysSince: 0 };

  const stage = stageResult.stage as {
    id: string;
    nameMy: string;
    nameEn: string;
  } | null;
  const daysSince = stageResult.daysSince as number;

  const suggestedQs = stage
    ? getSuggestedQuestions(stage.id, selectedField?.activeAlert?.type as any)
    : [];

  const handleSend = () => {
    if (!input.trim() || !selectedField) return;
    onSend(input.trim());
    setInput("");
  };

  const ALERT_COLORS = {
    critical: "var(--accent-red)",
    warning: "var(--accent-yellow)",
    healthy: "var(--accent-green)",
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
      {/* Header section */}
      <div
        style={{
          padding: "12px 14px",
          borderBottom: "1px solid var(--border-subtle)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <Wheat size={16} color="var(--accent-green)" strokeWidth={1.5} />
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: "var(--text-primary)",
            }}
          >
            Pak Tani
          </span>
          <span
            style={{
              fontSize: "0.6875rem",
              color: "var(--text-muted)",
              fontFamily: "IBM Plex Sans, sans-serif",
            }}
          >
            {lang === "ms" ? "Penasihat Pertanian" : "Field Advisor"}
          </span>
        </div>

        {/* Field selector */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowFieldSelector(!showFieldSelector)}
            style={{
              width: "100%",
              padding: "6px 10px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              color: selectedField
                ? "var(--text-primary)"
                : "var(--text-muted)",
              fontSize: "0.8125rem",
              fontFamily: "IBM Plex Sans, sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>
              {selectedField
                ? selectedField.name
                : lang === "ms"
                  ? "Pilih ladang..."
                  : "Select field..."}
            </span>
            <ChevronDown size={12} color="var(--text-muted)" />
          </button>

          {showFieldSelector && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                zIndex: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                overflow: "hidden",
              }}
            >
              {fields.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    onFieldSelect(f.id);
                    setShowFieldSelector(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "var(--text-primary)",
                    fontSize: "0.8125rem",
                    fontFamily: "IBM Plex Sans, sans-serif",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background =
                      "var(--bg-elevated)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background =
                      "none")
                  }
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: ALERT_COLORS[f.alertLevel],
                      flexShrink: 0,
                    }}
                  />
                  {f.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Field context bar */}
        {selectedField && stage && (
          <div
            style={{
              marginTop: "8px",
              padding: "6px 10px",
              background: "var(--bg-elevated)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                fontFamily: "IBM Plex Sans, sans-serif",
                color: "var(--text-secondary)",
              }}
            >
              {lang === "ms" ? stage.nameMy : stage.nameEn} ·{" "}
              {lang === "ms" ? "Hari" : "Day"} {daysSince}
            </span>
            {selectedField.activeAlert && (
              <span
                style={{
                  fontSize: "0.625rem",
                  fontFamily: "IBM Plex Mono, monospace",
                  color: ALERT_COLORS[selectedField.alertLevel],
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Circle
                  size={7}
                  color={ALERT_COLORS[selectedField.alertLevel]}
                  fill={ALERT_COLORS[selectedField.alertLevel]}
                />{" "}
                1 {lang === "ms" ? "Amaran" : "Alert"}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Conversations */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
        {!selectedField && (
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
            <Wheat size={28} color="var(--text-muted)" strokeWidth={1.5} />
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-muted)",
                fontFamily: "IBM Plex Sans, sans-serif",
                margin: 0,
              }}
            >
              {lang === "ms"
                ? "Pilih ladang untuk mendapat nasihat Pak Tani."
                : "Select a field to get Pak Tani's advice."}
            </p>
          </div>
        )}

        {selectedField && insightLoading && messages.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 0",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--accent-green)",
                animation: "pulse-dot 1.2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-secondary)",
                fontFamily: "IBM Plex Sans, sans-serif",
              }}
            >
              {lang === "ms"
                ? "Pak Tani sedang membaca data ladang anda..."
                : "Pak Tani is reading your field data..."}
            </span>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "16px" }}>
            {msg.role === "assistant" ? (
              <div
                style={{
                  borderLeft: "2px solid var(--accent-green)",
                  paddingLeft: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "6px",
                  }}
                >
                  <Wheat
                    size={13}
                    color="var(--accent-green)"
                    strokeWidth={1.5}
                  />
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      fontFamily: "IBM Plex Mono, monospace",
                      color: "var(--accent-green)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    PAK TANI
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.8125rem",
                    lineHeight: 1.65,
                    color: "var(--text-primary)",
                    fontFamily: "IBM Plex Sans, sans-serif",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                  {loading && i === messages.length - 1 && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 4,
                        height: 14,
                        background: "var(--accent-green)",
                        marginLeft: 2,
                        animation: "pulse-dot 0.8s ease-in-out infinite",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "8px 12px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px 8px 2px 8px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8125rem",
                      lineHeight: 1.55,
                      color: "var(--text-primary)",
                      fontFamily: "IBM Plex Sans, sans-serif",
                    }}
                  >
                    {msg.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />

        {/* Suggested questions */}
        {selectedField &&
          !loading &&
          messages.length > 0 &&
          suggestedQs.length > 0 && (
            <div style={{ marginTop: "8px" }}>
              <p
                style={{
                  fontSize: "0.625rem",
                  fontFamily: "IBM Plex Mono, monospace",
                  color: "var(--text-muted)",
                  letterSpacing: "0.08em",
                  margin: "0 0 6px",
                }}
              >
                {lang === "ms" ? "SOALAN BIASA" : "COMMON QUESTIONS"}
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                {suggestedQs
                  .slice(0, 3)
                  .map((q: { ms: string; en: string }, i: number) => (
                    <button
                      key={i}
                      onClick={() => {
                        onSend(lang === "ms" ? q.ms : q.en);
                      }}
                      style={{
                        padding: "6px 10px",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        cursor: "pointer",
                        textAlign: "left",
                        color: "var(--text-secondary)",
                        fontSize: "0.75rem",
                        fontFamily: "IBM Plex Sans, sans-serif",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.borderColor = "var(--accent-green)";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "var(--text-primary)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.borderColor = "var(--border)";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "var(--text-secondary)";
                      }}
                    >
                      {lang === "ms" ? q.ms : q.en}
                    </button>
                  ))}
              </div>
            </div>
          )}
      </div>

      {/* Input bar */}
      <div
        style={{
          padding: "10px 14px",
          borderTop: "1px solid var(--border-subtle)",
          flexShrink: 0,
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder={lang === "ms" ? "Tanya Pak Tani..." : "Ask Pak Tani..."}
          disabled={!selectedField || loading}
          style={{
            flex: 1,
            padding: "8px 12px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text-primary)",
            fontSize: "0.8125rem",
            fontFamily: "IBM Plex Sans, sans-serif",
            outline: "none",
            opacity: !selectedField ? 0.5 : 1,
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!selectedField || !input.trim() || loading}
          style={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background:
              input.trim() && selectedField
                ? "var(--accent-green)"
                : "var(--bg-elevated)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: input.trim() && selectedField ? "pointer" : "not-allowed",
            transition: "all 0.15s ease",
            flexShrink: 0,
          }}
        >
          <Send
            size={12}
            color={
              input.trim() && selectedField ? "#0d1117" : "var(--text-muted)"
            }
          />
        </button>
      </div>
    </div>
  );
}
