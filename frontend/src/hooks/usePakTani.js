"use client";

import { useState, useCallback, useRef } from "react";
import { getCurrentStage } from "../data/stageDefinitions";

const insightCache = new Map(); // Cache per fieldId per day

/**
 * Hook for Pak Tani Claude AI interactions
 * Includes per-field per-day caching to avoid redundant API calls
 */
export function usePakTani(onAddTask) {
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

      const updatedMessages = [...existingMessages];

      // --- DEMO INTERCEPTIONS ---

      // Image upload simulation
      if (userMessage.startsWith("[IMAGE_UPLOAD:")) {
        const type = userMessage.split(":")[1].replace("]", "");
        const imageMsg = {
          role: "user",
          content: "Sila analisis gambar ini.",
          isImage: true,
          imageUrl:
            type === "healthy"
              ? "/demo-paddy/good_paddy.jpeg"
              : "/demo-paddy/bad_paddy.jpg",
        };
        const newHistory = [...updatedMessages, imageMsg];
        setMessages([
          ...newHistory,
          { role: "assistant", content: "Menganalisis imej..." },
        ]);
        setLoading(true);
        setError(null);

        await new Promise((r) => setTimeout(r, 2000));

        let responseText = "";
        if (type === "healthy") {
          responseText =
            "Berdasarkan gambar, warna rumput/padi kelihatan sangat hijau dan sihat. Tiada tanda-tanda penyakit daun atau kerosakan perosak dikesan. Kanopi tumbuhan tumbuh dengan padat dan mekar secara seragam. Teruskan amalan pengurusan ladang semasa anda.";
        } else {
          responseText =
            'Berdasarkan gambar, terdapat kerosakan teruk pada hujung dan tepi daun yang berubah menjadi kuning keputihan dan kering memanjang (lesions). Ini adalah simptom klasik **Hawar Daun Bakteria (Bacterial Leaf Blight - BLB)**. Jangkitan kelihatan aktif.\n\nAdakah anda mahu saya sediakan tugasan (task) "Scouting" untuk pengesahan lanjut?';
        }

        setMessages([
          ...newHistory,
          { role: "assistant", content: responseText },
        ]);
        setLoading(false);
        return;
      }

      const msgLower = userMessage.toLowerCase();
      const isAdviceMatch =
        msgLower.includes("advice") ||
        msgLower.includes("nasihat") ||
        msgLower.includes("apa") ||
        msgLower.includes("how") ||
        msgLower.includes("bantu") ||
        msgLower.includes("cadangan");

      // RAG / Advice simulation for the demo if there's an active alert
      if (isAdviceMatch && field?.activeAlert) {
        const newHistory = [
          ...updatedMessages,
          { role: "user", content: userMessage },
        ];
        setMessages([
          ...newHistory,
          { role: "assistant", content: "Mencari maklumat rujukan..." },
        ]);
        setLoading(true);
        setError(null);

        await new Promise((r) => setTimeout(r, 1500));

        let adviceResponse = "";
        if (field.activeAlert.type === "BLB_OUTBREAK") {
          adviceResponse = `Berdasarkan keadaan ladang anda, berikut adalah tindakan segera yang perlu diambil:
1. Keringkan ladang perlahan-lahan untuk mengurangkan kelembapan.
2. Hentikan pembajaan nitrogen serta-merta kerana ia menggalakkan penyebaran jangkitan.
3. Sapukan racun perosak berasaskan tembaga (copper) mengikut kadar yang ditetapkan.

📚 **Sumber Rujukan (RAG):**
* *Panduan Pengurusan Penyakit Padi, Jabatan Pertanian (ms. 24)*
* *Garis Panduan Pengawalan BLB, Bernas 2024*

Adakah anda ingin saya buatkan senarai tugasan (task) untuk tindakan "Scouting & Semburan"?`;
        } else if (field.activeAlert.type === "LSWI_LOW") {
          adviceResponse = `Berdasarkan bacaan LSWI yang rendah, berikut adalah nasihat pakar:
1. Lakukan pemeriksaan segera ke atas saluran paip sekunder dan pintu air ladang.
2. Pastikan tiada halangan fizikal seperti rumput atau bendasing.
3. Tingkatkan kadar aliran air masuk untuk peringkat pembungaan (memerlukan 30% lebih air).

📚 **Sumber Rujukan (RAG):**
* *Manual Pengairan Tanaman Padi, IADA (SOP 3.1)*

Adakah anda mahu saya tambahkan "Pemeriksaan Pintu Air" ke dalam senarai tugas?`;
        } else {
          adviceResponse = `Untuk menangani isu ini, rujuk manual penanaman standard.\n\n📚 **SOP IADA Barat Laut Selangor**\n\nMahu saya siapkan tugasan (task) rawatan?`;
        }

        setMessages([
          ...newHistory,
          { role: "assistant", content: adviceResponse },
        ]);
        setLoading(false);
        return;
      }

      // Task addition simulation
      const isYes =
        msgLower.includes("ya") ||
        msgLower.includes("yes") ||
        msgLower.includes("mahu") ||
        msgLower.includes("mau") ||
        msgLower.includes("boleh") ||
        msgLower.includes("nak") ||
        msgLower.includes("setuju");

      if (isYes && existingMessages.length > 0) {
        // check last assistant message
        const lastMsg = existingMessages[existingMessages.length - 1];
        if (
          lastMsg.role === "assistant" &&
          (lastMsg.content.includes("tugasan") ||
            lastMsg.content.includes("task"))
        ) {
          const newHistory = [
            ...updatedMessages,
            { role: "user", content: userMessage },
          ];
          setMessages([
            ...newHistory,
            {
              role: "assistant",
              content: "Menambah tugasan ke dalam senarai...",
            },
          ]);
          setLoading(true);
          setError(null);

          await new Promise((r) => setTimeout(r, 1000));

          if (onAddTask) {
            const { stage: rawStage } = getCurrentStage(
              field?.transplantingDate || "",
            );
            const stageMy = rawStage?.nameMy || "";
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dateStr = tomorrow.toLocaleDateString("ms-MY", {
              weekday: "long",
              day: "numeric",
              month: "short",
            });

            let title = `Urus ${field?.name}`;
            if (field?.activeAlert?.type === "BLB_OUTBREAK")
              title = `Scouting & Semburan BLB (${field?.name})`;
            if (field?.activeAlert?.type === "LSWI_LOW")
              title = `Pemeriksaan Pintu Air (${field?.name})`;
            else if (field?.activeAlert?.type === "EVI_LOW_NUTRIENT")
              title = `Semak Baja NPK (${field?.name})`;

            onAddTask({
              id: `t_paktani_${Date.now()}`,
              title,
              fieldId: field?.id || "f1",
              fieldName: field?.name || "Ladang",
              dueDate: dateStr,
              dueTime: "08:00 pagi",
              status: "pending",
              alertMessage: field?.activeAlert?.message_ms,
              stage: stageMy,
              ndviValue: field?.latestIndices?.ndvi,
              eviValue: field?.latestIndices?.evi,
            });
          }

          setMessages([
            ...newHistory,
            {
              role: "assistant",
              content:
                "Selesai! Tugasan telah ditambah ke senarai tugas (Tasks) anda. Boleh semak tab **Tugas** di bahagian menu amaran.",
            },
          ]);
          setLoading(false);
          return;
        }
      }

      // Add regular message
      updatedMessages.push({ role: "user", content: userMessage });

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
