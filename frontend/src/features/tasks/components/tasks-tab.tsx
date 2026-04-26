"use client";

import { useState } from "react";
import { CheckSquare, Square, MessageCircle, Plus, X } from "lucide-react";
import { getCurrentStage } from "@/features/fields/lib/stage-definitions";
import type { Task } from "@/features/tasks/types/task";

interface WhatsAppModalProps {
  task: Task;
  onClose: () => void;
  lang: "ms" | "en";
}

const FARMERS = [
  { name: "Ahmad (Petak A)", phone: "+60123456781" },
  { name: "Ali (Petak B)", phone: "+60123456782" },
  { name: "Abu (Petak C)", phone: "+60123456783" },
  { name: "Chong (Petak D)", phone: "+60123456784" },
  { name: "Muthu (Petak E)", phone: "+60123456785" },
  { name: "Siti (Petak F)", phone: "+60123456786" },
];

function WhatsAppModal({ task, onClose, lang }: WhatsAppModalProps) {
  const [selectedFarmerIndex, setSelectedFarmerIndex] = useState<number | "">(
    "",
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (selectedFarmerIndex === "") return;
    const farmer = FARMERS[selectedFarmerIndex];
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: farmer.name,
          phoneNumber: farmer.phone,
          fieldName: task.fieldName,
          alertMessage: task.alertMessage,
          eviValue: task.eviValue,
          ndviValue: task.ndviValue,
          stage: task.stage,
          dayNum: task.dueDate,
        }),
      });
      if (res.ok) {
        setSent(true);
        setTimeout(onClose, 2500);
      } else {
        setError(
          lang === "ms" ? "Gagal menghantar mesej" : "Failed to send message",
        );
      }
    } catch {
      setError(lang === "ms" ? "Ralat sambungan" : "Connection error");
    }
    setSending(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "24px",
          width: "320px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              {lang === "ms" ? "Hantar WhatsApp" : "Send WhatsApp"}
            </h3>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                margin: "4px 0 0",
                fontFamily: "IBM Plex Sans, sans-serif",
              }}
            >
              {task.fieldName}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label
              style={{
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                fontFamily: "IBM Plex Sans, sans-serif",
                display: "block",
                marginBottom: "4px",
              }}
            >
              {lang === "ms" ? "Pilih Petani" : "Select Farmer"}
            </label>
            <select
              value={selectedFarmerIndex}
              onChange={(e) =>
                setSelectedFarmerIndex(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                background: "var(--bg-base)",
                color: "var(--text-primary)",
                fontFamily: "IBM Plex Sans, sans-serif",
                fontSize: "0.875rem",
              }}
            >
              <option value="">
                {lang === "ms" ? "-- Pilih Petani --" : "-- Select Farmer --"}
              </option>
              {FARMERS.map((f, i) => (
                <option key={i} value={i}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p
            style={{
              color: "var(--accent-red)",
              fontSize: "0.75rem",
              marginTop: "8px",
              fontFamily: "IBM Plex Sans, sans-serif",
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleSend}
          disabled={sending || selectedFarmerIndex === ""}
          style={{
            width: "100%",
            marginTop: "16px",
            padding: "10px",
            background: sent
              ? "var(--accent-green-dim)"
              : "var(--accent-green)",
            border: "none",
            borderRadius: "8px",
            color: sent ? "var(--accent-green)" : "#0d1117",
            fontFamily: "IBM Plex Sans, sans-serif",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            textAlign: "center",
          }}
        >
          <MessageCircle size={14} />
          {sent
            ? lang === "ms"
              ? "Tugas Dihantar!"
              : "Tasks Sent!"
            : sending
              ? lang === "ms"
                ? "Menghantar..."
                : "Sending..."
              : lang === "ms"
                ? "Hantar WhatsApp"
                : "Send WhatsApp"}
        </button>
      </div>
    </div>
  );
}

interface Field {
  id: string;
  name: string;
  alertLevel: "healthy" | "warning" | "critical";
  latestIndices: { ndvi: number; evi: number; lswi: number };
  transplantingDate: string;
  activeAlert?: { message_ms: string; message_en: string };
}

interface TasksTabProps {
  selectedField: Field | null;
  lang: "ms" | "en";
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export function TasksTab({
  selectedField,
  lang,
  tasks,
  setTasks,
}: TasksTabProps) {
  const [whatsAppTask, setWhatsAppTask] = useState<Task | null>(null);

  const toggleTask = (taskId: string) => {
    setTasks((ts) =>
      ts.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === "pending" ? "completed" : "pending" }
          : t,
      ),
    );
  };

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const doneTasks = tasks.filter((t) => t.status === "completed");

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            ? `${pendingTasks.length} TUGAS BELUM SELESAI`
            : `${pendingTasks.length} PENDING TASKS`}
        </span>
        <button
          style={{
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "3px 8px",
            cursor: "pointer",
            color: "var(--text-secondary)",
            fontSize: "0.6875rem",
            fontFamily: "IBM Plex Sans, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          onClick={() => {
            if (selectedField) {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              const { stage: stageRaw2 } = getCurrentStage(
                selectedField.transplantingDate,
              );
              const stage2 = stageRaw2 as { nameMy: string; nameEn: string };
              const newTask: Task = {
                id: `t_manual_${Date.now()}`,
                title:
                  lang === "ms"
                    ? `Semak ${selectedField.name}`
                    : `Inspect ${selectedField.name}`,
                fieldId: selectedField.id,
                fieldName: selectedField.name,
                dueDate: tomorrow.toLocaleDateString("ms-MY", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                }),
                dueTime: "08:00 pagi",
                status: "pending",
                stage: lang === "ms" ? stage2.nameMy : stage2.nameEn,
                ndviValue: selectedField.latestIndices.ndvi,
                eviValue: selectedField.latestIndices.evi,
              };
              setTasks((ts) => [newTask, ...ts]);
            }
          }}
        >
          <Plus size={10} />
          {lang === "ms" ? "Baru" : "New"}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
        {tasks.length === 0 && (
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              textAlign: "center",
              padding: "24px 0",
              fontFamily: "IBM Plex Sans, sans-serif",
            }}
          >
            {lang === "ms"
              ? "Tiada tugas. Buat tugas daripada amaran."
              : "No tasks. Create tasks from alerts."}
          </p>
        )}

        {/* Pending */}
        {pendingTasks.map((task) => (
          <div
            key={task.id}
            style={{
              marginBottom: "8px",
              padding: "12px",
              background: "var(--bg-base)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
            }}
          >
            <div
              style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}
            >
              <button
                onClick={() => toggleTask(task.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "1px 0",
                  flexShrink: 0,
                }}
              >
                <Square size={14} color="var(--text-muted)" />
              </button>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.8125rem",
                    fontFamily: "IBM Plex Sans, sans-serif",
                    color: "var(--text-primary)",
                    fontWeight: 500,
                  }}
                >
                  {task.title}
                </p>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: "0.6875rem",
                    color: "var(--text-secondary)",
                    fontFamily: "IBM Plex Sans, sans-serif",
                  }}
                >
                  {task.fieldName}
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: "0.6875rem",
                    color: "var(--text-muted)",
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
                  {task.dueDate} · {task.dueTime}
                </p>
                {task.alertMessage && (
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "0.6875rem",
                      color: "var(--accent-yellow)",
                      fontFamily: "IBM Plex Sans, sans-serif",
                      lineHeight: 1.4,
                    }}
                  >
                    {task.alertMessage}
                  </p>
                )}
                <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                  <button
                    onClick={() => toggleTask(task.id)}
                    style={{
                      padding: "3px 8px",
                      background: "var(--accent-green-dim)",
                      border: "1px solid var(--accent-green)",
                      borderRadius: "4px",
                      color: "var(--accent-green)",
                      fontSize: "0.6875rem",
                      fontFamily: "IBM Plex Sans, sans-serif",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <CheckSquare size={10} />
                    {lang === "ms" ? "Selesai" : "Done"}
                  </button>
                  <button
                    onClick={() => setWhatsAppTask(task)}
                    style={{
                      padding: "3px 8px",
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      color: "var(--text-secondary)",
                      fontSize: "0.6875rem",
                      fontFamily: "IBM Plex Sans, sans-serif",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <MessageCircle size={10} />
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Completed tasks */}
        {doneTasks.length > 0 && (
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
              {lang === "ms" ? "SELESAI" : "COMPLETED"}
            </p>
            {doneTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  marginBottom: "6px",
                  padding: "10px 12px",
                  background: "transparent",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  opacity: 0.6,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <CheckSquare size={14} color="var(--accent-green)" />
                </button>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    fontFamily: "IBM Plex Sans, sans-serif",
                    color: "var(--text-secondary)",
                    textDecoration: "line-through",
                  }}
                >
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {whatsAppTask && (
        <WhatsAppModal
          task={whatsAppTask}
          onClose={() => setWhatsAppTask(null)}
          lang={lang}
        />
      )}
    </div>
  );
}

export default TasksTab;
