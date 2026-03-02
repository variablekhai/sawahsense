/**
 * SawahSense Demo Field Data — Sekinchan, Selangor
 * All fields are adjacent paddy plots in the main Sekinchan granary area (Kawasan IADA Barat Laut Selangor)
 * Real-looking GeoJSON polygons roughly tiling the Sekinchan paddy belt.
 */

// Sekinchan center: ~3.465°N, 101.020°E
// Fields are placed as adjacent 400–700m plots covering the main paddy area

// Helper: generate agronomic time series
function generateTimeSeries(transplantDate, alertType) {
  const series = [];
  const start = new Date(transplantDate);
  // 32 observations over ~110 days
  for (let i = 0; i < 32; i++) {
    const day = i * 3.5;
    const date = new Date(start);
    date.setDate(date.getDate() + Math.round(day));
    const cloudPct =
      Math.random() < 0.18 ? 65 + Math.random() * 30 : Math.random() * 20;

    // Agronomic curve: low → rise → peak at heading → slight decline
    const t = day / 110;
    const base =
      t < 0.15
        ? 0.2 + t * 2.0
        : t < 0.55
          ? 0.5 + 0.3 * Math.sin(((t - 0.15) * Math.PI) / 0.8)
          : t < 0.75
            ? 0.8 - (t - 0.55) * 0.6
            : 0.68 - (t - 0.75) * 0.2;

    // Apply alert degradation for affected fields in late stage
    let eviMod = 1.0;
    if (alertType === "EVI_DROP" && day > 32 && day < 50) {
      eviMod = 0.84 - (day - 32) * 0.008; // gradual drop
    }

    const noise = () => (Math.random() - 0.5) * 0.04;
    series.push({
      date: date.toISOString().split("T")[0],
      ndvi: Math.min(0.92, Math.max(0.1, base + noise())),
      evi: Math.min(0.9, Math.max(0.08, base * 0.88 * eviMod + noise())),
      lswi:
        alertType === "LSWI_LOW" && day > 40
          ? Math.min(0.55, Math.max(0.05, base * 0.45 + noise()))
          : Math.min(0.72, Math.max(0.05, base * 0.58 + noise())),
      cloudPct: Math.round(cloudPct),
    });
  }
  return series;
}

// ─── Transplanting dates (staggered to show different stages) ─────────────────
const T1 = "2025-11-12"; // Petak A — Anakan (40 days)
const T2 = "2025-11-01"; // Petak B — Permulaan Malai (52 days)
const T3 = "2025-11-08"; // Petak C — Anakan (45 days)
const T4 = "2025-11-03"; // Petak D — Permulaan Malai (50 days)
const T5 = "2025-12-01"; // Petak E — Pembentukan Anak Benih (22 days)
const T6 = "2025-10-25"; // Petak F — Pembungaan (59 days)

// ─── Sekinchan GeoJSON field polygons ─────────────────────────────────────────
// All coords in [lng, lat] format. Plots are ~0.5km x 0.4km, adjacent.
// Origin grid: Row 1 (A,B,C) above Row 2 (D,E,F)

export const DEMO_FIELDS = [
  {
    id: "f1",
    name: "Petak A — Sekinchan Utara",
    location: "Sekinchan, Selangor",
    areaHa: 69.43,
    variety: "MR263",
    transplantingDate: T1,
    alertLevel: "critical",
    latestIndices: { ndvi: 0.61, evi: 0.54, lswi: 0.31 },
    activeAlert: {
      type: "EVI_DROP",
      message_ms:
        "EVI menurun 16% dalam 5 hari — risiko serangan perosak atau kekurangan nitrogen",
      message_en:
        "EVI dropped 16% in 5 days — risk of pest attack or nitrogen deficiency",
      percentDrop: 16,
      daysSpan: 5,
    },
    centroid: [3.5299550765592116, 101.13180041313173],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.12468719482423, 3.5275135499933956],
          [101.13683223724367, 3.535651981068987],
          [101.13893508911134, 3.5323537833894094],
          [101.12674713134767, 3.524300991785054],
          [101.12468719482423, 3.5275135499933956],
        ],
      ],
    },
    timeSeries: generateTimeSeries(T1, "EVI_DROP"),
  },

  {
    id: "f2",
    name: "Petak B — Sekinchan Tengah",
    location: "Sekinchan, Selangor",
    areaHa: 64.61,
    variety: "MR219",
    transplantingDate: T2,
    alertLevel: "warning",
    latestIndices: { ndvi: 0.66, evi: 0.61, lswi: 0.22 },
    activeAlert: {
      type: "LSWI_LOW",
      message_ms: "Paras air ladang menurun — semak saluran irigasi segera",
      message_en:
        "Field water level dropping — check irrigation channel immediately",
    },
    centroid: [3.5331997409699594, 101.12969219684601],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.12264871597291, 3.530683263209576],
          [101.13472938537599, 3.5387359994553473],
          [101.13674640655518, 3.535651981068987],
          [101.12464427948, 3.5277277201459274],
          [101.12264871597291, 3.530683263209576],
        ],
      ],
    },
    timeSeries: generateTimeSeries(T2, "LSWI_LOW"),
  },

  {
    id: "f3",
    name: "Petak C — Sekinchan Timur",
    location: "Sekinchan, Selangor",
    areaHa: 68.68,
    variety: "MR284",
    transplantingDate: T3,
    alertLevel: "healthy",
    latestIndices: { ndvi: 0.74, evi: 0.68, lswi: 0.42 },
    activeAlert: undefined,
    centroid: [3.5363587260532987, 101.12765908241273],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.12052440643312, 3.533895799348431],
          [101.13271236419679, 3.5420341744251918],
          [101.13477230072023, 3.5387359994553473],
          [101.1226272583008, 3.5307689309842245],
          [101.12052440643312, 3.533895799348431],
        ],
      ],
    },
    timeSeries: generateTimeSeries(T3, null),
  },

  {
    id: "f4",
    name: "Petak D — Sekinchan Selatan",
    location: "Sekinchan, Selangor",
    areaHa: 65.3,
    variety: "MR263",
    transplantingDate: T4,
    alertLevel: "healthy",
    latestIndices: { ndvi: 0.71, evi: 0.65, lswi: 0.39 },
    activeAlert: undefined,
    centroid: [3.5347096303825603, 101.11130833625795],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.10434532165529, 3.5323537833894094],
          [101.11627578735353, 3.5401923379032407],
          [101.11829280853273, 3.5371083243634605],
          [101.10631942749023, 3.529184075874131],
          [101.10434532165529, 3.5323537833894094],
        ],
      ],
    },
    timeSeries: generateTimeSeries(T4, null),
  },

  {
    id: "f5",
    name: "Petak E — Sekinchan Baru",
    location: "Sekinchan, Selangor",
    areaHa: 66.39,
    variety: "MR219",
    transplantingDate: T5,
    alertLevel: "healthy",
    latestIndices: { ndvi: 0.38, evi: 0.32, lswi: 0.18 },
    activeAlert: undefined,
    centroid: [3.5379221525330142, 101.10921621322632],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.10219955444336, 3.5355663137451248],
          [101.11421585083009, 3.5434476743868255],
          [101.11623287200929, 3.540278004799458],
          [101.10421657562256, 3.5323966172006482],
          [101.10219955444336, 3.5355663137451248],
        ],
      ],
    },
    timeSeries: generateTimeSeries(T5, null),
  },

  {
    id: "f6",
    name: "Petak F — Sekinchan Lama",
    location: "Sekinchan, Selangor",
    areaHa: 67.77,
    variety: "MR284",
    transplantingDate: T6,
    alertLevel: "healthy",
    latestIndices: { ndvi: 0.58, evi: 0.52, lswi: 0.34 },
    activeAlert: undefined,
    centroid: [3.5664381567797783, 101.09735012054443],
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [101.08988285064699, 3.5658492182458636],
          [101.10352993011475, 3.570603586713232],
          [101.10486030578615, 3.5670485207196885],
          [101.0911273956299, 3.5622513014403294],
          [101.08988285064699, 3.5658492182458636],
        ],
      ],
    },
    timeSeries: generateTimeSeries(T6, null),
  },
];

export function getFieldsSortedByAlert() {
  const order = { critical: 0, warning: 1, healthy: 2 };
  return [...DEMO_FIELDS].sort(
    (a, b) => order[a.alertLevel] - order[b.alertLevel],
  );
}
