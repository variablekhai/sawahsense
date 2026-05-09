"use client";

import { useCallback, useRef, useState } from "react";
import { getCurrentStage } from "@/features/fields/lib/stage-definitions";

const insightCache = new Map();

function buildTaskFromField(field, lang = "ms") {
  const { stage: rawStage } = getCurrentStage(field?.transplantingDate || "");
  const stageMy = rawStage?.nameMy || "";
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueDateMs = tomorrow.toLocaleDateString("ms-MY", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  const dueDateEn = tomorrow.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  let title = `Urus ${field?.name || "Ladang"}`;
  if (field?.activeAlert?.type === "BLB_OUTBREAK") {
    title = `Scouting & Semburan BLB (${field?.name})`;
  } else if (field?.activeAlert?.type === "LSWI_LOW") {
    title = `Pemeriksaan Pintu Air (${field?.name})`;
  } else if (field?.activeAlert?.type === "EVI_LOW_NUTRIENT") {
    title = `Semak Baja NPK (${field?.name})`;
  }

  return {
    id: `t_paktani_${Date.now()}`,
    title,
    fieldId: field?.id || "field",
    fieldName: field?.name || "Ladang",
    dueDate: lang === "en" ? dueDateEn : dueDateMs,
    dueTime: lang === "en" ? "8:00 AM" : "08:00 pagi",
    status: "pending",
    alertMessage:
      lang === "en" ? field?.activeAlert?.message_en : field?.activeAlert?.message_ms,
    stage: stageMy,
    ndviValue: field?.latestIndices?.ndvi,
    eviValue: field?.latestIndices?.evi,
  };
}

function buildFieldContext(field) {
  const { stage, daysSince } = getCurrentStage(field?.transplantingDate || "");
  return {
    fieldName: field?.name || "Ladang",
    location: field?.location,
    stage: stage?.nameMy,
    daysSincePlanting: daysSince,
    ndvi: field?.latestIndices?.ndvi,
    evi: field?.latestIndices?.evi,
    lswi: field?.latestIndices?.lswi,
    alert: field?.activeAlert?.message_ms || null,
    alertType: field?.activeAlert?.type || null,
  };
}

function formatReply(reply, sources = [], lang = "ms") {
  if (!sources.length) {
    return reply;
  }
  const label = lang === "en" ? "Sources:" : "Sumber:";
  const list = sources.map((s) => `• ${s}`).join("\n");
  return `${reply}\n\n${label}\n${list}`;
}

export function usePakTani(onAddTask) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialInsight, setInitialInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const loadFieldInsight = useCallback(async (field, lang = "ms") => {
    if (!field) {
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const cacheKey = `${field.id}_${today}_${lang}`;

    if (insightCache.has(cacheKey)) {
      const cached = insightCache.get(cacheKey);
      setInitialInsight(cached);
      setMessages((prev) =>
        prev.some((message) => message.role === "user")
          ? prev
          : [{ role: "assistant", content: cached }],
      );
      return;
    }

    setInsightLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/pak-tani", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldContext: buildFieldContext(field),
          mode: "initial_insight",
          messages: [],
          lang,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const insight = formatReply(data.reply, data.sources, lang);
      insightCache.set(cacheKey, insight);
      setInitialInsight(insight);
      setMessages((prev) =>
        prev.some((message) => message.role === "user")
          ? prev
          : [{ role: "assistant", content: insight }],
      );
    } catch (err) {
      console.error("Pak Tani insight failed:", err);
      const fallback =
        lang === "en"
          ? `I couldn't load the latest Pak Tani insight for ${field.name}. Please try again shortly.`
          : `Saya belum dapat memuatkan nasihat terkini untuk ${field.name}. Cuba sebentar lagi.`;
      setInitialInsight(fallback);
      setMessages((prev) =>
        prev.some((message) => message.role === "user")
          ? prev
          : [{ role: "assistant", content: fallback }],
      );
      setError(err.message);
    } finally {
      setInsightLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (userMessage, field, existingMessages, lang = "ms") => {
      if (!userMessage.trim()) {
        return;
      }

      const msgLower = userMessage.toLowerCase();
      const asksTaskCreation =
        (msgLower.includes("tugas") || msgLower.includes("task")) &&
        (msgLower.includes("buat") ||
          msgLower.includes("create") ||
          msgLower.includes("add") ||
          msgLower.includes("tambah"));

      if (asksTaskCreation && field && onAddTask) {
        const newHistory = [...existingMessages, { role: "user", content: userMessage }];
        onAddTask(buildTaskFromField(field, lang));
        setMessages([
          ...newHistory,
          {
            role: "assistant",
            content:
              lang === "en"
                ? "Done. I added the field task to your Tasks tab."
                : "Selesai. Saya sudah tambah tugasan itu ke tab Tugas.",
          },
        ]);
        return;
      }

      const updatedMessages = [...existingMessages, { role: "user", content: userMessage }];
      setMessages([...updatedMessages, { role: "assistant", content: "" }]);
      setLoading(true);
      setError(null);

      if (abortRef.current) {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();

      try {
        const response = await fetch("/api/pak-tani", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fieldContext: buildFieldContext(field),
            mode: "conversation",
            messages: updatedMessages,
            lang,
          }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setMessages([
          ...updatedMessages,
          { role: "assistant", content: formatReply(data.reply, data.sources, lang) },
        ]);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Pak Tani message failed:", err);
          setError(err.message);
          setMessages([
            ...updatedMessages,
            {
              role: "assistant",
              content:
                lang === "en"
                  ? "Sorry, I can’t answer right now. Please try again shortly."
                  : "Maaf, saya tidak dapat menjawab sekarang. Cuba lagi sebentar.",
            },
          ]);
        }
      } finally {
        setLoading(false);
      }
    },
    [onAddTask],
  );

  const clearConversation = useCallback(() => {
    setMessages([]);
    setInitialInsight(null);
  }, []);

  return {
    messages,
    loading,
    initialInsight,
    insightLoading,
    error,
    loadFieldInsight,
    sendMessage,
    clearConversation,
  };
}
