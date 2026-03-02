"use client";

import { useState, useEffect } from "react";

const BASE_TEMP = 10; // Rice base temperature °C
const GDD_TARGET = 1100; // Required GDD for Malaysian paddy

/**
 * Calculate accumulated GDD from transplanting date to today
 * Uses Open-Meteo free API
 */
export function useGDD(field) {
  const [gdd, setGdd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!field?.transplantingDate || !field?.centroid) return;

    const fetchGDD = async () => {
      setLoading(true);
      setError(null);

      const [lat, lng] = field.centroid;
      const startDate = field.transplantingDate;
      const endDate = new Date().toISOString().split("T")[0];

      try {
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", lat.toString());
        url.searchParams.set("longitude", lng.toString());
        url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
        url.searchParams.set("start_date", startDate);
        url.searchParams.set("end_date", endDate);
        url.searchParams.set("timezone", "Asia/Kuala_Lumpur");

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Open-Meteo request failed");

        const weatherData = await response.json();
        const { daily } = weatherData;

        if (!daily || !daily.time) throw new Error("No weather data returned");

        // Calculate accumulated GDD
        let accumulated = 0;
        const dailyGdd = [];

        for (let i = 0; i < daily.time.length; i++) {
          const tMax = daily.temperature_2m_max[i] ?? 32;
          const tMin = daily.temperature_2m_min[i] ?? 24;
          const dayGdd = Math.max(0, (tMax + tMin) / 2 - BASE_TEMP);
          accumulated += dayGdd;
          dailyGdd.push({
            date: daily.time[i],
            gdd: parseFloat(dayGdd.toFixed(1)),
          });
        }

        const remaining = Math.max(0, GDD_TARGET - accumulated);
        // Estimate remaining days using avg last 7-day temp
        const lastWeek = dailyGdd.slice(-7);
        const avgDailyGdd =
          lastWeek.reduce((a, b) => a + b.gdd, 0) / lastWeek.length;
        const daysRemaining =
          avgDailyGdd > 0 ? Math.ceil(remaining / avgDailyGdd) : 30;

        const harvestDate = new Date();
        harvestDate.setDate(harvestDate.getDate() + daysRemaining);

        setGdd({
          accumulated: Math.round(accumulated),
          target: GDD_TARGET,
          remaining: Math.round(remaining),
          daysRemaining,
          percentComplete: Math.min(
            100,
            Math.round((accumulated / GDD_TARGET) * 100),
          ),
          predictedHarvestDate: harvestDate.toLocaleDateString("ms-MY", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          dailyGdd,
          source: "live",
        });
      } catch (err) {
        console.warn("GDD fetch failed, using estimated values:", err.message);
        // Estimate based on transplanting date
        const transplant = new Date(field.transplantingDate);
        const now = new Date();
        const daysSince = Math.floor((now - transplant) / 86400000);
        const estAccumulated = Math.min(GDD_TARGET, daysSince * 14); // ~14 GDD/day in Malaysia
        const remaining = Math.max(0, GDD_TARGET - estAccumulated);
        const daysRemaining = Math.ceil(remaining / 14);
        const harvestDate = new Date();
        harvestDate.setDate(harvestDate.getDate() + daysRemaining);

        setGdd({
          accumulated: estAccumulated,
          target: GDD_TARGET,
          remaining,
          daysRemaining,
          percentComplete: Math.min(
            100,
            Math.round((estAccumulated / GDD_TARGET) * 100),
          ),
          predictedHarvestDate: harvestDate.toLocaleDateString("ms-MY", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          dailyGdd: [],
          source: "estimated",
        });
      }

      setLoading(false);
    };

    fetchGDD();
  }, [field?.id, field?.transplantingDate]);

  return { gdd, loading, error };
}
