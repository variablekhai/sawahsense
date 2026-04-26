"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Wheat,
  ListChecks,
  Bell,
  Bot,
} from "lucide-react";
import { AlertsTab } from "@/features/alerts/components/alerts-tab";
import { FieldsTab } from "@/features/fields/components/fields-tab";
import { PakTaniTab } from "@/features/pak-tani/components/pak-tani-tab";
import { TasksTab } from "@/features/tasks/components/tasks-tab";
import type { Task } from "@/features/tasks/types/task";
import type { Field, Lang, Message, TabId } from "@/types";

interface SidebarProps {
  fields: Field[];
  selectedFieldId: Field["id"] | null;
  onFieldSelect: (id: Field["id"]) => void;
  lang: Lang;
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
  pakTaniMessages?: Message[];
  pakTaniLoading?: boolean;
  pakTaniInsightLoading?: boolean;
  onPakTaniSend?: (msg: string) => void;
  onLoadInsight?: () => void;
  onAddField?: () => void;
  isAddingField?: boolean;
  onCancelAddField?: () => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  isMobile?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const TABS: {
  id: TabId;
  icon: typeof Wheat;
  labelMs: string;
  labelEn: string;
}[] = [
  { id: "fields", icon: Wheat, labelMs: "Ladang", labelEn: "Fields" },
  { id: "tasks", icon: ListChecks, labelMs: "Tugas", labelEn: "Tasks" },
  { id: "alerts", icon: Bell, labelMs: "Amaran", labelEn: "Alerts" },
  { id: "pakTani", icon: Bot, labelMs: "Pak Tani", labelEn: "Pak Tani" },
];

const SIDEBAR_WIDTH = "var(--sidebar-width)";

export function Sidebar({
  fields,
  selectedFieldId,
  onFieldSelect,
  lang,
  activeTab = "fields",
  onTabChange,
  pakTaniMessages = [],
  pakTaniLoading = false,
  pakTaniInsightLoading = false,
  onPakTaniSend,
  onLoadInsight,
  onAddField,
  isAddingField = false,
  onCancelAddField,
  tasks,
  setTasks,
  isMobile = false,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;
  const alertCount = fields.filter((f) => f.alertLevel !== "healthy").length;

  return (
    <>
      {/* ── Sidebar panel ─────────────────────────────────────── */}
      <div
        className="panel-transition"
        style={{
          position: "fixed",
          top: "var(--navbar-height)",
          left: isMobile && collapsed ? "-100%" : 0,
          bottom: 0,
          width: isMobile ? "80%" : collapsed ? "0px" : SIDEBAR_WIDTH,
          maxWidth: isMobile ? "400px" : "none",
          background: "var(--bg-surface)",
          borderRight:
            !isMobile && collapsed ? "none" : "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          zIndex: 900,
          overflow: "hidden",
        }}
      >
        {/* Tab navigation */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            const label = lang === "ms" ? tab.labelMs : tab.labelEn;
            const hasAlert = tab.id === "alerts" && alertCount > 0;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                title={label}
                style={{
                  flex: 1,
                  padding: "10px 4px",
                  background: isActive ? "var(--bg-elevated)" : "transparent",
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid var(--accent-green)"
                    : "2px solid transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  transition: "all 0.15s ease",
                  position: "relative",
                }}
              >
                <div style={{ position: "relative" }}>
                  <Icon
                    size={14}
                    color={
                      isActive ? "var(--accent-green)" : "var(--text-secondary)"
                    }
                  />
                  {hasAlert && (
                    <span
                      style={{
                        position: "absolute",
                        top: -3,
                        right: -3,
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "var(--accent-red)",
                        border: "1px solid var(--bg-surface)",
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    fontSize: "0.625rem",
                    fontFamily: "IBM Plex Sans, sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    color: isActive
                      ? "var(--accent-green)"
                      : "var(--text-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {activeTab === "fields" && (
            <FieldsTab
              fields={fields}
              selectedFieldId={selectedFieldId}
              onFieldSelect={onFieldSelect}
              lang={lang}
              onAddField={onAddField}
              isAddingField={isAddingField}
              onCancelAddField={onCancelAddField}
            />
          )}
          {activeTab === "tasks" && (
            <TasksTab
              selectedField={selectedField}
              lang={lang}
              tasks={tasks}
              setTasks={setTasks}
            />
          )}
          {activeTab === "alerts" && (
            <AlertsTab
              fields={fields}
              onFieldSelect={onFieldSelect}
              onCreateTask={() => onTabChange?.("tasks")}
              lang={lang}
            />
          )}
          {activeTab === "pakTani" && (
            <PakTaniTab
              fields={fields}
              selectedField={selectedField}
              onFieldSelect={onFieldSelect}
              messages={pakTaniMessages}
              loading={pakTaniLoading}
              insightLoading={pakTaniInsightLoading}
              onSend={onPakTaniSend || (() => {})}
              onLoadInsight={onLoadInsight || (() => {})}
              lang={lang}
            />
          )}
        </div>
      </div>

      {/* ── Collapse toggle — rendered OUTSIDE sidebar so overflow:hidden can't clip it ── */}
      {!isMobile && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          title={
            collapsed
              ? lang === "ms"
                ? "Buka sidebar"
                : "Open sidebar"
              : lang === "ms"
                ? "Tutup sidebar"
                : "Close sidebar"
          }
          style={{
            position: "fixed",
            top: "50vh",
            // When open: button sits right at the sidebar edge
            left: collapsed ? "0px" : SIDEBAR_WIDTH,
            transform: "translateY(-50%)",
            width: 20,
            height: 48,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderLeft: collapsed ? "1px solid var(--border)" : "none",
            borderRadius: collapsed ? "0 6px 6px 0" : "0 6px 6px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 910,
            color: "var(--text-muted)",
            transition:
              "left 0.3s cubic-bezier(0.4,0,0.2,1), background 0.15s ease",
            padding: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--bg-elevated)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--bg-surface)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-muted)";
          }}
        >
          {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>
      )}
    </>
  );
}

export default Sidebar;
