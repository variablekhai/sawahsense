// Growth stage definitions for Malaysian MR219/MR263/MR284 varieties
// Day ranges are days-after-transplanting (DAT)

export const STAGES = [
  {
    id: "establishment",
    key: "establishment",
    nameMy: "Penanaman",
    nameEn: "Establishment",
    dayStart: 0,
    dayEnd: 14,
    color: "#58a6ff",
    expectedNdvi: { min: 0.15, max: 0.4 },
    expectedEvi: { min: 0.12, max: 0.35 },
    expectedLswi: { min: 0.45, max: 0.65 },
    description_ms: "Anak benih baru ditanam, akar belum kukuh",
  },
  {
    id: "tillering",
    key: "tillering",
    nameMy: "Anakan",
    nameEn: "Tillering",
    dayStart: 15,
    dayEnd: 40,
    color: "#3fb950",
    expectedNdvi: { min: 0.4, max: 0.65 },
    expectedEvi: { min: 0.35, max: 0.6 },
    expectedLswi: { min: 0.3, max: 0.5 },
    description_ms: "Pertumbuhan terbanyak — anakan terbentuk dengan cepat",
  },
  {
    id: "panicle-initiation",
    key: "panicleInit",
    nameMy: "Permulaan Malai",
    nameEn: "Panicle Initiation",
    dayStart: 41,
    dayEnd: 55,
    color: "#d29922",
    expectedNdvi: { min: 0.6, max: 0.8 },
    expectedEvi: { min: 0.55, max: 0.75 },
    expectedLswi: { min: 0.35, max: 0.55 },
    description_ms: "Pembentukan malai bermula — keperluan nutrisi tinggi",
  },
  {
    id: "heading",
    key: "heading",
    nameMy: "Pembungaan",
    nameEn: "Heading",
    dayStart: 56,
    dayEnd: 70,
    color: "#f0883e",
    expectedNdvi: { min: 0.65, max: 0.85 },
    expectedEvi: { min: 0.6, max: 0.8 },
    expectedLswi: { min: 0.3, max: 0.5 },
    description_ms: "Malai muncul — peringkat kritikal untuk hasil tinggi",
  },
  {
    id: "grain-fill",
    key: "grainFill",
    nameMy: "Pengisian Butir",
    nameEn: "Grain Filling",
    dayStart: 71,
    dayEnd: 95,
    color: "#bc8cff",
    expectedNdvi: { min: 0.6, max: 0.85 },
    expectedEvi: { min: 0.55, max: 0.8 },
    expectedLswi: { min: 0.2, max: 0.45 },
    description_ms: "Bijirin membesar dan berisi — NDVI mula turun perlahan",
  },
  {
    id: "maturation",
    key: "maturation",
    nameMy: "Kematangan",
    nameEn: "Maturation",
    dayStart: 96,
    dayEnd: 115,
    color: "#f85149",
    expectedNdvi: { min: 0.3, max: 0.6 },
    expectedEvi: { min: 0.25, max: 0.55 },
    expectedLswi: { min: 0.1, max: 0.3 },
    description_ms: "Padi menguning — sedia untuk dituai selepas GDD 1100",
  },
];

/**
 * Get the current growth stage based on days after transplanting
 * @param {string} transplantingDateISO - ISO date string
 * @returns {{ stage: Object, daysSince: number }}
 */
export const getCurrentStage = (transplantingDateISO) => {
  if (!transplantingDateISO) return { stage: STAGES[0], daysSince: 0 };

  const transplant = new Date(transplantingDateISO);
  const now = new Date();
  const daysSince = Math.floor((now - transplant) / (1000 * 60 * 60 * 24));

  const stage =
    STAGES.find((s) => daysSince >= s.dayStart && daysSince <= s.dayEnd) ||
    (daysSince > 115 ? STAGES[5] : STAGES[0]);

  return { stage, daysSince };
};

export const getStageLabel = (transplantingDateISO, lang = "ms") => {
  const { stage, daysSince } = getCurrentStage(transplantingDateISO);
  const name = lang === "ms" ? stage.nameMy : stage.nameEn;
  return `${name} · Hari ${daysSince}`;
};
