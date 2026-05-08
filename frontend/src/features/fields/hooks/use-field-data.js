"use client";

import { useState, useEffect } from "react";
import { FIELDS, getFieldById } from "@/features/fields/data/fields";
import { fetchLiveFieldData } from "@/features/fields/lib/live-field-data";

/**
 * Hook to fetch field index data from GEE
 */
export function useFieldData(fieldId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("live");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fieldId) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const field = getFieldById(fieldId);
        if (!field) throw new Error("Field not found");
        const result = await fetchLiveFieldData(field);
        setData(result);
      } catch (err) {
        console.error("GEE API error:", err);
        setError("Error connecting to GEE API");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fieldId]);

  return { data, loading, source, error };
}

/**
 * Hook to get all live fields
 */
export function useAllFields() {
  const [fields] = useState(FIELDS);
  const [source] = useState("live");
  return { fields, source };
}
