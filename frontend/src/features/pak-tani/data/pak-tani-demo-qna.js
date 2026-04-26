/**
 * Pak Tani Demo Q&A
 * Scripted conversations for the six Sekinchan demo fields.
 * Answers are bilingual (ms/en) with RAG-style source citations,
 * and include contextual follow-up suggestions per topic.
 */

const FIELD_QNA = {
  // ─── F1: Petak A — Healthy benchmark, MR297, D+62 ────────────────────────
  f1: [
    {
      topic: "health",
      ms: "Keadaan Petak A macam mana sekarang?",
      en: "How is Petak A doing right now?",
      answerMs:
        "Petak A dalam keadaan baik. NDVI 0.80 dan EVI 0.73 — tepat pada sasaran untuk MR297 di Hari 62, peringkat awal pembungaan. LSWI 0.27 tunjuk keseimbangan air yang sihat. Jangkaan tuai lebih kurang hujung November, 25–30 hari lagi. Tak perlu ubah apa-apa — teruskan jadual air semasa dan semak visual setiap 3–4 hari.\n\n**Sumber**\n· DOA Malaysia — Profil Varieti MR297 (Siraj) & Kalendar Tanaman (2022)\n· IADA Barat Laut Selangor — Laporan Ladang Sekinchan S2/2025",
      answerEn:
        "Petak A is looking strong. NDVI 0.80 and EVI 0.73 are right on target for MR297 at Day 62 — early heading, tracking well. LSWI 0.27 confirms healthy water balance. Harvest window should open around late November, roughly 25–30 days out. No changes needed — maintain your current water schedule and do a quick visual check every 3–4 days.\n\n**Sources**\n· DOA Malaysia — MR297 (Siraj) Variety Profile & Crop Calendar (2022)\n· IADA Barat Laut Selangor — Sekinchan Field Records S2/2025",
      intents: ["keadaan", "sihat", "macam mana", "how", "doing", "status", "okay", "baik"],
      followups: [
        { ms: "Bila jangkaan menuai untuk Petak A?", en: "When is harvest expected for Petak A?" },
        { ms: "Apa risiko utama pada peringkat pembungaan ni?", en: "What's the main risk at this heading stage?" },
      ],
    },
    {
      topic: "harvest",
      ms: "Bila jangkaan menuai untuk Petak A?",
      en: "When is harvest expected for Petak A?",
      answerMs:
        "MR297 di Hari 62 baru masuk pengisian butir. Dalam keadaan Sekinchan biasa, kematangan tuai jatuh sekitar Hari 90–95 — lebih kurang hujung November hingga awal Disember. Tanda untuk mula tuai: 80–85% malai dah keemasan dan kandungan lembapan butir di bawah 24%. Tuai lebih awal memberi hasil kilang yang lebih baik berbanding tunggu terlalu lama.\n\n**Sumber**\n· DOA Malaysia — Panduan Tuaian: Masa Optimum & Pengurusan Pasca Tuai (2022)\n· MARDI — Kajian Indeks Kematangan Padi Varieti Tinggi Hasil (2021)",
      answerEn:
        "MR297 at Day 62 is just entering grain fill now. In normal Sekinchan conditions, harvest maturity falls around Day 90–95 — roughly late November to early December. Signal to harvest: 80–85% of panicles turned golden-yellow and grain moisture below 24%. Harvesting on time gives better milling recovery than waiting too long.\n\n**Sources**\n· DOA Malaysia — Harvesting Guide: Optimal Timing & Post-Harvest Management (2022)\n· MARDI — Grain Maturity Index Study for High-Yield Paddy Varieties (2021)",
      intents: ["tuai", "menuai", "harvest", "bila", "when", "masa"],
      followups: [
        { ms: "Apa tanda padi dah sedia untuk dituai?", en: "What are the signs paddy is ready to harvest?" },
        { ms: "Apa risiko kalau tuai lambat?", en: "What's the risk of harvesting too late?" },
      ],
    },
    {
      topic: "risk",
      ms: "Apa risiko utama pada peringkat pembungaan ni?",
      en: "What's the main risk at this heading stage?",
      answerMs:
        "Risiko utama sekarang ialah serangan blast lewat musim, terutama bila kelembapan malam melebihi 85%. NDVI dan EVI masih stabil — tiada tanda sekarang. Tapi kalau ramalan cuaca tunjuk malam sejuk bawah 24°C dengan pagi berembun, satu semburan fungisida pencegahan (trisiklazol, 0.6 kg/ha) berbaloi. Jangan semburan kalau tiada tanda — semburan tak perlu pada peringkat ini boleh stres malai.\n\n**Sumber**\n· DOA Malaysia — Pengurusan Penyakit Blast Padi: Panduan IPM (2023)\n· MARDI — Kerentanan Blast pada MR297 di Kawasan Pantai Selangor (2022)",
      answerEn:
        "Main risk now is late-season blast, especially when overnight humidity stays above 85%. NDVI and EVI are still stable — no current sign. But if the forecast shows cool nights below 24°C with misty mornings, one preventive fungicide spray (tricyclazole, 0.6 kg/ha) is worth it. Don't spray without cause — unnecessary spraying at this stage can stress the panicles.\n\n**Sources**\n· DOA Malaysia — Rice Blast Disease Management: IPM Guide (2023)\n· MARDI — Blast Susceptibility in MR297 under Coastal Selangor Conditions (2022)",
      intents: ["risiko", "risk", "blast", "penyakit", "ancaman", "bahaya"],
      followups: [
        { ms: "Macam mana nak kenal penyakit blast awal?", en: "How do I spot blast disease early?" },
        { ms: "Berapa kerap perlu semak ladang ni sekarang?", en: "How often should I check this field now?" },
      ],
    },
  ],

  // ─── F2: Petak B — Healthy, MR269, D+60 ──────────────────────────────────
  f2: [
    {
      topic: "variety",
      ms: "Kenapa bacaan Petak B lebih rendah dari Petak A?",
      en: "Why are Petak B's readings lower than Petak A?",
      answerMs:
        "Ini normal — bukan masalah. MR269 secara semula jadi ada ketumpatan klorofil kanopi yang lebih rendah dari MR297. EVI boleh beza 5–8% antara varieti dalam keadaan yang sama, disebabkan perbezaan seni bina daun. SawahSense jejak setiap varieti ikut asas sendiri supaya kita tak bagi amaran palsu. Petak B di 0.67 EVI adalah tepat di mana MR269 patut berada untuk Hari 60.\n\n**Sumber**\n· DOA Malaysia — Profil Varieti MR269 & Perbezaan Morfologi Daun (2022)\n· MARDI — Kalibrasi Indeks Spektral Mengikut Varieti Padi Malaysia (2023)",
      answerEn:
        "This is normal — not a problem. MR269 naturally has a slightly lower canopy chlorophyll density than MR297. EVI can differ by 5–8% between varieties under identical conditions due to leaf architecture differences. SawahSense calibrates each variety against its own baseline to avoid false alerts. Petak B at 0.67 EVI is exactly where MR269 should be for Day 60.\n\n**Sources**\n· DOA Malaysia — MR269 Variety Profile & Leaf Morphology Differences (2022)\n· MARDI — Spectral Index Calibration by Malaysian Paddy Variety (2023)",
      intents: ["kenapa", "rendah", "varieti", "why", "lower", "variety", "beza", "difference"],
      followups: [
        { ms: "Petak B perlu diberi perhatian khas tak?", en: "Does Petak B need any special attention?" },
      ],
    },
    {
      topic: "risk",
      ms: "Petak B perlu diberi perhatian khas tak?",
      en: "Does Petak B need any special attention?",
      answerMs:
        "Tidak buat masa ini. Trend Petak B stabil dan dalam julat normal MR269 untuk Hari 60. Kalau nak fokus hari ini, Petak C perlukan perhatian segera — situasi BLB di sana aktif dan masa adalah penting.\n\n**Sumber**\n· IADA Barat Laut Selangor — Laporan Ladang Sekinchan S2/2025\n· DOA Malaysia — Protokol Pemantauan Ladang Padi Sihat (2022)",
      answerEn:
        "No, not right now. Petak B's trend is stable and within MR269's expected range for Day 60. If you're prioritising today, Petak C needs urgent attention — the BLB situation there is active and time matters.\n\n**Sources**\n· IADA Barat Laut Selangor — Sekinchan Field Records S2/2025\n· DOA Malaysia — Healthy Paddy Field Monitoring Protocol (2022)",
      intents: ["perhatian", "attention", "risau", "worry", "check", "semak", "khas"],
      followups: [
        { ms: "Bila masa perlu risau tentang Petak B?", en: "When should I start worrying about Petak B?" },
      ],
    },
  ],

  // ─── F3: Petak C — Critical, BLB outbreak, D+62 ──────────────────────────
  f3: [
    {
      topic: "blb_action",
      ms: "Apa yang perlu saya buat untuk amaran BLB di Petak C?",
      en: "What should I do about the BLB alert in Petak C?",
      answerMs:
        "Ambil tindakan hari ini — jangan tangguh. BLB (Hawar Daun Bakteria) merebak melalui air, dan sudut tenggara berhampiran salur masuk irigasi adalah titik mula. Tiga langkah segera:\n\n1. Tutup sementara pintu air yang dikongsi dengan petak jiran.\n2. Jalan di baris sudut tenggara — cari kekuningan di pinggir daun (bukan hujung daun — pinggir).\n3. Kalau jangkitan dah lebih 3 baris dalam, hubungi pegawai sambungan IADA BLS anda dan atur semburan bakterisid berasaskan kuprum (hidroksid kuprum, 0.2%).\n\nNDVI jatuh 22% dari sudut tersebut dalam 15 hari. Wabak BLB Sekinchan 2016 bermula dengan corak yang sama — kelewatan tindakan menyebabkan kerugian hasil 50–70%.\n\n**Sumber**\n· DOA Malaysia — Kawalan Hawar Daun Bakteria (BLB) dalam Penanaman Padi (2023)\n· IADA Barat Laut Selangor — Laporan Wabak BLB Sekinchan, Musim 2/2016\n· BERNAS — Garis Panduan Amalan Baik Kawalan BLB di Ladang Padi",
      answerEn:
        "Act today — don't wait. BLB (Bacterial Leaf Blight) spreads through water, and the southeast corner near your irrigation inlet is the origin point. Three immediate steps:\n\n1. Temporarily close the shared water gate with adjacent plots.\n2. Walk the southeast rows — look for water-soaked yellowing at leaf margins (not leaf tips — margins).\n3. If infection is beyond 3 rows deep, contact your IADA BLS extension officer and arrange copper-based bactericide (copper hydroxide, 0.2% solution).\n\nNDVI dropped 22% from that corner in 15 days. The 2016 Sekinchan BLB season started identically — delayed action led to 50–70% yield loss.\n\n**Sources**\n· DOA Malaysia — Bacterial Leaf Blight (BLB) Control in Paddy Cultivation (2023)\n· IADA Barat Laut Selangor — Sekinchan BLB Outbreak Report, Season 2/2016\n· BERNAS — Good Practice Guidelines for BLB Management in Paddy Fields",
      intents: ["blb", "amaran", "alert", "tindakan", "action", "penyakit", "disease", "apa", "what", "langkah", "step", "buat", "do", "selesai"],
      followups: [
        { ms: "Macam mana nak elak BLB merebak lebih jauh?", en: "How do I stop BLB from spreading further?" },
        { ms: "Berapa banyak hasil yang saya mungkin rugi?", en: "How much yield could I lose?" },
        { ms: "Boleh buat tugasan scouting untuk Petak C?", en: "Can you create a scouting task for Petak C?" },
      ],
    },
    {
      topic: "blb_spread",
      ms: "Macam mana nak elak BLB merebak lebih jauh?",
      en: "How do I stop BLB from spreading further?",
      answerMs:
        "Pengurusan air adalah senjata utama anda. Bakteria BLB bergerak dalam aliran irigasi dari pokok ke pokok. Langkah kawalan merebak:\n\n- Asingkan salur masuk air — kurangkan perkongsian aliran antara kawasan jangkitan dan kawasan sihat.\n- Toscang sebahagian air di petak untuk kurangkan pergerakan air antara baris.\n- Elak bekerja di kawasan jangkitan kemudian bergerak ke kawasan sihat tanpa membasuh kasut dan peralatan.\n- Kalau menyembur bakterisid, buat pada waktu pagi semasa kelembapan rendah untuk penyerapan daun yang lebih baik.\n\nSemak sempadan antara kawasan jangkitan dan sihat setiap 2 hari — ukur berapa baris tambahan menunjukkan kekuningan. Kemajuan 2–3 baris seminggu bermakna merebak agresif.\n\n**Sumber**\n· DOA Malaysia — Kawalan Hawar Daun Bakteria (BLB) dalam Penanaman Padi (2023)\n· IADA Barat Laut Selangor — SOP Pengurusan Air Semasa Wabak Penyakit (2021)",
      answerEn:
        "Water management is your main tool. BLB bacteria move in the irrigation stream from plant to plant. Steps to slow the spread:\n\n- Isolate the water inlet — reduce shared flow between infected and healthy zones.\n- Partially drain the plot to reduce water movement between rows.\n- Avoid working in infected areas and then moving to healthy sections without washing footwear and equipment.\n- If spraying bactericide, apply in the morning when humidity is lower for better leaf absorption.\n\nCheck the boundary between infected and healthy plants every 2 days — measure how many additional rows show yellowing. A 2–3 row advance per week means aggressive spread.\n\n**Sources**\n· DOA Malaysia — Bacterial Leaf Blight (BLB) Control in Paddy Cultivation (2023)\n· IADA Barat Laut Selangor — Water Management SOP during Disease Outbreaks (2021)",
      intents: ["elak", "prevent", "spread", "merebak", "kawalan", "control", "kurangkan", "stop"],
      followups: [
        { ms: "Berapa banyak hasil yang saya mungkin rugi?", en: "How much yield could I lose?" },
        { ms: "Boleh buat tugasan scouting untuk Petak C?", en: "Can you create a scouting task for Petak C?" },
      ],
    },
    {
      topic: "blb_yield",
      ms: "Berapa banyak hasil yang saya mungkin rugi?",
      en: "How much yield could I lose?",
      answerMs:
        "Pada 35% petak terjejas hari ini, tindakan dalam 72 jam boleh hadkan kerugian kepada lebih kurang 20–25%. Untuk petak 3.1 ha dengan sasaran hasil MR297 10 tan/ha, itu bermakna lebih kurang 7–9 tan boleh diselamatkan berbanding tiada tindakan. Kalau merebak tidak dibendung, rekod wabak BLB Sekinchan 2016 — varieti sama, keadaan sama — tunjuk kerugian 50–70% apabila tindakan lewat lebih dari 2 minggu. Tetingkap tindakan anda adalah sekarang.\n\n**Sumber**\n· IADA Barat Laut Selangor — Laporan Wabak BLB Sekinchan, Musim 2/2016\n· MARDI — Anggaran Kehilangan Hasil Akibat BLB mengikut Tahap Jangkitan (2020)",
      answerEn:
        "At 35% of the field affected today, acting within 72 hours can limit losses to around 20–25%. For a 3.1 ha plot targeting MR297's 10 t/ha yield, that means roughly 7–9 tonnes can be saved versus no action. If spread is not contained, the 2016 Sekinchan BLB outbreak records — same variety, same conditions — showed 50–70% total loss when action was delayed past the 2-week mark. Your action window is now.\n\n**Sources**\n· IADA Barat Laut Selangor — Sekinchan BLB Outbreak Report, Season 2/2016\n· MARDI — Yield Loss Estimation from BLB by Infection Severity Level (2020)",
      intents: ["rugi", "kerugian", "hasil", "yield", "loss", "berapa", "how much", "percent", "peratus"],
      followups: [
        { ms: "Boleh buat tugasan scouting untuk Petak C?", en: "Can you create a scouting task for Petak C?" },
      ],
    },
  ],

  // ─── F4: Petak D — Warning, water stress at heading, D+62 ────────────────
  f4: [
    {
      topic: "lswi_explanation",
      ms: "Petak D nampak hijau — kenapa ada amaran?",
      en: "Petak D looks green — why is there a warning?",
      answerMs:
        "Itulah perangkapnya. NDVI 0.76 dan EVI 0.69 — daun masih penuh hijau. Tapi LSWI jatuh dari 0.30 ke 0.18 dalam masa 5 hari. LSWI baca kandungan air sebenar dalam tisu pokok, bukan sekadar warna daun. Pada masa NDVI mula jatuh akibat tekanan air, 60–70% kerosakan pada pengisian butir sudah berlaku. Anda sekarang di peringkat pembungaan — tetingkap 2 minggu paling kritikal untuk bekalan air. Semak saluran masuk hari ini.\n\n**Sumber**\n· MARDI — Pemantauan Tekanan Air Padi melalui Indeks LSWI Sentinel-2 (2024)\n· DOA Malaysia — Keperluan Air pada Peringkat Pembungaan MR297 (2022)\n· IADA Barat Laut Selangor — Manual Pengairan Padi: SOP Pengurusan Pintu Air (2021)",
      answerEn:
        "That's exactly the trap. NDVI at 0.76 and EVI at 0.69 — leaves are still full green. But LSWI dropped from 0.30 to 0.18 in just 5 days. LSWI reads the actual water content inside the plant tissue, not just the leaf color. By the time NDVI starts dropping from water stress, 60–70% of the damage to grain fill is already done. You're at heading stage right now — the most critical 2-week window for water supply. Check the inlet channel today.\n\n**Sources**\n· MARDI — Water Stress Monitoring in Paddy via Sentinel-2 LSWI Index (2024)\n· DOA Malaysia — Water Requirements at MR297 Heading Stage (2022)\n· IADA Barat Laut Selangor — Paddy Irrigation Manual: Water Gate SOP (2021)",
      intents: ["kenapa", "why", "amaran", "alert", "warning", "hijau", "green", "lswi", "air", "water", "nampak", "looks"],
      followups: [
        { ms: "Apa yang perlu saya semak di pintu air?", en: "What should I check at the water gate?" },
        { ms: "Berapa banyak hasil yang akan terjejas?", en: "How much yield could be affected?" },
      ],
    },
    {
      topic: "water_gate",
      ms: "Apa yang perlu saya semak di pintu air?",
      en: "What should I check at the water gate?",
      answerMs:
        "Tiga perkara, mengikut urutan:\n\n1. **Kedudukan pintu** — sahkan pintu masuk dibuka penuh. Tuas boleh teranjak.\n2. **Mulut saluran** — buang sisa terapung, rumput kering, atau buluh yang mungkin menyekat separa aliran. Ini punca sekatan paling biasa semasa musim kering Sekinchan.\n3. **Jalan sepanjang saluran** dari pintu ke sempadan petak — cari retakan tanah atau keruntuhan bahagian manapun.\n\nBersihkan sekatan dan beri 24–48 jam, kemudian semak bacaan LSWI seterusnya. Sasaran: LSWI naik semula ke atas 0.22 dalam masa seminggu.\n\n**Sumber**\n· IADA Barat Laut Selangor — Manual Pengairan Padi: SOP Pengurusan Pintu Air (2021)\n· DOA Malaysia — Panduan Pemeriksaan & Penyelenggaraan Sistem Irigasi Ladang (2022)",
      answerEn:
        "Three things, in order:\n\n1. **Gate position** — confirm the inlet gate is fully open. The lever can drift.\n2. **Channel mouth** — clear any floating debris, dry grass, or bamboo that may be partially blocking flow. This is the most common blockage cause during Sekinchan's dry spells.\n3. **Walk the channel** from the gate to the field boundary — look for soil cracks or any collapsed sections.\n\nClear the blockage and give it 24–48 hours, then check the next LSWI reading. Target: LSWI recovering back above 0.22 within a week.\n\n**Sources**\n· IADA Barat Laut Selangor — Paddy Irrigation Manual: Water Gate SOP (2021)\n· DOA Malaysia — Field Irrigation System Inspection & Maintenance Guide (2022)",
      intents: ["pintu", "gate", "semak", "check", "saluran", "channel", "air", "water", "inspect", "buat", "do"],
      followups: [
        { ms: "Macam mana nak tahu aliran air dah pulih?", en: "How do I know when water flow has recovered?" },
        { ms: "Boleh buat tugasan pemeriksaan pintu air?", en: "Can you create a water gate inspection task?" },
      ],
    },
    {
      topic: "water_recovery",
      ms: "Macam mana nak tahu aliran air dah pulih?",
      en: "How do I know when water flow has recovered?",
      answerMs:
        "Tiga tanda pemulihan: (1) aliran masuk lebih lancar dan sekata bila tengok, (2) kawasan kering atau tanah rekah di bawah air tidak bertambah, (3) bacaan LSWI berhenti jatuh dan mula naik semula dalam 48–72 jam. Kalau LSWI masih jatuh selepas anda bersihkan sekatan yang dijumpai, ada isu lain — mungkin kebocoran di bahagian lain saluran atau masalah pengagihan dari atas.\n\n**Sumber**\n· IADA Barat Laut Selangor — Manual Pengairan Padi: SOP Pengurusan Pintu Air (2021)\n· MARDI — Pemantauan Tekanan Air Padi melalui Indeks LSWI Sentinel-2 (2024)",
      answerEn:
        "Three recovery signs: (1) inlet flow is visibly smoother and more even, (2) dry patches or cracked soil under water are not expanding, (3) LSWI readings stop dropping and start rising within 48–72 hours. If LSWI continues falling after you've cleared what you found, there's another issue — possibly a leak elsewhere in the channel or an upstream distribution problem.\n\n**Sources**\n· IADA Barat Laut Selangor — Paddy Irrigation Manual: Water Gate SOP (2021)\n· MARDI — Water Stress Monitoring in Paddy via Sentinel-2 LSWI Index (2024)",
      intents: ["pulih", "recover", "tahu", "know", "confirm", "semak semula", "recheck", "balik"],
      followups: [
        { ms: "Berapa banyak hasil yang akan terjejas?", en: "How much yield could be affected?" },
        { ms: "Boleh buat tugasan pemeriksaan pintu air?", en: "Can you create a water gate inspection task?" },
      ],
    },
    {
      topic: "water_yield",
      ms: "Berapa banyak hasil yang akan terjejas?",
      en: "How much yield could be affected?",
      answerMs:
        "Tekanan air semasa peringkat pembungaan kurangkan kesuburan spikelet secara langsung. Pada LSWI 0.18 yang berterusan lebih dari 5–7 hari, jangkakan 15–25% spikelet mandul. Untuk petak 2.5 ha dengan sasaran hasil MR297 10 tan/ha, itu lebih kurang 3.5–6 tan kerugian potensi. Bertindak sebelum Hari 67 — lebih kurang tetingkap tampan anda sebelum tetapan butir terkunci dan kerosakan jadi kekal.\n\n**Sumber**\n· DOA Malaysia — Keperluan Air pada Peringkat Pembungaan MR297 (2022)\n· MARDI — Impak Tekanan Air terhadap Kesuburan Spikelet Padi Tropika (2023)",
      answerEn:
        "Water stress during heading reduces spikelet fertility directly. At LSWI 0.18 sustained for more than 5–7 days, expect 15–25% sterile spikelets. For a 2.5 ha field targeting MR297's 10 t/ha, that's roughly 3.5–6 tonnes of potential loss. Act before Day 67 — that's approximately your buffer window before grain set locks in and the damage becomes permanent.\n\n**Sources**\n· DOA Malaysia — Water Requirements at MR297 Heading Stage (2022)\n· MARDI — Water Stress Impact on Spikelet Fertility in Tropical Paddy (2023)",
      intents: ["rugi", "kerugian", "yield", "hasil", "loss", "berapa", "how much", "terjejas", "affected"],
      followups: [
        { ms: "Boleh buat tugasan pemeriksaan pintu air?", en: "Can you create a water gate inspection task?" },
      ],
    },
  ],

  // ─── F5: Petak E — Healthy, community plot, D+57 ─────────────────────────
  f5: [
    {
      topic: "health",
      ms: "Petak E nampak bagus. Apa yang buat dia kekal stabil?",
      en: "Petak E looks great. What's keeping it on track?",
      answerMs:
        "Pengurusan harian yang konsisten adalah jawapannya. NDVI 0.79, EVI 0.72 — ini hampir di kemuncak julat jangkaan MR297 pada Hari 57. Plot komuniti kerap mengatasi plot diuruskan secara individu semata-mata kerana seseorang ada setiap hari. Teruskan apa yang berkesan: paras air terjaga, semakan daun mingguan, dan catat bila anda nampak sesuatu yang luar biasa.\n\n**Sumber**\n· DOA Malaysia — Amalan Agronomi Padi: Pengurusan Ladang Komuniti (2022)\n· IADA Barat Laut Selangor — Laporan Ladang Sekinchan S2/2025",
      answerEn:
        "Consistent daily attention is the answer. NDVI 0.79, EVI 0.72 — this is near the top of MR297's expected range at Day 57. Community plots often outperform individually managed ones simply because someone is there every day. Keep doing what works: water level maintained, weekly leaf checks, and note anything that looks different.\n\n**Sources**\n· DOA Malaysia — Paddy Agronomy Practices: Community Plot Management (2022)\n· IADA Barat Laut Selangor — Sekinchan Field Records S2/2025",
      intents: ["bagus", "good", "stabil", "stable", "sihat", "healthy", "kenapa", "why", "maintain", "teruskan"],
      followups: [
        { ms: "Ada risiko yang perlu saya jaga untuk Petak E?", en: "Are there risks I should watch out for in Petak E?" },
        { ms: "Bila jangkaan menuai Petak E?", en: "When is Petak E expected to harvest?" },
      ],
    },
    {
      topic: "risk",
      ms: "Ada risiko yang perlu saya jaga untuk Petak E?",
      en: "Are there risks I should watch out for in Petak E?",
      answerMs:
        "Tetingkap jangkitan blast pada peringkat akhir pembungaan lebih kurang 7–10 hari dari sekarang. Blast subur bila suhu malam jatuh bawah 24°C dengan kelembapan tinggi — corak Selangor November yang biasa. Pantau ramalan cuaca. Kalau corak tu nampak, satu semburan fungisida pencegahan (trisiklazol) pada permulaan kemunculan malai adalah insuran yang berbaloi. Selain tu, Petak E dalam kedudukan yang kukuh.\n\n**Sumber**\n· DOA Malaysia — Pengurusan Penyakit Blast Padi: Panduan IPM (2023)\n· MARDI — Epidemiologi Blast Padi di Kawasan Pantai Selangor: Faktor Cuaca (2022)",
      answerEn:
        "The heading stage blast window is roughly 7–10 days from now. Blast thrives when nighttime temperatures drop below 24°C with high humidity — a common Selangor November pattern. Monitor the weather forecast. If that pattern shows up, one preventive fungicide spray (tricyclazole) at the start of panicle emergence is good insurance. Aside from that, Petak E is in a strong position.\n\n**Sources**\n· DOA Malaysia — Rice Blast Disease Management: IPM Guide (2023)\n· MARDI — Paddy Blast Epidemiology in Coastal Selangor: Weather Factors (2022)",
      intents: ["risiko", "risk", "jaga", "watch", "ancaman", "blast", "bahaya", "careful"],
      followups: [
        { ms: "Macam mana nak kenal tanda awal blast?", en: "How do I identify early signs of blast?" },
      ],
    },
  ],

  // ─── F6: Petak F — Warning (resolved), nitrogen deficiency, D+55 ─────────
  f6: [
    {
      topic: "recovery",
      ms: "Amaran Petak F — dah selesai ke?",
      en: "The warning for Petak F — has it been resolved?",
      answerMs:
        "Ya, dan ini adalah kisah yang patut diberi perhatian. EVI jatuh sekata ke 0.40 merentasi seluruh ladang pada Hari 25 — 17% di bawah penanda aras. Penurunan serata ladang dalam EVI, tiada corak tampalan, adalah tanda khas kekurangan nitrogen (berbeza dari penyakit yang tunjuk titik panas tempatan dalam peta haba). Urea ditabur-atas pada 8 Oktober, dan menjelang 4 November, EVI pulih ke 0.66 — balik dalam julat sihat. Dikesan awal, diperbetulkan sepenuhnya.\n\n**Sumber**\n· DOA Malaysia — Jadual Pembajaan NPK untuk Varieti MR297 & MR269 (2022)\n· MARDI — Pengesanan Kekurangan Nitrogen melalui Indeks EVI Sentinel-2 (2023)\n· IADA Barat Laut Selangor — Laporan Ladang Sekinchan S2/2025",
      answerEn:
        "Yes, and this is the story worth paying attention to. EVI dropped uniformly to 0.40 across the entire field at Day 25 — 17% below the benchmark. Uniform field-wide EVI loss with no patch pattern is the distinctive signature of nitrogen deficiency (as opposed to disease, which creates localised hotspots on the heatmap). Urea was top-dressed on October 8, and by November 4, EVI recovered to 0.66 — back in the healthy range. Caught early, fully corrected.\n\n**Sources**\n· DOA Malaysia — NPK Fertilisation Schedule for MR297 & MR269 Varieties (2022)\n· MARDI — Nitrogen Deficiency Detection via Sentinel-2 EVI Index (2023)\n· IADA Barat Laut Selangor — Sekinchan Field Records S2/2025",
      intents: ["amaran", "warning", "selesai", "resolved", "pulih", "recover", "baik", "okay", "sembuh"],
      followups: [
        { ms: "Macam mana sistem tahu ia kekurangan nitrogen dan bukan penyakit?", en: "How did the system know it was nitrogen deficiency and not disease?" },
        { ms: "Perlu tambah lebih banyak baja sekarang?", en: "Should I add more fertiliser now?" },
      ],
    },
    {
      topic: "nitrogen_detection",
      ms: "Macam mana sistem tahu ia kekurangan nitrogen dan bukan penyakit?",
      en: "How did the system know it was nitrogen deficiency and not disease?",
      answerMs:
        "Pengecaman corak. Penyakit bakteria seperti BLB dan kulat blast tunjuk corak peta haba tak serata — anda nampak titik panas di penjuru atau sepanjang baris irigasi. Kekurangan nitrogen buat penurunan serata ladang sebab setiap pokok sama kurang nutrisi. EVI 17% di bawah penanda aras MR297, serata sepenuhnya, pada Hari 25 — itu terus tunjuk kepada N. Kalau corak tu tidak serata, kita akan tandakan amaran yang berbeza.\n\n**Sumber**\n· MARDI — Pengesanan Kekurangan Nitrogen melalui Indeks EVI Sentinel-2 (2023)\n· MARDI — Pembezaan Corak Tekanan Biotik dan Abiotik dalam Padi menggunakan Remote Sensing (2022)",
      answerEn:
        "Pattern recognition. Bacterial diseases like BLB and fungal blast create uneven heatmap patterns — you see hotspots in corners or along irrigation rows. Nitrogen deficiency produces uniform field-wide decline because every plant is equally undernourished. EVI 17% below the MR297 benchmark, evenly distributed across the whole field, at Day 25 — that pointed straight to N deficiency. If the pattern had been patchy, we would have flagged a different alert.\n\n**Sources**\n· MARDI — Nitrogen Deficiency Detection via Sentinel-2 EVI Index (2023)\n· MARDI — Distinguishing Biotic vs Abiotic Stress Patterns in Paddy using Remote Sensing (2022)",
      intents: ["macam mana", "how", "kesan", "detect", "tahu", "know", "nitrogen", "bukan", "penyakit", "disease"],
      followups: [
        { ms: "Perlu tambah lebih banyak baja sekarang?", en: "Should I add more fertiliser now?" },
      ],
    },
    {
      topic: "fertiliser_now",
      ms: "Perlu tambah lebih banyak baja sekarang?",
      en: "Should I add more fertiliser now?",
      answerMs:
        "Tidak — tahan dulu. Petak F di Hari 55 dan sudah pulih sepenuhnya. Menambah nitrogen pada peringkat pembungaan menggalakkan pertumbuhan vegetatif berbanding pengisian butir — anda sebenarnya akan kurangkan hasil dengan menggalakkan pokok kekal hijau lebih lama daripada mengisi butir. Kekalkan air, buat semakan visual standard untuk blast, dan Petak F patut menuju ke tuaian normal.\n\n**Sumber**\n· DOA Malaysia — Jadual Pembajaan NPK untuk Varieti MR297 & MR269 (2022)\n· MARDI — Kesan Pembajaan Nitrogen Lewat terhadap Pengisian Butir Padi (2021)",
      answerEn:
        "No — hold off. Petak F is at Day 55 and fully recovered. Adding nitrogen at heading stage pushes vegetative growth at the expense of grain fill — you'd actually be reducing yield by encouraging the plant to stay green longer rather than filling grain. Maintain water, do a standard visual check for blast, and Petak F should be on track for a normal harvest.\n\n**Sources**\n· DOA Malaysia — NPK Fertilisation Schedule for MR297 & MR269 Varieties (2022)\n· MARDI — Effects of Late Nitrogen Application on Paddy Grain Fill (2021)",
      intents: ["baja", "fertiliser", "tambah", "add", "perlu", "need", "sekarang", "now", "lagi", "more"],
      followups: [
        { ms: "Bila Petak F dijangka menuai?", en: "When is Petak F expected to harvest?" },
      ],
    },
  ],
};

// ─── Utility ──────────────────────────────────────────────────────────────────

const normalize = (s = "") => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");

/**
 * Returns the Q&A entry from a field that best matches a user message.
 */
function findBestMatch(fieldId, userMessage) {
  const qna = FIELD_QNA[fieldId];
  if (!qna?.length) return null;

  const norm = normalize(userMessage);

  // Control words pass-through to existing flow
  const controlWords = ["ya", "yes", "boleh", "nak", "mahu", "mau", "setuju", "ok", "okay", "buat tugasan", "create task"];
  if (controlWords.some((w) => norm.includes(normalize(w)))) return null;

  const inquiryHints = ["?", "apa", "bagaimana", "kenapa", "bila", "perlu", "macam mana", "berapa", "what", "how", "why", "when", "should", "can you", "could"];
  const looksLikeQuestion = inquiryHints.some((h) => userMessage.toLowerCase().includes(h));
  if (!looksLikeQuestion) return null;

  // 1) Exact question text match
  const direct = qna.find((item) => {
    const msNorm = normalize(item.ms);
    const enNorm = normalize(item.en);
    return norm.includes(msNorm) || norm.includes(enNorm);
  });
  if (direct) return direct;

  // 2) Intent keyword scoring
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
  if (best && bestScore > 0) return best;

  return null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getDemoQuestionsForField(fieldId) {
  return FIELD_QNA[fieldId] || [];
}

/**
 * Returns suggested follow-up questions.
 * Priority: follow-ups of the last matched Q&A → remaining unasked Q&As.
 */
export function getDemoSuggestedQuestionsForField(
  fieldId,
  lastUserMessage = "",
  askedMessages = [],
) {
  const all = getDemoQuestionsForField(fieldId);
  if (!all.length) return [];

  const asked = askedMessages.map((m) => normalize(m));

  // Try to find which entry was last answered
  const matched = lastUserMessage ? findBestMatch(fieldId, lastUserMessage) : null;

  if (matched?.followups?.length) {
    // Filter out already-asked follow-ups
    const filtered = matched.followups.filter((fq) => {
      const msNorm = normalize(fq.ms);
      const enNorm = normalize(fq.en);
      return !asked.some((a) => a.includes(msNorm) || a.includes(enNorm));
    });
    if (filtered.length > 0) return filtered;
  }

  // Fallback: unasked Q&As for this field (show first 2)
  return all
    .filter((item) => {
      const msNorm = normalize(item.ms);
      const enNorm = normalize(item.en);
      return !asked.some((a) => a.includes(msNorm) || a.includes(enNorm));
    })
    .slice(0, 2)
    .map(({ ms, en }) => ({ ms, en }));
}

/**
 * Returns a scripted answer for a field and user message, in the correct language.
 */
export function getDemoAnswerForField(fieldId, userMessage = "", lang = "ms") {
  const matched = findBestMatch(fieldId, userMessage);
  if (!matched) return null;

  const answer = lang === "en" ? matched.answerEn : matched.answerMs;

  // Fallback to the other language if the requested one is empty
  return answer || matched.answerMs || matched.answerEn || null;
}
