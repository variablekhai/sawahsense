// SawahSense shared types

export type AlertLevel = "healthy" | "warning" | "critical";
export type IndexType = "NDVI" | "EVI" | "LSWI";
export type Lang = "ms" | "en";
export type TabId = "fields" | "tasks" | "alerts" | "pakTani";

export interface LatestIndices {
  ndvi: number;
  evi: number;
  lswi: number;
}

export interface ActiveAlert {
  type: string;
  message_ms: string;
  message_en: string;
  percentDrop?: number;
  daysSpan?: number;
}

export interface TimeSeriesPoint {
  date: string;
  ndvi: number;
  evi: number;
  lswi: number;
  cloudPct: number;
}

export interface AcquisitionDate {
  date: string;
  cloudPct: number;
}

export interface Field {
  id: string;
  name: string;
  location: string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
  centroid: [number, number];
  transplantingDate: string;
  alertLevel: AlertLevel;
  latestIndices: LatestIndices;
  areaHa?: number;
  variety?: string;
  activeAlert?: ActiveAlert;
  timeSeries: TimeSeriesPoint[];
  /** GeoJSON bounding box [[south, west], [north, east]] for Leaflet imageOverlay */
  heatmapBounds?: [[number, number], [number, number]];
  /** Path prefix — tiles live at {tileBasePath}/{index}/{date}.png */
  tileBasePath?: string;
  /** Acquisition schedule with cloud % */
  acquisitionDates?: AcquisitionDate[];
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}
