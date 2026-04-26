"use client";

import { useState, useCallback, useRef } from "react";
import { getCurrentStage } from "@/features/fields/lib/stage-definitions";
import { getDemoAnswerForField } from "@/features/pak-tani/data/pak-tani-demo-qna";

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

  const t = useCallback((lang, ms, en) => (lang === "en" ? en : ms), []);

  const detectLang = useCallback((explicitLang, text = "") => {
    if (explicitLang === "ms" || explicitLang === "en") return explicitLang;
    const q = text.toLowerCase();
    const enHints = ["what", "how", "when", "can you", "please", "why"];
    return enHints.some((w) => q.includes(w)) ? "en" : "ms";
  }, []);

  /**
   * Load the initial insight for a field (shown when Pak Tani tab opens or ambient card fires)
   */
  const loadFieldInsight = useCallback(async (field, lang = "en") => {
    if (!field) return;

    const today = new Date().toISOString().split("T")[0];
    const cacheKey = `${field.id}_${today}_${lang}`;

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
          lang,
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
      const fallback =
        lang === "en"
          ? field.activeAlert
            ? field.activeAlert.message_en +
              " Please inspect your field promptly."
            : `Field ${field.name} looks good at the ${stage.nameEn} stage. Any questions?`
          : field.activeAlert
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
    async (userMessage, field, existingMessages, lang = "ms") => {
      if (!userMessage.trim()) return;
      const currentLang = detectLang(lang, userMessage);

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
          content: t(
            currentLang,
            "Sila analisis gambar ini.",
            "Please analyze this image.",
          ),
          isImage: true,
          imageUrl:
            type === "healthy"
              ? "/demo-paddy/good_paddy.jpeg"
              : "/demo-paddy/bad_paddy.jpg",
        };
        const newHistory = [...updatedMessages, imageMsg];
        setMessages([
          ...newHistory,
          {
            role: "assistant",
            content: t(
              currentLang,
              "Menganalisis imej...",
              "Analyzing image...",
            ),
          },
        ]);
        setLoading(true);
        setError(null);

        await new Promise((r) => setTimeout(r, 2000));

        let responseText = "";
        if (type === "healthy") {
          responseText = t(
            currentLang,
            "Daripada gambar ini, padi nampak sihat dan sekata. Tiada tanda jelas penyakit pada daun. Teruskan penjagaan seperti biasa dan semak semula dalam 3-5 hari.",
            "From this picture, the crop looks healthy and uniform. There are no clear signs of leaf disease. Continue normal care and check back in 3-5 days.",
          );
        } else {
          responseText = t(
            currentLang,
            'Daripada gambar ini, ada tanda penyakit daun yang kuat. Ini mungkin **Hawar Daun Bakteria (BLB)**.\n\nCadangan cepat:\n1. Semak sudut ladang yang paling teruk dulu.\n2. Asingkan aliran air jika boleh.\n3. Rujuk pegawai pertanian berdekatan.\n\nMahu saya buat tugasan "Scouting" untuk anda?',
            'From this picture, there are strong signs of leaf disease. This might be **Bacterial Leaf Blight (BLB)**.\n\nQuick recommendations:\n1. Check the worst corners of the field first.\n2. Isolate the water flow if possible.\n3. Consult a nearby agricultural officer.\n\nWould you like me to create a "Scouting" task for you?',
          );
        }

        setMessages([
          ...newHistory,
          { role: "assistant", content: responseText },
        ]);
        setLoading(false);
        return;
      }

      const msgLower = userMessage.toLowerCase();

      // Direct task creation path for task-request questions in demo flow.
      const asksTaskCreation =
        (msgLower.includes("tugas") || msgLower.includes("task")) &&
        (msgLower.includes("buat") ||
          msgLower.includes("create") ||
          msgLower.includes("add") ||
          msgLower.includes("tambah"));
      if (asksTaskCreation && field && onAddTask) {
        const newHistory = [
          ...updatedMessages,
          { role: "user", content: userMessage },
        ];
        setMessages([
          ...newHistory,
          {
            role: "assistant",
            content: t(
              currentLang,
              "Membuat tugasan sekarang...",
              "Creating task now...",
            ),
          },
        ]);
        setLoading(true);
        setError(null);

        await new Promise((r) => setTimeout(r, 700));

        const { stage: rawStage } = getCurrentStage(
          field?.transplantingDate || "",
        );
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
          dueDate: currentLang === "en" ? dueDateEn : dueDateMs,
          dueTime: currentLang === "en" ? "8:00 AM" : "08:00 pagi",
          status: "pending",
          alertMessage:
            currentLang === "en"
              ? field?.activeAlert?.message_en
              : field?.activeAlert?.message_ms,
          stage: stageMy,
          ndviValue: field?.latestIndices?.ndvi,
          eviValue: field?.latestIndices?.evi,
        });

        setMessages([
          ...newHistory,
          {
            role: "assistant",
            content: t(
              currentLang,
              "Siap, tugasan sudah ditambah dalam tab Tugas. Jika mahu, saya boleh beri checklist ringkas untuk kerja lapangan.",
              "Done, the task has been added in the Tasks tab. If you want, I can also give a short field checklist.",
            ),
          },
        ]);
        setLoading(false);
        return;
      }

      // Scripted Q&A for demo fields
      if (field?.id) {
        const scriptedAnswer = getDemoAnswerForField(
          field.id,
          userMessage,
          currentLang,
        );
        if (scriptedAnswer) {
          const newHistory = [
            ...updatedMessages,
            { role: "user", content: userMessage },
          ];
          setMessages([...newHistory, { role: "assistant", content: "..." }]);
          setLoading(true);
          setError(null);

          await new Promise((r) => setTimeout(r, 800));

          setMessages([
            ...newHistory,
            { role: "assistant", content: scriptedAnswer },
          ]);
          setLoading(false);
          return;
        }
      }

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
          {
            role: "assistant",
            content: t(
              currentLang,
              "Mencari maklumat rujukan...",
              "Looking up reference guidance...",
            ),
          },
        ]);
        setLoading(true);
        setError(null);

        await new Promise((r) => setTimeout(r, 1500));

        let adviceResponse = "";
        if (field.activeAlert.type === "BLB_OUTBREAK") {
          adviceResponse = `Saya faham keadaan ini merisaukan. Kita buat langkah mudah dulu:
1. Pergi ke kawasan yang paling kuning dahulu.
2. Kurangkan air bertakung jika boleh.
3. Tangguh baja daun buat sementara.
4. Jika makin merebak, terus hubungi pegawai pertanian.

Mahu saya buatkan tugasan "Scouting & Semburan" supaya senang ikut langkah?`;
        } else if (field.activeAlert.type === "LSWI_LOW") {
          adviceResponse = `Nampak tanda air tidak cukup. Langkah cepat:
1. Semak pintu air dan saluran masuk sekarang.
2. Buang halangan seperti rumput atau sampah.
3. Tambah aliran air perlahan-lahan.

Mahu saya tambah tugasan "Pemeriksaan Pintu Air" ke senarai tugas anda?`;
        } else {
          adviceResponse = `Ada perubahan pada ladang anda. Cadangan saya: semak kawasan yang paling lemah dulu dan ambil gambar untuk rujukan.\n\nMahu saya siapkan tugasan rawatan untuk anda?`;
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
              content: t(
                currentLang,
                "Menambah tugasan ke dalam senarai...",
                "Adding task to your list...",
              ),
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
              dueTime: currentLang === "en" ? "8:00 AM" : "08:00 pagi",
              status: "pending",
              alertMessage:
                currentLang === "en"
                  ? field?.activeAlert?.message_en
                  : field?.activeAlert?.message_ms,
              stage: stageMy,
              ndviValue: field?.latestIndices?.ndvi,
              eviValue: field?.latestIndices?.evi,
            });
          }

          setMessages([
            ...newHistory,
            {
              role: "assistant",
              content: t(
                currentLang,
                "Selesai! Tugasan telah ditambah ke senarai tugas (Tasks) anda. Boleh semak tab **Tugas** di bahagian menu amaran.",
                "Done! The task has been added to your Tasks list. Please check the **Tasks** tab.",
              ),
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
              content: t(
                currentLang,
                "Maaf, saya tidak dapat menjawab sekarang. Cuba lagi sebentar.",
                "Sorry, I can’t answer right now. Please try again shortly.",
              ),
            },
          ]);
        }
      }

      setLoading(false);
    },
    [detectLang, onAddTask, t],
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
