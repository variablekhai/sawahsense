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

const CONTEXT_FOLLOWUPS = {
  BLB_OUTBREAK: {
    disease: [
      {
        ms: "Bahagian mana saya perlu semak dulu untuk BLB?",
        en: "Which area should I inspect first for BLB?",
      },
      {
        ms: "Apa tindakan paling penting hari ini untuk BLB?",
        en: "What is the most important BLB action today?",
      },
      {
        ms: "Bila perlu hubungi pegawai pertanian?",
        en: "When should I contact the agriculture officer?",
      },
    ],
    water: [
      {
        ms: "Perlu asingkan aliran air sekarang?",
        en: "Should I separate water flow now?",
      },
      {
        ms: "Macam mana kawal air supaya penyakit tak cepat merebak?",
        en: "How do I manage water so the disease spreads slower?",
      },
      {
        ms: "Pintu air mana perlu saya tutup dulu?",
        en: "Which gate should I close first?",
      },
    ],
    task: [
      {
        ms: 'Boleh buat tugasan "Scouting & Semburan" sekarang?',
        en: 'Can you create a "Scouting & Spray" task now?',
      },
      {
        ms: "Apa checklist ringkas untuk pekerja ladang?",
        en: "What is a simple checklist for field workers?",
      },
      {
        ms: "Bila masa semakan seterusnya?",
        en: "When should the next follow-up check be?",
      },
    ],
  },
  LSWI_LOW: {
    water: [
      {
        ms: "Apa yang saya perlu semak dulu pada sistem air?",
        en: "What should I check first in the irrigation system?",
      },
      {
        ms: "Berapa lama nak tunggu sebelum semak semula bacaan air?",
        en: "How long should I wait before checking water again?",
      },
      {
        ms: "Macam mana pastikan air masuk sekata dalam petak ini?",
        en: "How can I make sure water flows evenly in this plot?",
      },
    ],
    task: [
      {
        ms: 'Boleh tambah tugasan "Pemeriksaan Pintu Air"?',
        en: 'Can you add a "Water Gate Inspection" task?',
      },
      {
        ms: "Apa kerja yang saya bagi pada pekerja dulu?",
        en: "What job should I assign to workers first?",
      },
      {
        ms: "Bila masa sesuai untuk semak semula?",
        en: "When is the right time to re-check?",
      },
    ],
  },
  EVI_LOW_NUTRIENT: {
    fertiliser: [
      {
        ms: "Baja apa yang perlu tambah dahulu?",
        en: "Which fertiliser should I add first?",
      },
      {
        ms: "Berapa kadar baja yang selamat untuk mula?",
        en: "What is a safe starter fertiliser rate?",
      },
      {
        ms: "Bila saya patut semak semula selepas pembajaan?",
        en: "When should I re-check after fertilising?",
      },
    ],
    task: [
      {
        ms: "Boleh buat tugasan semak rekod baja?",
        en: "Can you create a fertiliser record check task?",
      },
      {
        ms: "Apa tanda awal kalau baja masih tidak cukup?",
        en: "What early signs show fertiliser is still insufficient?",
      },
      {
        ms: "Perlu ambil gambar kawasan lemah untuk rujukan?",
        en: "Should I take photos of weak areas for tracking?",
      },
    ],
  },
};

const FLOW_BY_ALERT = {
  BLB_OUTBREAK: {
    first_step: [
      {
        ms: "Apa langkah pertama yang paling penting sekarang?",
        en: "What is the most important first step right now?",
      },
      {
        ms: "Kawasan mana perlu saya semak dulu?",
        en: "Which area should I inspect first?",
      },
      {
        ms: "Perlu asingkan aliran air sekarang?",
        en: "Should I separate water flow now?",
      },
    ],
    drilldown: [
      {
        ms: "Jika merebak, apa tindakan dalam 24 jam?",
        en: "If it spreads, what should I do in the next 24 hours?",
      },
      {
        ms: "Tanda apa yang perlu saya ambil gambar untuk bukti?",
        en: "What signs should I photograph as evidence?",
      },
      {
        ms: "Bila masa sesuai hubungi pegawai pertanian?",
        en: "When should I contact the agriculture officer?",
      },
    ],
    task_confirmation: [
      {
        ms: "Ya, buat tugasan Scouting & Semburan sekarang.",
        en: "Yes, create the Scouting & Spray task now.",
      },
      {
        ms: "Sebelum buat tugasan, bagi saya checklist ringkas.",
        en: "Before creating it, give me a short checklist.",
      },
      {
        ms: "Tetapkan semakan susulan dalam 2 hari.",
        en: "Set a follow-up check in 2 days.",
      },
    ],
    post_task: [
      {
        ms: "Bagus, apa 3 perkara pekerja perlu semak dahulu?",
        en: "Great, what are the first 3 checks for workers?",
      },
      {
        ms: "Bila saya perlu semak bacaan seterusnya?",
        en: "When should I review the next readings?",
      },
      {
        ms: "Apa tanda pemulihan awal yang saya patut tengok?",
        en: "What early recovery signs should I look for?",
      },
    ],
  },
  LSWI_LOW: {
    first_step: [
      {
        ms: "Apa semakan pertama pada pintu air sekarang?",
        en: "What is the first check on the water gate now?",
      },
      {
        ms: "Bahagian saluran mana biasanya tersumbat dulu?",
        en: "Which channel section is usually blocked first?",
      },
      {
        ms: "Perlu naikkan aliran air berapa lama dahulu?",
        en: "How long should I increase water flow first?",
      },
    ],
    drilldown: [
      {
        ms: "Jika air masih rendah, apa langkah kedua?",
        en: "If water remains low, what is the second step?",
      },
      {
        ms: "Bagaimana saya semak sama ada air sudah sekata?",
        en: "How do I confirm water is flowing evenly?",
      },
      {
        ms: "Bila masa paling sesuai semak semula bacaan?",
        en: "When is the best time to re-check readings?",
      },
    ],
    task_confirmation: [
      {
        ms: "Ya, tambah tugasan Pemeriksaan Pintu Air.",
        en: "Yes, add the Water Gate Inspection task.",
      },
      {
        ms: "Boleh pecahkan tugasan ikut pekerja?",
        en: "Can you split the task by workers?",
      },
      {
        ms: "Letak keutamaan tinggi untuk tugasan ini.",
        en: "Set this task as high priority.",
      },
    ],
    post_task: [
      {
        ms: "Apa bukti yang perlu pekerja laporkan selepas semakan?",
        en: "What evidence should workers report after inspection?",
      },
      {
        ms: "Jika bacaan pulih, apa langkah seterusnya?",
        en: "If readings recover, what is the next step?",
      },
      {
        ms: "Jika belum pulih, bila saya perlu eskalasi?",
        en: "If not recovered, when should I escalate?",
      },
    ],
  },
  EVI_LOW_NUTRIENT: {
    first_step: [
      {
        ms: "Baja apa saya perlu tambah dulu?",
        en: "Which fertiliser should I add first?",
      },
      {
        ms: "Kawasan mana perlu saya semak dulu untuk kekurangan baja?",
        en: "Which area should I inspect first for low nutrients?",
      },
      {
        ms: "Bila masa sesuai untuk pembajaan susulan?",
        en: "When is the right time for follow-up fertilising?",
      },
    ],
    drilldown: [
      {
        ms: "Jika pertumbuhan masih perlahan, apa pelarasan seterusnya?",
        en: "If growth is still slow, what adjustment comes next?",
      },
      {
        ms: "Berapa hari selepas baja perlu semak semula?",
        en: "How many days after fertilising should I re-check?",
      },
      {
        ms: "Apa tanda awal pertumbuhan mula pulih?",
        en: "What early signs show growth is recovering?",
      },
    ],
    task_confirmation: [
      {
        ms: "Ya, buat tugasan semak rekod baja.",
        en: "Yes, create the fertiliser record check task.",
      },
      {
        ms: "Tambah sekali tugasan pemerhatian 3 hari.",
        en: "Also add a 3-day monitoring task.",
      },
      {
        ms: "Buatkan checklist ringkas untuk pembajaan.",
        en: "Create a short fertilising checklist.",
      },
    ],
    post_task: [
      {
        ms: "Bagus, apa yang perlu dicatat selepas pembajaan?",
        en: "Great, what should be recorded after fertilising?",
      },
      {
        ms: "Bila bacaan dijangka mula naik semula?",
        en: "When should readings start to improve?",
      },
      {
        ms: "Jika tak naik, tindakan alternatif apa?",
        en: "If it does not improve, what is the fallback action?",
      },
    ],
  },
};

const detectTopic = (text = "") => {
  const q = text.toLowerCase();
  if (!q.trim()) return "general";
  if (
    q.includes("air") ||
    q.includes("water") ||
    q.includes("lswi") ||
    q.includes("irig") ||
    q.includes("pintu") ||
    q.includes("saluran")
  ) {
    return "water";
  }
  if (
    q.includes("blb") ||
    q.includes("penyakit") ||
    q.includes("disease") ||
    q.includes("daun") ||
    q.includes("lesion") ||
    q.includes("bacteria")
  ) {
    return "disease";
  }
  if (
    q.includes("baja") ||
    q.includes("fertil") ||
    q.includes("npk") ||
    q.includes("urea") ||
    q.includes("nutr")
  ) {
    return "fertiliser";
  }
  if (
    q.includes("tugas") ||
    q.includes("task") ||
    q.includes("checklist") ||
    q.includes("jadual") ||
    q.includes("schedule")
  ) {
    return "task";
  }
  return "general";
};

const detectFlowPhase = (lastUserMessage = "", lastAssistantMessage = "") => {
  const user = lastUserMessage.toLowerCase();
  const assistant = lastAssistantMessage.toLowerCase();
  const assistantAsksTask =
    assistant.includes("tugasan") ||
    assistant.includes("task") ||
    assistant.includes("mahu saya") ||
    assistant.includes("add") ||
    assistant.includes("tambahkan");
  const userConfirmed =
    user.includes("ya") ||
    user.includes("yes") ||
    user.includes("boleh") ||
    user.includes("nak") ||
    user.includes("setuju");

  if (assistantAsksTask && userConfirmed) return "post_task";
  if (assistantAsksTask) return "task_confirmation";
  if (!lastUserMessage.trim()) return "first_step";
  return "drilldown";
};

const getContextFollowups = (alertType, lastUserMessage = "") => {
  if (!alertType || !CONTEXT_FOLLOWUPS[alertType]) return [];
  const contextSet = CONTEXT_FOLLOWUPS[alertType];
  const topic = detectTopic(lastUserMessage);
  return contextSet[topic] || contextSet.task || contextSet.water || [];
};

const getFlowFollowups = (
  alertType,
  lastUserMessage = "",
  lastAssistantMessage = "",
) => {
  if (!alertType || !FLOW_BY_ALERT[alertType]) return [];
  const phase = detectFlowPhase(lastUserMessage, lastAssistantMessage);
  return FLOW_BY_ALERT[alertType][phase] || [];
};

export const getSuggestedQuestions = (
  stageId,
  alertType = null,
  lastUserMessage = "",
  lastAssistantMessage = "",
) => {
  const key = alertType ? `${stageId}_${alertType}` : stageId;
  const base =
    SUGGESTED_QUESTIONS[key] ||
    SUGGESTED_QUESTIONS[stageId] ||
    SUGGESTED_QUESTIONS.default;
  const flow = getFlowFollowups(
    alertType,
    lastUserMessage,
    lastAssistantMessage,
  );
  const context = getContextFollowups(alertType, lastUserMessage);

  // Priority: conversation flow -> context -> stage defaults.
  const merged = [...flow, ...context, ...base];
  const seen = new Set();
  const deduped = [];
  for (const item of merged) {
    const dedupeKey = `${item.ms}|${item.en}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    deduped.push(item);
    if (deduped.length >= 6) break;
  }
  return deduped;
};
