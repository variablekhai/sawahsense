"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "../src/components/Navbar";
import Sidebar from "../src/components/Sidebar/Sidebar";
import PakTaniAmbientCard from "../src/components/Map/PakTaniAmbientCard";
import BottomPanel from "../src/components/BottomPanel/BottomPanel";
import { getFieldsSortedByAlert } from "../src/data/demoFields";
import { usePakTani } from "../src/hooks/usePakTani";
import { Task } from "../src/components/Sidebar/TasksTab";
import type { Field } from "../src/types";
import { useIsMobile } from "../src/hooks/useMobile";

// Dynamic import for map (SSR incompatible)
const MapContainer = dynamic(
  () => import("../src/components/Map/MapContainer"),
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
            MEMUATKAN PETA...
          </p>
        </div>
      </div>
    ),
  },
);

type TabId = "fields" | "tasks" | "alerts" | "pakTani";

export default function Home() {
  const [lang, setLang] = useState<"ms" | "en">("ms");
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("fields");
  const [activeIndex, setActiveIndex] = useState<"NDVI" | "EVI" | "LSWI">(
    "NDVI",
  );
  const [ambientField, setAmbientField] = useState<any>(null);
  const [dataSource] = useState<"live" | "demo">("demo");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bottomPanelExpanded, setBottomPanelExpanded] = useState(false);
  const panelHeight = bottomPanelExpanded ? 280 : 40;

  // Imperative ref so sidebar "Add Field" button can trigger map draw mode
  const startDrawingRef = useRef<(() => void) | null>(null);
  const cancelDrawingRef = useRef<(() => void) | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);

  const isMobile = useIsMobile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Extra fields from user-drawn polygons
  const [userFields, setUserFields] = useState<Field[]>([]);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = useCallback((task: Task) => {
    setTasks((prev) => [task, ...prev]);
  }, []);

  const baseFields = getFieldsSortedByAlert() as Field[];
  const fields: Field[] = [...baseFields, ...userFields];
  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  const {
    messages: pakTaniMessages,
    loading: pakTaniLoading,
    insightLoading: pakTaniInsightLoading,
    loadFieldInsight,
    sendMessage: pakTaniSend,
    clearConversation,
  } = usePakTani(handleAddTask);

  const alertCount = fields.filter((f) => f.alertLevel !== "healthy").length;

  const handleFieldSelect = useCallback(
    (fieldId: string | null) => {
      setSelectedFieldId(fieldId);
      const field = fields.find((f) => f.id === fieldId);
      if (field?.activeAlert) {
        setAmbientField(field);
      }
      // Auto-select the latest clear acquisition for this field
      if (field?.acquisitionDates) {
        const clear = [...field.acquisitionDates]
          .reverse()
          .find((d) => d.cloudPct <= 40);
        setSelectedDate(clear?.date ?? null);
      } else {
        setSelectedDate(null);
      }
    },
    [fields],
  );

  const handleAmbientCardTrigger = useCallback((field: any) => {
    setAmbientField(field);
  }, []);

  const handleLoadInsight = useCallback(() => {
    if (selectedField) {
      loadFieldInsight(selectedField);
    }
  }, [selectedField, loadFieldInsight]);

  const handleTabChange = useCallback(
    (tab: TabId) => {
      setActiveTab(tab);
      if (tab === "pakTani" && selectedField) {
        loadFieldInsight(selectedField);
      }
    },
    [selectedField, loadFieldInsight],
  );

  const handlePakTaniSend = useCallback(
    (msg: string) => {
      if (selectedField) {
        pakTaniSend(msg, selectedField, pakTaniMessages, lang);
      }
    },
    [selectedField, pakTaniMessages, pakTaniSend, lang],
  );

  const handleOpenFullPanel = useCallback(() => {
    setActiveTab("pakTani");
    if (selectedField) loadFieldInsight(selectedField);
  }, [selectedField, loadFieldInsight]);

  useEffect(() => {
    clearConversation();
  }, [selectedFieldId, clearConversation]);

  // Handle user adding a new field from drawn polygon
  const handleFieldAdd = useCallback((draft: Partial<Field>) => {
    const id = `user_${Date.now()}`;
    const newField: Field = {
      id,
      name: draft.name || "Ladang Baru",
      location: draft.location || "Sekinchan, Selangor",
      geometry: draft.geometry || { type: "Polygon", coordinates: [[]] },
      centroid: (draft.centroid as [number, number]) || [3.481, 101.027],
      transplantingDate: new Date().toISOString().split("T")[0],
      alertLevel: "healthy",
      latestIndices: { ndvi: 0.45, evi: 0.38, lswi: 0.25 },
      areaHa: (draft as any).areaHa,
      variety: (draft as any).variety || "MR263",
      timeSeries: [],
    };
    setUserFields((prev) => [...prev, newField]);
    setSelectedFieldId(id);
    setActiveTab("fields");
  }, []);

  const sidebarWidth = 320;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg-base)",
      }}
    >
      {/* Navbar */}
      <Navbar
        selectedFieldName={selectedField?.name || null}
        alertCount={alertCount}
        lang={lang}
        onLangToggle={() => setLang((l) => (l === "ms" ? "en" : "ms"))}
        onAlertClick={() => handleTabChange("alerts")}
        onMenuClick={
          isMobile ? () => setMobileSidebarOpen(!mobileSidebarOpen) : undefined
        }
      />

      {/* Sidebar Overlay for Mobile */}
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

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: "var(--navbar-height)",
          bottom: 0,
          left: isMobile ? (mobileSidebarOpen ? 0 : "-100%") : 0,
          width: isMobile ? "80%" : "var(--sidebar-width)",
          maxWidth: "400px",
          zIndex: 900,
          transition: "left 0.3s ease-in-out",
          background: "var(--bg-base)",
        }}
      >
        <Sidebar
          fields={fields}
          selectedFieldId={selectedFieldId}
          onFieldSelect={(id) => {
            handleFieldSelect(id);
            if (isMobile) setMobileSidebarOpen(false);
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
        />
      </div>

      {/* Main map area */}
      <div
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
          onAmbientCardTrigger={handleAmbientCardTrigger}
          selectedDate={selectedDate}
          bottomOffset={panelHeight}
          startDrawingRef={startDrawingRef}
          cancelDrawingRef={cancelDrawingRef}
          onAddFieldStateChange={setIsAddingField}
          initialCenter={fields[0]?.centroid ?? [3.481, 101.0268]}
        />

        {/* Pak Tani Ambient Card */}
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
                ).find((m) => m.role === "assistant")?.content || null
              }
              loading={pakTaniInsightLoading}
              onDismiss={() => setAmbientField(null)}
              onOpenFullPanel={handleOpenFullPanel}
              lang={lang}
            />
          </div>
        )}
      </div>

      {/* Bottom Panel */}
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
