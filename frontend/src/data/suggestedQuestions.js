// Hardcoded suggested questions per stage+alert combination
// Keyed by: `${stage.id}` or `${stage.id}_${alertType}`

export const SUGGESTED_QUESTIONS = {
  // Tillering stage
  tillering: [
    {
      ms: "Bilakah masa terbaik tabur baja NPK?",
      en: "When is the best time to apply NPK fertilizer?",
    },
    {
      ms: "Bagaimana nak tahu anakan sudah cukup?",
      en: "How do I know if tillering is sufficient?",
    },
    {
      ms: "Apakah tanda-tanda serangan BPH?",
      en: "What are signs of BPH (brown planthopper) attack?",
    },
  ],
  tillering_EVI_DROP: [
    {
      ms: "Kenapa EVI turun dengan cepat?",
      en: "Why did EVI drop so quickly?",
    },
    {
      ms: "Berapa baja NPK nak kena tabur?",
      en: "How much NPK fertilizer should I apply?",
    },
    { ms: "Macam mana nak kenal BPH awal?", en: "How to detect BPH early?" },
  ],
  tillering_LSWI_LOW: [
    {
      ms: "Berapa paras air yang betul untuk anakan?",
      en: "What is the correct water level for tillering?",
    },
    {
      ms: "Macam mana nak semak saluran irigasi?",
      en: "How do I check the irrigation channel?",
    },
    {
      ms: "Boleh tanaman bertahan tanpa irigasi?",
      en: "Can the crop survive without irrigation?",
    },
  ],

  // Panicle initiation
  "panicle-initiation": [
    {
      ms: "Apa nutrisi penting pada peringkat ini?",
      en: "What nutrients are important at this stage?",
    },
    {
      ms: "Bilakah masa bagi racun kulat?",
      en: "When should I apply fungicide?",
    },
    {
      ms: "NDVI saya 0.65 — adakah ini normal?",
      en: "My NDVI is 0.65 — is this normal?",
    },
  ],
  "panicle-initiation_EVI_DROP": [
    {
      ms: "EVI turun — adakah ini tanda penyakit blast?",
      en: "EVI drop — could this be blast disease?",
    },
    {
      ms: "Racun apa yang sesuai untuk blast padi?",
      en: "What pesticide is suitable for rice blast?",
    },
    {
      ms: "Boleh bagi baja foliar sekarang?",
      en: "Can I apply foliar fertilizer now?",
    },
  ],

  // Heading
  heading: [
    {
      ms: "Apakah tanda pembungaan yang normal?",
      en: "What are signs of normal heading/flowering?",
    },
    {
      ms: "Bilakah perlu berhenti bagi air?",
      en: "When should I stop irrigating?",
    },
    {
      ms: "Macam mana nak pastikan peratusan spikelet tinggi?",
      en: "How to ensure high spikelet percentage?",
    },
  ],
  heading_NDVI_LOW: [
    {
      ms: "NDVI rendah semasa pembungaan — apa yang perlu dibuat?",
      en: "Low NDVI during heading — what to do?",
    },
    {
      ms: "Adakah ini akan kesan hasil padi saya?",
      en: "Will this affect my paddy yield?",
    },
    {
      ms: "Boleh bagi baja semasa peringkat ini?",
      en: "Can I fertilize at this stage?",
    },
  ],

  // Grain filling
  "grain-fill": [
    { ms: "Bilakah masa menuai?", en: "When is the right time to harvest?" },
    {
      ms: "Macam mana nak tahu padi dah masak?",
      en: "How do I know when paddy is ripe?",
    },
    {
      ms: "LSWI rendah — perlukah menghentikan pengairan?",
      en: "Low LSWI — should I stop irrigation?",
    },
  ],

  // Default fallback
  default: [
    {
      ms: "Apakah nasihat Pak Tani untuk ladang ini?",
      en: "What is Pak Tani's advice for this field?",
    },
    { ms: "Bilakah masa menuai?", en: "When is the expected harvest time?" },
    { ms: "Adakah indeks ini normal?", en: "Are these indices normal?" },
  ],
};

export const getSuggestedQuestions = (stageId, alertType = null) => {
  const key = alertType ? `${stageId}_${alertType}` : stageId;
  return (
    SUGGESTED_QUESTIONS[key] ||
    SUGGESTED_QUESTIONS[stageId] ||
    SUGGESTED_QUESTIONS["default"]
  );
};
