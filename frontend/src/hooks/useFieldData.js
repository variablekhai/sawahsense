"use client";

import { useState, useEffect } from "react";
import { DEMO_FIELDS, getFieldById } from "../data/demoFields";

/**
 * Hook to fetch field index data
 * Tries GEE first, falls back to seeded demo data
 */
export function useFieldData(fieldId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("demo"); // 'live' | 'demo'
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fieldId) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Try GEE indices first
      try {
        const field = getFieldById(fieldId);
        const response = await fetch("/api/gee-indices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fieldId,
            geometry: field?.geometry,
            startDate: new Date(Date.now() - 120 * 86400000)
              .toISOString()
              .split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.timeSeries && result.timeSeries.length > 0) {
            setData(result);
            setSource("live");
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("GEE unavailable, using seeded data:", err.message);
      }

      // Fall back to seeded demo data
      const demoField = getFieldById(fieldId);
      if (demoField) {
        setData({
          timeSeries: demoField.timeSeries,
          latestIndices: demoField.latestIndices,
          source: "demo",
        });
        setSource("demo");
      } else {
        setError("Field not found");
      }
      setLoading(false);
    };

    fetchData();
  }, [fieldId]);

  return { data, loading, source, error };
}

/**
 * Hook to get all demo fields (or live fields in production)
 */
export function useAllFields() {
  const [fields] = useState(DEMO_FIELDS);
  const [source] = useState("demo");
  return { fields, source };
}
