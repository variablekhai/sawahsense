"use client";

import type { Field } from "@/types";

const GEE_ENDPOINT =
  process.env.NEXT_PUBLIC_BACKEND_URL
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gee-indices`
    : process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8000/api/gee-indices"
      : "/api/gee-indices";

// Demo window: GEE filterDate is [start, end), so end = 2026-06-01 captures all of May.
const GEE_START_DATE = "2026-03-01";
const GEE_END_DATE = "2026-06-01";

// GEE thumbnail URLs are signed and expire — keep cache short enough that
// a stale entry rarely outlives the URL's validity.
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const CACHE_VERSION = "v2";

interface GeeApiResponse {
  fieldId: string;
  timeSeries?: Field["timeSeries"];
  latestIndices?: { ndvi?: number; evi?: number; lswi?: number } | null;
  heatmapsByDate?: Field["heatmapsByDate"];
  heatmapBounds?: Field["heatmapBounds"];
}

interface CacheEntry {
  ts: number;
  data: GeeApiResponse;
}

function cacheKey(fieldId: string) {
  return `sawahsense.gee.${CACHE_VERSION}.${fieldId}.${GEE_START_DATE}-${GEE_END_DATE}`;
}

function readCache(fieldId: string): GeeApiResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(fieldId));
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.ts > CACHE_TTL_MS) {
      window.localStorage.removeItem(cacheKey(fieldId));
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache(fieldId: string, data: GeeApiResponse) {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry = { ts: Date.now(), data };
    window.localStorage.setItem(cacheKey(fieldId), JSON.stringify(entry));
  } catch {
    // Quota exceeded or storage disabled — silent fall-through.
  }
}

function mergeFieldWithGeeData(field: Field, data: GeeApiResponse): Field {
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
    heatmapsByDate: data.heatmapsByDate ?? undefined,
    heatmapBounds: data.heatmapBounds ?? undefined,
    alertLevel: "healthy",
    activeAlert: undefined,
  } satisfies Field;
}

export async function fetchLiveFieldData(field: Field) {
  const cached = readCache(field.id);
  if (cached) {
    return mergeFieldWithGeeData(field, cached);
  }

  const response = await fetch(GEE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fieldId: field.id,
      geometry: field.geometry,
      startDate: GEE_START_DATE,
      endDate: GEE_END_DATE,
    }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(
      errorPayload?.detail || `Failed to load GEE data for ${field.id}`,
    );
  }

  const data = (await response.json()) as GeeApiResponse;
  writeCache(field.id, data);

  return mergeFieldWithGeeData(field, data);
}
