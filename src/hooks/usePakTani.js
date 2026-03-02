"use client";

import { useState, useCallback, useRef } from "react";
import { getCurrentStage } from "../data/stageDefinitions";

const insightCache = new Map(); // Cache per fieldId per day

/**
 * Hook for Pak Tani Claude AI interactions
 * Includes per-field per-day caching to avoid redundant API calls
 */
export function usePakTani() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialInsight, setInitialInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  /**
   * Load the initial insight for a field (shown when Pak Tani tab opens or ambient card fires)
   */
  const loadFieldInsight = useCallback(async (field) => {
    if (!field) return;

    const today = new Date().toISOString().split("T")[0];
    const cacheKey = `${field.id}_${today}`;

    // Return cached insight if available
    if (insightCache.has(cacheKey)) {
      const cached = insightCache.get(cacheKey);
      setInitialInsight(cached);
      setMessages([{ role: "assistant", content: cached }]);
      return;
    }

    setInsightLoading(true);
    setError(null);

    const { stage, daysSince } = getCurrentStage(field.transplantingDate);

    const fieldContext = {
      fieldName: field.name,
      location: field.location,
      stage: stage.nameMy,
      daysSincePlanting: daysSince,
      ndvi: field.latestIndices?.ndvi,
      evi: field.latestIndices?.evi,
      lswi: field.latestIndices?.lswi,
      alert: field.activeAlert?.message_ms || null,
      alertType: field.activeAlert?.type || null,
    };

    try {
      const response = await fetch("/api/pak-tani", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldContext,
          mode: "initial_insight",
          messages: [],
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let insight = "";

      setMessages([{ role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        insight += chunk;
        setMessages([{ role: "assistant", content: insight }]);
      }

      insightCache.set(cacheKey, insight);
      setInitialInsight(insight);
    } catch (err) {
      console.error("Pak Tani insight failed:", err);
      const fallback = field.activeAlert
        ? field.activeAlert.message_ms + " Sila semak ladang anda segera."
        : `Ladang ${field.name} kelihatan baik pada peringkat ${stage.nameMy}. Ada soalan?`;
      setInitialInsight(fallback);
      setMessages([{ role: "assistant", content: fallback }]);
    }

    setInsightLoading(false);
  }, []);

  /**
   * Send a follow-up message to Pak Tani
   */
  const sendMessage = useCallback(
    async (userMessage, field, existingMessages) => {
      if (!userMessage.trim()) return;

      const { stage, daysSince } = getCurrentStage(
        field?.transplantingDate || "",
      );

      const fieldContext = {
        fieldName: field?.name || "Ladang",
        location: field?.location,
        stage: stage?.nameMy,
        daysSincePlanting: daysSince,
        ndvi: field?.latestIndices?.ndvi,
        evi: field?.latestIndices?.evi,
        lswi: field?.latestIndices?.lswi,
        alert: field?.activeAlert?.message_ms || null,
      };

      const updatedMessages = [
        ...existingMessages,
        { role: "user", content: userMessage },
      ];

      setMessages([...updatedMessages, { role: "assistant", content: "" }]);
      setLoading(true);
      setError(null);

      // Cancel any in-flight request
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      try {
        const response = await fetch("/api/pak-tani", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fieldContext,
            mode: "conversation",
            messages: updatedMessages,
          }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);
        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          assistantResponse += chunk;
          setMessages([
            ...updatedMessages,
            { role: "assistant", content: assistantResponse },
          ]);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Pak Tani message failed:", err);
          setError(err.message);
          setMessages([
            ...updatedMessages,
            {
              role: "assistant",
              content:
                "Maaf, saya tidak dapat menjawab sekarang. Cuba lagi sebentar.",
            },
          ]);
        }
      }

      setLoading(false);
    },
    [],
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
