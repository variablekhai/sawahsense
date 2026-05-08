"use client";

import type { Field } from "@/types";

const GEE_ENDPOINT =
  process.env.NEXT_PUBLIC_BACKEND_URL
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gee-indices`
    : process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8000/api/gee-indices"
      : "/api/gee-indices";

export async function fetchLiveFieldData(field: Field) {
  const response = await fetch(GEE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fieldId: field.id,
      geometry: field.geometry,
      startDate: new Date(Date.now() - 35 * 86400000).toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(
      errorPayload?.detail || `Failed to load GEE data for ${field.id}`,
    );
  }

  const data = await response.json();

  return {
    ...field,
    timeSeries: data.timeSeries || [],
    latestIndices: data.latestIndices
      ? {
          ndvi: data.latestIndices.ndvi ?? 0,
          evi: data.latestIndices.evi ?? 0,
          lswi: data.latestIndices.lswi ?? 0,
        }
      : field.latestIndices,
    acquisitionDates: data.timeSeries || [],
    alertLevel: "healthy",
    activeAlert: undefined,
  } satisfies Field;
}
