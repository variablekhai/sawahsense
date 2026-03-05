const DEMO_CITATIONS = {
  demo: "SawahSense Demo Data (Sekinchan fields f1-f6, Sep-Dec 2025)",
  bernasBlb: "BERNAS - Garis Panduan Kawalan BLB (rujukan amalan ladang)",
  iadaWater:
    "IADA Barat Laut Selangor - Manual Pengairan Tanaman Padi (SOP pintu air)",
  jpnAgronomy:
    "Jabatan Pertanian Malaysia - Amalan Agronomi Padi (jadual pembajaan & pemantauan)",
};

const FIELD_QNA = {
  f1: [
    {
      topic: "health",
      ms: "Keadaan Petak A sekarang macam mana?",
      en: "How is Petak A doing right now?",
      answerMs:
        "Petak A nampak stabil dan sihat. Corak NDVI/EVI konsisten, jadi pertumbuhan normal untuk peringkat semasa. Teruskan rutin semakan biasa setiap 3-5 hari.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.demo,
      answerEn:
        "Petak A looks stable and healthy. NDVI/EVI trend is consistent, so growth is normal for the current stage. Continue normal checks every 3-5 days.\n\n📚 References:\n- " +
        DEMO_CITATIONS.demo,
      intents: ["keadaan", "sihat", "normal", "how", "doing", "status"],
    },
    {
      topic: "harvest",
      ms: "Bila jangkaan sesuai untuk menuai Petak A?",
      en: "When is the expected harvest timing for Petak A?",
      answerMs:
        "Untuk data demo Petak A, jangkaan menuai sekitar hujung Nov hingga awal Dis 2025, ikut kematangan bulir di lapangan.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.demo,
      answerEn:
        "For demo data, expected harvest for Petak A is around late Nov to early Dec 2025, depending on grain maturity in field checks.\n\n📚 References:\n- " +
        DEMO_CITATIONS.demo,
      intents: ["tuai", "menuai", "harvest", "bila", "when"],
    },
    {
      topic: "action",
      ms: "Apa tindakan harian ringkas untuk kekalkan prestasi ni?",
      en: "What simple daily actions should I do to maintain this performance?",
      answerMs:
        "Fokus pada 3 perkara: (1) semak aliran air, (2) jalan cepat di tepi petak untuk lihat perubahan daun, (3) catat apa-apa perubahan ketara. Ini cukup untuk ladang yang sedang stabil.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.jpnAgronomy,
      answerEn:
        "Focus on 3 items: (1) check water flow, (2) quick walk along the plot edge for leaf changes, (3) record major changes. This is enough for a stable field.\n\n📚 References:\n- " +
        DEMO_CITATIONS.jpnAgronomy,
      intents: ["tindakan", "harian", "maintain", "daily", "action"],
    },
  ],
  f2: [
    {
      topic: "variety",
      ms: "Kenapa Petak B nampak sedikit rendah berbanding Petak A?",
      en: "Why does Petak B look slightly lower than Petak A?",
      answerMs:
        "Dalam demo, Petak B guna varieti berbeza dan masih dalam julat selamat. Perbezaan kecil ini normal jika trend keseluruhan stabil.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.demo,
      answerEn:
        "In the demo, Petak B uses a different variety and is still within a safe range. Small differences are normal when the overall trend stays stable.\n\n📚 References:\n- " +
        DEMO_CITATIONS.demo,
      intents: ["kenapa", "rendah", "varieti", "why", "lower", "variety"],
    },
    {
      topic: "risk",
      ms: "Perlu risau tak dengan bacaan Petak B sekarang?",
      en: "Should I worry about Petak B readings now?",
      answerMs:
        "Buat masa ini tidak kritikal. Teruskan pemantauan rutin, dan fokus pada perubahan mendadak, bukan perbezaan kecil.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.demo,
      answerEn:
        "At this point, it is not critical. Continue routine monitoring and focus on sudden drops rather than small differences.\n\n📚 References:\n- " +
        DEMO_CITATIONS.demo,
      intents: ["risau", "worry", "kritikal", "risk"],
    },
    {
      topic: "action",
      ms: "Apa semakan paling penting minggu ini untuk Petak B?",
      en: "What is the most important check this week for Petak B?",
      answerMs:
        "Semak keseragaman warna daun dan aliran air hujung-ke-hujung petak. Jika ada zon pucat yang bertambah, baru naikkan tindakan.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.jpnAgronomy,
      answerEn:
        "Check leaf color uniformity and end-to-end water flow. If pale zones expand, then escalate actions.\n\n📚 References:\n- " +
        DEMO_CITATIONS.jpnAgronomy,
      intents: ["semakan", "check", "minggu", "week"],
    },
  ],
  f3: [
    {
      topic: "first_step",
      ms: "Apa langkah pertama untuk isu BLB di Petak C?",
      en: "What is the first step for BLB in Petak C?",
      answerMs:
        "Langkah pertama: semak sudut tenggara dulu (kawasan mula masalah), kemudian asingkan aliran air jika boleh. Buat pemerhatian cepat pada baris berdekatan.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.demo +
        "\n- " +
        DEMO_CITATIONS.bernasBlb,
      answerEn:
        "First step: inspect the southeast corner first (where the issue started), then isolate water flow if possible. Do a quick check on nearby rows.\n\n📚 References:\n- " +
        DEMO_CITATIONS.demo +
        "\n- " +
        DEMO_CITATIONS.bernasBlb,
      intents: ["blb", "langkah", "first", "step", "penyakit"],
    },
    {
      topic: "spread",
      ms: "Bagaimana nak elak BLB merebak cepat?",
      en: "How do I slow BLB spread?",
      answerMs:
        "Kurangkan perkongsian aliran air antara petak, kurangkan aktiviti dari kawasan sakit ke kawasan sihat, dan rekod kawasan terjejas setiap lawatan.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.bernasBlb,
      answerEn:
        "Reduce shared water flow across plots, avoid moving from infected to healthy zones, and record affected areas each visit.\n\n📚 References:\n- " +
        DEMO_CITATIONS.bernasBlb,
      intents: ["merebak", "spread", "elak", "slow"],
    },
    {
      topic: "task",
      ms: "Boleh bagi checklist scouting untuk Petak C?",
      en: "Can you give me a scouting checklist for Petak C?",
      answerMs:
        "Checklist ringkas:\n1. Semak sudut tenggara.\n2. Ambil 3-5 gambar daun terjejas.\n3. Tanda kawasan teruk pada peta ladang.\n4. Lapor jika kawasan kuning bertambah.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.bernasBlb,
      answerEn:
        "Quick checklist:\n1. Inspect southeast corner.\n2. Take 3-5 photos of affected leaves.\n3. Mark severe zones on field map.\n4. Report if yellow area expands.\n\n📚 References:\n- " +
        DEMO_CITATIONS.bernasBlb,
      intents: ["checklist", "scouting", "tugasan", "task"],
    },
  ],
  f4: [
    {
      topic: "first_step",
      ms: "Air rendah di Petak D, apa perlu buat dulu?",
      en: "Water is low in Petak D, what should I do first?",
      answerMs:
        "Semak pintu air utama dan saluran masuk dahulu. Pastikan tiada sumbatan sebelum ubah aliran air.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.demo +
        "\n- " +
        DEMO_CITATIONS.iadaWater,
      answerEn:
        "Check the main water gate and inlet channel first. Confirm there is no blockage before adjusting flow.\n\n📚 References:\n- " +
        DEMO_CITATIONS.demo +
        "\n- " +
        DEMO_CITATIONS.iadaWater,
      intents: ["air", "lswi", "water", "low", "pintu", "saluran"],
    },
    {
      topic: "verification",
      ms: "Macam mana nak tahu aliran air dah pulih?",
      en: "How do I confirm water flow has recovered?",
      answerMs:
        "Buat semakan semula selepas 1-2 hari: aliran masuk lebih lancar, kawasan kering tidak bertambah, dan bacaan seterusnya tidak terus jatuh.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.iadaWater,
      answerEn:
        "Re-check after 1-2 days: inlet flow is smoother, dry patches are not expanding, and next readings stop dropping.\n\n📚 References:\n- " +
        DEMO_CITATIONS.iadaWater,
      intents: ["pulih", "recover", "confirm", "semak semula", "recheck"],
    },
    {
      topic: "task",
      ms: "Boleh buat tugasan pemeriksaan pintu air untuk Petak D?",
      en: "Can you create a water-gate inspection task for Petak D?",
      answerMs:
        "Boleh. Tugasan sesuai: pemeriksaan pintu air, buang halangan, dan semakan susulan dalam 48 jam.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.iadaWater,
      answerEn:
        "Yes. Recommended task: inspect water gate, clear blockages, and run a 48-hour follow-up check.\n\n📚 References:\n- " +
        DEMO_CITATIONS.iadaWater,
      intents: ["tugasan", "task", "pemeriksaan", "inspection"],
    },
  ],
  f5: [
    {
      topic: "health",
      ms: "Petak E nampak baik, apa yang perlu teruskan?",
      en: "Petak E looks good, what should I continue doing?",
      answerMs:
        "Teruskan rutin yang sama: semakan air berkala, pemantauan visual ringkas, dan catatan perubahan. Corak demo Petak E menunjukkan pengurusan konsisten memberi hasil stabil.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.demo +
        "\n- " +
        DEMO_CITATIONS.jpnAgronomy,
      answerEn:
        "Keep the same routine: regular water checks, quick visual monitoring, and recording changes. Demo trend for Petak E shows stable output from consistent management.\n\n📚 References:\n- " +
        DEMO_CITATIONS.demo +
        "\n- " +
        DEMO_CITATIONS.jpnAgronomy,
      intents: ["baik", "good", "continue", "teruskan"],
    },
    {
      topic: "risk",
      ms: "Risiko utama Petak E pada fasa ni apa?",
      en: "What is the main risk for Petak E at this phase?",
      answerMs:
        "Risiko utama ialah perubahan mendadak air atau serangan setempat yang lambat dikesan. Jadi fokus pada pengesanan awal perubahan kecil.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.jpnAgronomy,
      answerEn:
        "Main risk is sudden water change or localized issues detected too late. Focus on early detection of small changes.\n\n📚 References:\n- " +
        DEMO_CITATIONS.jpnAgronomy,
      intents: ["risiko", "risk", "fasa", "phase"],
    },
  ],
  f6: [
    {
      topic: "nutrient",
      ms: "Petak F kekurangan baja, apa tindakan cepat?",
      en: "Petak F has low nutrients, what is the quick action?",
      answerMs:
        "Semak rekod pembajaan terakhir, tambah pembajaan susulan ikut kadar selamat, kemudian buat semakan semula dalam 7-10 hari.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.demo +
        "\n- " +
        DEMO_CITATIONS.jpnAgronomy,
      answerEn:
        "Check latest fertiliser records, apply follow-up fertiliser at safe rate, then re-check in 7-10 days.\n\n📚 References:\n- " +
        DEMO_CITATIONS.demo +
        "\n- " +
        DEMO_CITATIONS.jpnAgronomy,
      intents: ["baja", "nutrient", "fertiliser", "quick", "tindakan"],
    },
    {
      topic: "recovery",
      ms: "Macam mana nak tahu Petak F dah pulih?",
      en: "How do I know Petak F has recovered?",
      answerMs:
        "Tanda pulih: warna daun lebih sekata, pertumbuhan tidak lagi perlahan, dan bacaan siri masa kembali ikut trend ladang sihat.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.demo,
      answerEn:
        "Recovery signs: leaf color becomes more uniform, growth is no longer lagging, and time-series readings return toward healthy trend.\n\n📚 References:\n- " +
        DEMO_CITATIONS.demo,
      intents: ["pulih", "recover", "recovery", "tahu", "know"],
    },
    {
      topic: "task",
      ms: "Boleh buat tugasan semak rekod baja untuk Petak F?",
      en: "Can you create a fertiliser record check task for Petak F?",
      answerMs:
        "Boleh. Tugasan sesuai: semak rekod baja, sahkan kadar aplikasi, dan buat semakan susulan selepas 1 minggu.\n\n📚 Rujukan:\n- " +
        DEMO_CITATIONS.jpnAgronomy,
      answerEn:
        "Yes. Suitable task: review fertiliser records, confirm application rate, and schedule follow-up after 1 week.\n\n📚 References:\n- " +
        DEMO_CITATIONS.jpnAgronomy,
      intents: ["task", "tugasan", "rekod", "baja", "record"],
    },
  ],
};

const normalize = (s = "") => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");

const detectLang = (userMessage = "") => {
  const q = userMessage.toLowerCase();
  const enHints = ["what", "how", "when", "can you", "please", "why"];
  return enHints.some((w) => q.includes(w)) ? "en" : "ms";
};

export function getDemoQuestionsForField(fieldId) {
  return FIELD_QNA[fieldId] || [];
}

export function getDemoSuggestedQuestionsForField(
  fieldId,
  lastUserMessage = "",
  askedMessages = [],
  limit = 6,
) {
  const all = getDemoQuestionsForField(fieldId);
  if (!all.length) return [];

  const asked = askedMessages.map((m) => normalize(m)).filter(Boolean);
  const topicHint = normalize(lastUserMessage);

  const scored = all
    .map((item) => {
      let score = 0;
      if (
        topicHint &&
        (item.intents || []).some((k) => topicHint.includes(normalize(k)))
      ) {
        score += 3;
      }
      const msNorm = normalize(item.ms);
      const enNorm = normalize(item.en);
      if (asked.some((a) => a.includes(msNorm) || a.includes(enNorm))) {
        score -= 2;
      }
      return { item, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ item }) => ({ ms: item.ms, en: item.en }));
}

export function getDemoAnswerForField(fieldId, userMessage = "") {
  const qna = getDemoQuestionsForField(fieldId);
  if (!qna.length) return null;
  const lang = detectLang(userMessage);
  const norm = normalize(userMessage);

  // Let task-confirmation/chat-control messages be handled by existing flow.
  const controlWords = [
    "ya",
    "yes",
    "boleh",
    "nak",
    "mahu",
    "mau",
    "setuju",
    "ok",
    "okay",
    "buat tugasan",
    "create task",
  ];
  if (controlWords.some((w) => norm.includes(normalize(w)))) {
    return null;
  }

  const inquiryHints = [
    "?",
    "apa",
    "bagaimana",
    "kenapa",
    "bila",
    "perlu",
    "macam mana",
    "what",
    "how",
    "why",
    "when",
    "should",
    "can you",
  ];
  const looksLikeQuestion = inquiryHints.some((h) =>
    userMessage.toLowerCase().includes(h),
  );
  if (!looksLikeQuestion) return null;

  // 1) Exact-ish question match against scripted Q strings.
  const direct = qna.find((item) => {
    const msNorm = normalize(item.ms);
    const enNorm = normalize(item.en);
    return norm.includes(msNorm) || norm.includes(enNorm);
  });
  if (direct) return lang === "en" ? direct.answerEn : direct.answerMs;

  // 2) Intent keyword match.
  let best = null;
  let bestScore = 0;
  for (const item of qna) {
    const score = (item.intents || []).reduce(
      (acc, kw) => (norm.includes(normalize(kw)) ? acc + 1 : acc),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  if (best && bestScore > 0) return lang === "en" ? best.answerEn : best.answerMs;

  // 3) Field default fallback.
  const fallback = qna[0];
  return lang === "en"
    ? `${fallback.answerEn}\n\nIf you want, ask me about first step, risk, or next task for this field.`
    : `${fallback.answerMs}\n\nJika mahu, tanya saya tentang langkah pertama, risiko, atau tugasan seterusnya untuk petak ini.`;
}
