# SawahSense — Demo Narrative & Technical Reference

## Sekinchan, Selangor | Season 2 / Musim Kedua 2025

> A ground-level story of six paddy fields, one growing season, three problems — and how satellite intelligence changed the outcome.

---

## The Setting

Sekinchan is not your average Malaysian paddy field. Tucked along the coast of Selangor, 90 minutes north of Kuala Lumpur on Federal Route 5, it is the **highest-yielding paddy zone in the country** — achieving 8 to 12 tonnes per hectare when the national average hovers around 4. Farmers here are mechanised, the irrigation canals are engineered, and the land is managed with a precision that most of Malaysia's 160,000 paddy farmers cannot yet afford.

The area is governed by **IADA Barat Laut Selangor (BLS)** — not MADA (Kedah), not KADA (Kelantan). Sekinchan's farmers run an unusual cropping calendar: **five harvests in a two-year cycle**, squeezing an extra half-season into the intervals that other regions leave fallow. Every day of productive growth matters here.

The dominant variety is **MR297**, also known locally as _Siraj_. It's high-yielding, moderately resistant to Brown Plant Hopper (BPH) and rice blast, and well-suited to Sekinchan's coastal climate. It matures in roughly 95–105 days from transplanting.

**Season 2 / Musim Kedua** runs from September to December. Transplanting happens in the first two weeks of September. Harvest comes in late November or early December. This is the season we are watching.

This demo covers six adjacent fields — all within a 5km radius of each other in Sekinchan — across 90 days of satellite monitoring: **September 5 to December 4, 2025**.

---

## The Fields at a Glance

| Field   | Area   | Variety | Transplanted | Outcome                                 |
| ------- | ------ | ------- | ------------ | --------------------------------------- |
| Petak A | 2.2 ha | MR297   | Sep 3        | ✅ Healthy — benchmark                  |
| Petak B | 1.6 ha | MR269   | Sep 5        | ✅ Healthy — different variety          |
| Petak C | 3.1 ha | MR297   | Sep 6        | 🔴 Bacterial Leaf Blight — ~35% loss    |
| Petak D | 2.5 ha | MR297   | Sep 4        | 🟡 Irrigation blockage — heading stress |
| Petak E | 4.0 ha | MR297   | Sep 8        | ✅ Healthy — community plot             |
| Petak F | 1.8 ha | MR297   | Sep 10       | 🟡 Nitrogen deficiency — caught early   |

---

## The Life Cycle — How a Paddy Season Unfolds

To understand what went wrong, you first need to understand what should go right.

### Phase 1 — Land Preparation & Transplanting (Before Day 0)

Before any seedling touches the ground, the field is flooded and ploughed. Decomposed stubble from the previous season is worked into the soil. Water in the field at this stage is deliberate — it suppresses weeds, softens the soil, and creates the anaerobic conditions paddy roots thrive in.

This is visible in the satellite data immediately. On **September 5**, the very first acquisition, all six fields show:

- **NDVI: 0.20–0.22** — almost no vegetation yet. The signal is mostly soil and water.
- **EVI: 0.16–0.18** — similarly bare canopy.
- **LSWI: 0.60–0.68** — very high. The land is flooded. This is correct and expected.

Fields transplanted slightly later (Petak E on Sep 8, Petak F on Sep 10) show even lower NDVI on Sep 5 — they are still in bare-soil preparation. Their LSWI is highest of all: deep blue on the moisture heatmap, reflecting standing water before the seedlings even arrive.

This early LSWI is an important calibration point. High moisture at transplanting is _normal_. The system does not alert here. It is only later — when LSWI drops _abnormally fast at the wrong stage_ — that water becomes a crisis signal.

---

### Phase 2 — Establishment & Early Tillering (Day 7 to Day 30)

Transplanted seedlings spend the first week simply surviving. Their roots have been disturbed. The plants are stressed from transplantation shock. NDVI climbs slowly — from 0.20 to around 0.35–0.40 by Day 20 — as the seedlings recover and begin to photosynthesize in earnest.

By **September 20–30**, the tillering process begins. This is paddy's equivalent of branching. Each seedling starts producing additional shoots called _tillers_, and each tiller is a potential panicle — a potential grain-bearing stem. The more tillers, the more productive the field.

Across all six fields, the satellite shows a clean, steady climb:

- **NDVI: 0.35–0.51** by Day 27 (September 30)
- **EVI: 0.29–0.45** — canopy density building
- **LSWI: 0.45–0.49** — field water stabilising at a flooded-but-vegetated level

Everything looks textbook. But in two of the six fields, something is already beginning to go wrong — quietly, invisibly, before it shows on the leaf.

---

### The First Divergence — Petak F, Day 25: The Nitrogen Story Begins

**Petak F** was transplanted on September 10. By Day 25, it should be entering active tillering alongside the other fields. But if you compare its **EVI on September 30** against Petak A (transplanted Sep 3, so Day 27), something is subtly off:

- Petak A at D+27: EVI = **0.44**
- Petak F at D+25: EVI = **0.34**

That's a gap of 0.10 — roughly 23% lower. The field looks paler on the EVI heatmap. Not alarmingly so. Easy to miss with the naked eye, especially if you don't have a comparison field right next door.

The cause: before transplanting, the farmer applied a basal fertiliser with the wrong NPK ratio. The recommended formulation for MR297 in Sekinchan is **15:15:15** — balanced nitrogen, phosphorus, and potassium. Instead, a **12:12:17** blend was used. It's a common beginner mistake: the 17 on the potassium side looks reassuring, but the nitrogen is 20% short.

Nitrogen is the engine of leaf growth. Without enough of it, the new tillers are thinner, the leaves are slightly yellow-green rather than deep green, and the canopy builds more slowly. The satellite's EVI — which measures canopy density and structure, not just greenness — detects this before the farmer notices it walking the bund.

**October 5 (Day 30): Alert fires.**

EVI = 0.40. Expected range for Day 30 early tillering in MR297: 0.48–0.56. The gap is 17% below the lower bound. More importantly, the pattern is **uniform across the entire field** — no patches, no spatial gradient. Every row shows the same EVI underperformance. This is the satellite's way of saying: this is not a disease starting in one corner. This is a systemic, whole-field issue. Nutrient, not pest.

The alert is sent. The farmer applies **urea top-dressing** — approximately 90kg for 1.8 hectares — on October 8. Within 10–14 days, the nitrogen releases into the paddy root zone, and by **October 25 (Day 45)**, Petak F's EVI has climbed back into the normal range at 0.58. By November 4, it is fully recovered at 0.66 — indistinguishable from a healthy field.

Because the alert fired on Day 30 rather than Day 50, the entire tillering phase was salvaged. The farmer corrected it _before_ the window closed. Yield at harvest: near-normal. Had it gone undetected until Day 50 or later, the tillering phase would have been permanently stunted — those tillers that never formed in September and October cannot be recovered by November fertilising.

**This is the earliest intervention story in the demo. It is also the simplest. A beginner mistake, caught by the satellite, corrected in time.**

---

### Phase 3 — Active Tillering (Day 35 to Day 55)

By October, the healthy fields are visibly transformed. Walking along the bunds in mid-October, you would see a carpet of deep green paddy — dense, uniform, the tillers standing upright and starting to compete for light. This is when the satellite readings peak in their visual impact:

- **NDVI: 0.68–0.75** (Petak A, Oct 15–25)
- **EVI: 0.60–0.68** — the canopy is thick enough that EVI and NDVI are nearly in step
- **LSWI: 0.30–0.36** — moisture has stabilised; the field is flooded but the vegetation is dense enough to reduce the bare-water signal

This is the window where Petak F's nitrogen story resolves, and where a darker story begins.

---

### The Second Divergence — Petak C, Day 47: The BLB Story Begins

**October 20.** Day 47 for Petak C (transplanted September 6). The satellite passes overhead. The image is clear — cloud cover just 7%.

At field scale, Petak C looks fine. The NDVI mean is 0.67 — slightly below Petak A's 0.72, but nothing alarming on its own. The time series chart shows a small pullback from the October 15 peak of 0.70.

But the heatmap tells a different story.

On the NDVI spatial map for October 20, a **wedge of yellow-orange appears in the southeast corner** of Petak C. The rest of the field is a healthy deep green — NDVI of 0.70–0.75. That corner? NDVI of 0.52–0.55. A **22% localised depression** relative to the rest of the same field.

Two things make this unambiguous:

1. The anomaly starts exactly at the **southeast corner** — the location of the primary irrigation water inlet for Petak C.
2. The pattern is **directional** — it spreads not randomly, but in rows parallel to the irrigation flow, the way water moves through the field.
3. On the same date, **LSWI is completely normal across the entire field**. The soil moisture is fine. The water supply is fine. Only the vegetation canopy is dying — and only from the edges of the affected leaves inward.

This is the signature of **Bacterial Leaf Blight** (_Xanthomonas oryzae_ pv. _oryzae_) — known in Malay as _Hawar Daun Bakteria_, or simply BLB.

#### How BLB Works

BLB is a bacterial infection, not a fungal one. It enters the paddy plant through water — specifically through the tiny pores (_hydathodes_) at the tips and margins of leaves, and through wounds. When infected canal water flows into a field, it carries _Xanthomonas oryzae_ bacteria that colonise the leaf margins immediately at the water entry point.

Within days, those leaf margins turn yellow-white — a distinctive "burning from the edge inward" appearance, very different from the diamond-shaped lesions of rice blast. The infection then spreads through the field as water moves during irrigation, or during wind-driven rain events (Sekinchan gets frequent afternoon thunderstorms in October during the inter-monsoon period).

On satellite:

- **NDVI falls first** — chlorophyll is destroyed as leaf cells die. The green disappears from the affected zone.
- **EVI follows** — the dying leaves change canopy structure and reflectance.
- **LSWI is unaffected** — the bacteria attack leaf tissue, not the field's water system. This distinguishing pattern is critical.

The spatial pattern — a wedge starting at the SE canal inlet, spreading in irrigation row direction — is exactly what BLB looks like from 600km above the Earth's surface. This is not a generic anomaly. This is a disease fingerprint.

#### Why Sekinchan and BLB Have History

In 2016, Sekinchan experienced the **worst BLB outbreak in Malaysia in 30 years**. Fields that had been producing 9–10 tonnes per hectare were reduced to 3–4 tonnes. Some lost 70% of their crop. The bacteria spread through the interconnected irrigation canal network — one infected field's drainage became the next field's inlet water.

No farmer was warned early enough. By the time the yellow-white leaf edges were visible walking the bund, the bacteria had already been in the water and on the leaf tips for 10–14 days. Containment was nearly impossible.

**SawahSense detects the Oct 20 anomaly and fires an alert the same day.**

The alert message explains what LSWI being stable means: this is not a water problem. The directional pattern from the SE corner means bacteria entered via the canal. Go check the southeast corner leaves for white-edged yellowing that starts from the leaf tip. If you see it: drain the field immediately, stop shared irrigation water with neighbours, apply copper hydroxide bactericide, and notify IADA BLS.

#### What Happens Next

Without intervention, BLB spreads relentlessly. By **October 25**, the heatmap shows the yellow-orange wedge has grown and now extends along two or three irrigation rows toward the centre of Petak C. By **November 4 (Day 62)**, approximately 35% of the field is affected — the heatmap is visibly split, healthy green on the northwest side, an angry yellow-orange on the southeast.

With intervention after the October 20 alert, the copper bactericide slows the spread. But BLB in paddy cannot be cured — only slowed. The affected leaves do not recover. The plants will produce thinner, lighter panicles where the leaf area was destroyed during active tillering. By harvest (early December), Petak C yields approximately **30–40% less** than its healthy neighbours. Had the alert not fired and intervention not started until the farmer noticed it visually (probably around October 28–30), the loss would likely have been 50–60%.

---

### Phase 4 — Booting and Heading (Day 55 to Day 70)

November in a Sekinchan paddy field is the most dramatic phase to watch. The plant stops producing tillers and puts all its energy into elongating the final stem — the one carrying the panicle. This elongation phase is called **booting**. The panicle develops inside the leaf sheath like a fist inside a sleeve. Then it emerges — this is **heading** — and the flowers open for pollination.

This is the most water-sensitive period of the entire crop cycle.

The reason is biology: for a rice grain to form, pollen must be viable, and pollen viability is directly dependent on cell water content. A plant that is water-stressed during heading produces pollen that is deficient — lower germination rates, incomplete grain fill. The result is **hollow panicles**: the full-looking grain heads that, when threshed, yield chaff and empty husks instead of rice.

On the satellite, the heading stage looks like this for healthy fields:

- **NDVI: 0.80–0.82** (Petak A, Petak E) — peak green, the canopy is fully closed
- **EVI: 0.73–0.75** — matching, dense canopy
- **LSWI: 0.24–0.27** — slightly lower than tillering (plants are translocating water upward to the panicle; less surface water signal), but still within the expected heading range of 0.24–0.34

Everything must stay in these ranges. The NDVI and EVI peaks look beautiful — deep green fields stretching to the horizon, the panicles beginning to show their characteristic downward arch as they fill. A drone pilot flying over Sekinchan on November 9 would see nothing wrong. Eight of the most productive square kilometres in Malaysia, looking exactly as they should.

Except one field has a hidden problem.

---

### The Third Divergence — Petak D, Day 62: The Water Story Begins

**November 4.** Day 62 for Petak D (transplanted September 4). Booting is underway. The panicle is forming inside the flag leaf sheath.

Petak D is located at the end of a secondary irrigation channel — the furthest point from the main canal pump. Its inlet gate is a simple sluice controlled manually by the farmer. In late October, silt and debris — common in Sekinchan's ageing infrastructure — partially blocked the gate without the farmer noticing immediately.

The panicle needs water. The field is quietly drying.

The satellite image from **November 4** shows:

- **NDVI: 0.76** — completely normal. Deep healthy green. Identical to Petak A.
- **EVI: 0.69** — completely normal. Dense canopy. Identical to Petak A.
- **LSWI: 0.18** — critically abnormal.

Expected LSWI for heading stage MR297: 0.24–0.34. Actual: 0.18. That is **47% below the expected minimum**. And the drop was fast — just 5 days earlier (October 30 estimated from the cloudy pass), LSWI was around 0.24. Now it's 0.18 and falling.

This is the heart of the SawahSense demo.

**If you were using only NDVI monitoring — which is what most available tools do, including GPS-based Proladang and similar systems — you would see nothing wrong with Petak D on November 4.** A field with NDVI 0.76, EVI 0.69. Healthy. No alert.

Meanwhile, the panicle inside the flag leaf is developing under water stress. Cell elongation is limited. Pollen development is impaired. Every day without water at this stage permanently affects the grain fill that will happen in the following two weeks.

The alert fires. The farmer checks the inlet gate — finds a blockage of compressed silt and debris, clears it by November 6–7. Water is restored. But three days of heading-stage water stress have already done some damage. The grain fill (November 19–29) shows LSWI recovering to 0.21 and NDVI dropping normally as the crop matures. The final yield is estimated at **15–20% below** what it would have been without the blockage.

**Without the LSWI alert, the farmer would not have checked the gate until he walked the field — maybe two or three more days. The loss would have been 25–35%, concentrated entirely in empty husks.**

The physical proof is visible on the LSWI heatmap for November 4: Petak D is pale yellow — almost the colour of dry soil — while every surrounding field shows a normal teal-blue moisture signal. The NDVI map on the same date shows Petak D as deep green, indistinguishable from its healthy neighbours. Two views of the same field. Two completely different stories.

---

### Phase 5 — Grain Filling and Ripening (Day 70 to Day 100)

From mid-November onward, the paddy enters its final act. The panicles arch downward as the grain fills — each kernel swelling with starch. Chlorophyll begins to break down. The leaves that were once a deep monsoon-green start to fade toward golden yellow. The NDVI and EVI curves, which peaked around Day 65–67, begin their inevitable descent.

This senescence is visible and beautiful in the satellite data:

- **November 24 (Day 82 for Petak A):** NDVI 0.74, EVI 0.67. Still mostly green but fading.
- **November 29 (Day 87):** NDVI 0.67, EVI 0.60. Golden green.
- **December 4 (Day 92):** NDVI 0.55, EVI 0.47. Golden. Harvest-ready.

The LSWI at this point has dropped to 0.12 — the field is being **intentionally dried down**. Two weeks before harvest, farmers drain the field to allow machinery to enter and to prevent the paddy from falling over (_lodging_) under its own grain weight in wet soil. A low LSWI in late November is not a warning — it is a sign that the farmer is managing correctly.

The system knows the difference because it knows the growth stage. An LSWI of 0.18 at Day 62 (heading) is an emergency. An LSWI of 0.12 at Day 92 (pre-harvest drainage) is routine. Stage-awareness is everything.

The healthy fields — Petak A, Petak B, Petak E — complete the season along their predicted curves. Estimated yield: 8–10 t/ha, consistent with Sekinchan's benchmark.

Petak C (BLB): harvested at roughly 5–6 t/ha. The damaged section yields mostly light, poor-quality grain.

Petak D (water stress): harvested at roughly 6.5–7.5 t/ha. The hollow panicles are visible at threshing — a higher-than-usual proportion of _tangkai kosong_ (empty stems).

Petak F (nitrogen, corrected): harvested at roughly 8–9 t/ha — close to benchmark. The early intervention preserved the tillering phase.

---

## The Technical Layer — What the Satellite Sees

### Why Three Indices?

Most satellite monitoring tools for agriculture use NDVI alone. NDVI measures greenness — specifically the ratio of red light reflected (which chlorophyll absorbs) to near-infrared (which healthy plant cells reflect strongly). It is a good general indicator of canopy health.

But this demo shows three situations where NDVI alone fails:

| Situation                      | NDVI      | EVI       | LSWI        | Why NDVI Misses It                                                                                                                 |
| ------------------------------ | --------- | --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Petak D water stress (Nov 4)   | ✅ Normal | ✅ Normal | 🔴 Critical | Water stress doesn't reduce chlorophyll immediately. The plant looks green but is internally dehydrated.                           |
| Petak F nitrogen early (Oct 5) | 🟡 Mild   | 🔴 Clear  | ✅ Normal   | EVI is more sensitive to canopy density/structure changes from nitrogen deficiency. NDVI lags.                                     |
| Petak B vs Petak A (all dates) | 🟡 Lower  | 🟡 Lower  | ✅ Normal   | MR269 has a naturally lower canopy density than MR297. Without variety-awareness, NDVI triggers a false alert. SawahSense doesn't. |

**EVI** (Enhanced Vegetation Index) corrects for soil background and atmospheric effects, making it more sensitive to canopy architecture and density. It detects nutrient stress and early growth problems before NDVI does.

**LSWI** (Land Surface Water Index) measures short-wave infrared reflectance — water absorbs SWIR strongly, so liquid water content in leaves and soil reduces the LSWI signal. It catches irrigation failures and water stress _before_ the plant shows it in chlorophyll.

Together, the three indices provide a diagnostic matrix: any alert requires cross-referencing all three to identify whether the problem is biotic (pest/disease: NDVI/EVI affected, LSWI stable), abiotic/water (LSWI affected, NDVI/EVI stable or delayed), or systemic/nutrient (EVI uniform depression, LSWI normal, NDVI mild).

### Cloud Handling

Sekinchan is coastal. The inter-monsoon period (September–October) brings frequent afternoon thunderstorms. Sentinel-2 passes every 5 days, but cloud cover invalidates approximately 5 of the 19 acquisition passes in this season:

- Sep 15 (72% cloud)
- Sep 25 (65% cloud)
- Oct 10 (58% cloud)
- Oct 30 (61% cloud)
- Nov 14 (55% cloud)

These gaps appear in the SawahSense UI as greyed-out "cloud" chips in the date carousel. The index chart shows interpolated values through these gaps. The BLB detection on October 20 was only possible because the **October 15** and **October 20** passes were both clear — allowing a direct before/after comparison across the critical D+42 to D+47 window when BLB first became detectable.

Had October 20 been cloudy, the next clear pass would have been October 25 — at which point the BLB had already spread to two additional rows. Every clear acquisition is a monitoring opportunity. Every cloudy day is a gap in the record.

---

## Demo Walk-Through — What to Show Judges

### Opening: The Normal Season

Start on Petak A. Show the NDVI time series chart: transplanting stage (red, 0.21) → tillering climb → heading peak (dark green, 0.82) → grain fill descent → harvest ripening (golden, 0.55). This is what 8–10 t/ha looks like from space.

Switch to Petak B. Slightly lower absolute values at every stage — but same curve shape. Explain that this is MR269, a different variety with a naturally more compact canopy. SawahSense doesn't alert on this difference because it is variety-calibrated. This is the false-alarm avoidance story.

### Act 1: The Nitrogen Field (Petak F)

Jump to Petak F. Show the chart — the curve diverges from the expected trajectory in late September and reaches a visible trough by October 5. Show the heatmap on October 5: the field is uniformly paler (lighter green to yellow on the EVI map) compared to Petak A at the same date. No patches, no spatial gradient — the whole field is off. Explain: field-wide uniform EVI underperformance = nutrient problem. The alert prompt the farmer to check their fertiliser records. Top-dress with urea. Then show the recovery: EVI climbing back, and by November the field is back on track. **Message: early detection = correctable outcome.**

### Act 2: The BLB Outbreak (Petak C)

Start on Petak C's October 15 heatmap — uniform deep green. Normal. Then switch to October 20. Show the NDVI heatmap: the SE corner has a yellow-orange wedge. Show the LSWI heatmap on the same date — completely normal, uniform teal-blue across the whole field. Explain why this matters: **the disease attacked the leaves but not the water system**. This is the BLB fingerprint. Then walk through the spread: Oct 25 the wedge grows, Nov 4 the field is visibly split. Invoke the 2016 historical outbreak. **Message: early spatial detection, before the farmer sees it walking the bund.**

### Act 3: The Hidden Drought (Petak D)

This is your strongest demo moment. Show Petak D's November 4 NDVI heatmap: perfect deep green, identical to a healthy field. Then switch to LSWI. The field turns pale yellow while every neighbour is teal-blue. Then show the chart: NDVI flat, EVI flat, LSWI suddenly dropping off a cliff. Ask the audience: _"If you were only looking at NDVI, would you have caught this?"_ The answer is no. **Message: LSWI is not optional. Water stress at heading is invisible to NDVI and costs 15–35% yield.**

### Act 4: Pak Tani AI & Image Diagnostics (Interactive)

Switch to the **Pak Tani Tab** in the sidebar. Walk through two scripted conversations — one for each active alert — then close with the image diagnostic.

#### Conversation 1 — Petak C (BLB)

Select **Petak C**. Pak Tani's opening insight references the satellite drop and flags the southeast corner. Then ask:

> **"What should I do about the BLB alert in Petak C?"**

Pak Tani responds immediately with three specific steps: close the shared water gate, walk the southeast rows to count infected plants, and contact IADA BLS if infection is deeper than 3 rows. It references the 2016 Sekinchan BLB season where delayed action led to 50–70% yield loss.

The suggested follow-up chips update automatically. Click:

> **"How much yield could I lose?"**

Pak Tani gives a concrete projection: acting within 72 hours limits losses to ~20–25%, versus potential 50–70% if left unchecked — real numbers tied to this specific 3.1 ha plot.

Then click:

> **"Can you create a scouting task for Petak C?"**

Pak Tani confirms the task is created. Switch to the **Tasks Tab** to show _"Scouting & Semburan BLB (Petak C)"_ appeared with a due date and field context.

#### Conversation 2 — Petak D (Water stress)

Select **Petak D**. Ask:

> **"Petak D looks green — why is there a warning?"**

Pak Tani explains the LSWI insight directly: NDVI and EVI are still green at 0.76 and 0.69, but LSWI collapsed from 0.30 to 0.18 in 5 days. The plant's internal water content is falling before any visible symptoms appear. By the time NDVI drops, 60–70% of grain fill damage is already done. This is the core demo moment — NDVI alone would have missed this entirely.

Click the follow-up:

> **"What should I check at the water gate?"**

Pak Tani gives a 3-point inspection: gate position, channel mouth debris, walk the channel for cracks. Clear, actionable, no jargon.

#### Image Diagnostics

Still on Petak C, click the **Camera icon** next to the input. Choose **"Upload BLB sample"**. Pak Tani analyses the simulated leaf photo, identifies lesion patterns consistent with Bacterial Leaf Blight, and asks if you want to log a scouting task. Reply **"yes"**.

**Message: SawahSense doesn't just alert you to a problem — it tells you exactly what to do, why, and what's at stake. That's the difference between a dashboard and an agronomist in your pocket.**

### Closing: The Numbers

Three problems in one season, in six adjacent fields. One caught and fully corrected. One caught and partially mitigated, with 15–20% loss. One caught but structurally severe, with 30–40% loss (but better than Sekinchan 2016's 50–70%). **SawahSense is not perfect yield recovery — it's better-than-no-information. And in agriculture, better information at the right time is everything.**

---

_Demo data reflects agronomically accurate values for MR297 / MR269 in coastal Selangor conditions._
_Field names, farmer details and precise field geometries are illustrative._
_Disease and agronomic data sourced from DOA Malaysia, MARDI, IADA BLS publications, and Malaysian paddy research literature._
_Season 2 / Musim Kedua 2025 — Transplanting Sep 3–10 | Satellite monitoring Sep 5 – Dec 4 | Harvest late Nov – early Dec._
