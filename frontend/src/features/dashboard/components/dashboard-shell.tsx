"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

import { BottomPanel } from "@/features/indices/components/bottom-panel";
import { getFieldsSortedByAlert } from "@/features/fields/data/demo-fields";
import { Navbar } from "@/features/dashboard/components/navbar";
import { Sidebar } from "@/features/dashboard/components/sidebar";
import { PakTaniAmbientCard } from "@/features/map/components/pak-tani-ambient-card";
import { usePakTani } from "@/features/pak-tani/hooks/use-pak-tani";
import type { Task } from "@/features/tasks/types/task";
import { useAppLanguage } from "@/hooks/use-app-language";
import { useIsMobile } from "@/hooks/use-mobile";
import { i18n } from "@/lib/i18n";
import type { Field, TabId } from "@/types";
import { useTranslation } from "react-i18next";

const MapContainer = dynamic(
  () =>
    import("@/features/map/components/map-container").then(
      (module) => module.MapContainer,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0d1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "2px solid var(--accent-green)",
              borderTopColor: "transparent",
              margin: "0 auto 12px",
              animation: "spin 1s linear infinite",
            }}
          />
          <p
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "0.6875rem",
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
            }}
          >
            {i18n.t("common.loading").toUpperCase()}
          </p>
        </div>
      </div>
    ),
  },
);

export function DashboardShell() {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("fields");
  const [activeIndex, setActiveIndex] = useState<"NDVI" | "EVI" | "LSWI">(
    "NDVI",
  );
  const [ambientField, setAmbientField] = useState<Field | null>(null);
  const [dataSource] = useState<"live" | "demo">("demo");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bottomPanelExpanded, setBottomPanelExpanded] = useState(false);
  const [isAddingField, setIsAddingField] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userFields, setUserFields] = useState<Field[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const isMobile = useIsMobile();
  const { language: lang, toggleLanguage } = useAppLanguage();
  const { t } = useTranslation();

  const panelHeight = bottomPanelExpanded
    ? isMobile
      ? 380
      : 280
    : isMobile
      ? 48
      : 40;

  const startDrawingRef = useRef<(() => void) | null>(null);
  const cancelDrawingRef = useRef<(() => void) | null>(null);

  const handleAddTask = useCallback((task: Task) => {
    setTasks((prev) => [task, ...prev]);
  }, []);

  const baseFields = getFieldsSortedByAlert() as Field[];
  const fields: Field[] = [...baseFields, ...userFields];
  const selectedField = fields.find((field) => field.id === selectedFieldId) ?? null;

  const {
    messages: pakTaniMessages,
    loading: pakTaniLoading,
    insightLoading: pakTaniInsightLoading,
    loadFieldInsight,
    sendMessage: pakTaniSend,
    clearConversation,
  } = usePakTani(handleAddTask);

  const alertCount = fields.filter((field) => field.alertLevel !== "healthy").length;

  const handleFieldSelect = useCallback(
    (fieldId: string | null) => {
      setSelectedFieldId(fieldId);
      const field = fields.find((item) => item.id === fieldId);

      if (field?.activeAlert) {
        setAmbientField(field);
      }

      if (field?.acquisitionDates) {
        const clearDate = [...field.acquisitionDates]
          .reverse()
          .find((date) => date.cloudPct <= 40);
        setSelectedDate(clearDate?.date ?? null);
      } else {
        setSelectedDate(null);
      }
    },
    [fields],
  );

  const handleLoadInsight = useCallback(() => {
    if (selectedField) {
      loadFieldInsight(selectedField, lang);
    }
  }, [lang, loadFieldInsight, selectedField]);

  const handleTabChange = useCallback(
    (tab: TabId) => {
      setActiveTab(tab);
      if (tab === "pakTani" && selectedField) {
        loadFieldInsight(selectedField, lang);
      }
    },
    [lang, loadFieldInsight, selectedField],
  );

  const handlePakTaniSend = useCallback(
    (message: string) => {
      if (selectedField) {
        pakTaniSend(message, selectedField, pakTaniMessages, lang);
      }
    },
    [lang, pakTaniMessages, pakTaniSend, selectedField],
  );

  const handleOpenFullPanel = useCallback(() => {
    setActiveTab("pakTani");
    if (selectedField) {
      loadFieldInsight(selectedField, lang);
    }
  }, [lang, loadFieldInsight, selectedField]);

  const handleFieldAdd = useCallback((draft: Partial<Field>) => {
    const id = `user_${Date.now()}`;
    const newField: Field = {
      id,
      name: draft.name || "Ladang Baru",
      location: draft.location || "Sekinchan, Selangor",
      geometry: draft.geometry || { type: "Polygon", coordinates: [[]] },
      centroid: draft.centroid || [3.481, 101.027],
      transplantingDate: new Date().toISOString().split("T")[0],
      alertLevel: "healthy",
      latestIndices: { ndvi: 0.45, evi: 0.38, lswi: 0.25 },
      areaHa: draft.areaHa,
      variety: draft.variety || "MR263",
      timeSeries: [],
    };

    setUserFields((prev) => [...prev, newField]);
    setSelectedFieldId(id);
    setActiveTab("fields");
  }, []);

  useEffect(() => {
    clearConversation();
  }, [clearConversation, selectedFieldId]);

  const sidebarWidth = isMobile || sidebarCollapsed ? 0 : 320;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg-base)",
      }}
    >
      <Navbar
        selectedFieldName={selectedField?.name || null}
        alertCount={alertCount}
        lang={lang}
        onLangToggle={toggleLanguage}
        onAlertClick={() => handleTabChange("alerts")}
        onMenuClick={
          isMobile ? () => setMobileSidebarOpen((open) => !open) : undefined
        }
      />

      {isMobile && mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 850,
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      <Sidebar
        fields={fields}
        selectedFieldId={selectedFieldId}
        onFieldSelect={(id) => {
          handleFieldSelect(id);
          if (isMobile) {
            setMobileSidebarOpen(false);
          }
        }}
        lang={lang}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        pakTaniMessages={pakTaniMessages}
        pakTaniLoading={pakTaniLoading}
        pakTaniInsightLoading={pakTaniInsightLoading}
        onPakTaniSend={handlePakTaniSend}
        onLoadInsight={handleLoadInsight}
        onAddField={() => startDrawingRef.current?.()}
        isAddingField={isAddingField}
        onCancelAddField={() => cancelDrawingRef.current?.()}
        tasks={tasks}
        setTasks={setTasks}
        isMobile={isMobile}
        collapsed={isMobile ? !mobileSidebarOpen : sidebarCollapsed}
        onToggleCollapse={() => {
          if (isMobile) {
            setMobileSidebarOpen((open) => !open);
          } else {
            setSidebarCollapsed((collapsed) => !collapsed);
          }
        }}
      />

      <div
        className="panel-transition"
        style={{
          position: "fixed",
          top: "var(--navbar-height)",
          left: isMobile ? 0 : `${sidebarWidth}px`,
          right: 0,
          bottom: 0,
        }}
      >
        <MapContainer
          fields={fields}
          selectedFieldId={selectedFieldId}
          onFieldSelect={handleFieldSelect}
          onFieldAdd={handleFieldAdd}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          lang={lang}
          onAmbientCardTrigger={setAmbientField}
          selectedDate={selectedDate}
          bottomOffset={panelHeight}
          startDrawingRef={startDrawingRef}
          cancelDrawingRef={cancelDrawingRef}
          onAddFieldStateChange={setIsAddingField}
          initialCenter={fields[0]?.centroid ?? [3.481, 101.0268]}
        />

        {ambientField && (
          <div
            style={{
              position: "absolute",
              bottom: `${panelHeight + 16}px`,
              left: "16px",
              zIndex: 900,
              transition: "bottom 0.3s ease",
            }}
          >
            <PakTaniAmbientCard
              field={ambientField}
              insight={
                (
                  pakTaniMessages as Array<{ role: string; content: string }>
                ).find((message) => message.role === "assistant")?.content || null
              }
              loading={pakTaniInsightLoading}
              onDismiss={() => setAmbientField(null)}
              onOpenFullPanel={handleOpenFullPanel}
              lang={lang}
            />
          </div>
        )}
      </div>

      <BottomPanel
        selectedField={selectedField}
        source={dataSource}
        lang={lang}
        sidebarWidth={sidebarWidth}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        expanded={bottomPanelExpanded}
        onExpandedChange={setBottomPanelExpanded}
        isMobile={isMobile}
      />
    </div>
  );
}
