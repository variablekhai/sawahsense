# SawahSense — Video Demo Script

> **Target Audience:** Mixed — farmers, investors, government agencies, technologists.  
> **Theme:** AI for Food Security — detecting crop stress before it becomes crop loss.  
> **Duration:** ~5–8 minutes  
> **Tone:** Real, grounded, Malaysian.

---

## 🎬 Opening Hook

**[Narration — spoken over aerial/drone footage of paddy fields]**

> "Sekinchan, Selangor. The highest-yielding paddy zone in Malaysia.
> Eight to twelve tonnes per hectare when the national average is four.
> And even here — even in the best paddy land in the country —
> farmers lose crops to problems they couldn't see coming.
>
> Not because they weren't working hard enough.
> But because they had no way of seeing what was happening
> inside their fields, from above, at the right time.
>
> This is SawahSense."

**[Cut to: Application loading in a browser. Clean dark theme. Map centred on Malaysia.]**

---

## 01 - Onboarding (Scene 1 - 3)

### 🌍 Scene 1 — Onboarding: Choose Your Location

> **[On screen: Onboarding sidebar slides in from the left. Step 1 of 3 is shown.]**

**[Narration:]**

> "When a new user opens SawahSense for the first time, we don't throw them into empty data.
> We walk them through three simple steps — in Bahasa Melayu or English, their choice."

**[Action: Type "Sekinchan" or "Tanjung Karang" in the location search bar of the onboarding sidebar.]**

> "First, they tell us where their farm is."

**[Map flies to Sekinchan, Selangor. Satellite base layer visible.]**

> "The map moves to their location automatically. Right to their paddy."

> **[On screen: "Lokasi anda ditetapkan — Sekinchan, Selangor" / "Location set — Sekinchan, Selangor"]**

---

### 🖊️ Scene 2 — Drawing the First Field

> **[On screen: Onboarding Step 2. Instruction: "Lukis kawasan ladang anda" / "Draw your field boundary"]**

**[Narration:]**

> "Step two. They draw their field.
> Not enter GPS coordinates. Not fill in a form.
> Just — draw."

**[Action: Click "Tambah Ladang / Add Field" button on the sidebar. The cursor changes to a drawing tool. User clicks around a paddy field polygon on the map, tracing the boundary.]**

> "Click around the edges of your field. Like tracing it on a map."

**[Field polygon is drawn and fills with a highlighted colour. Area size auto-calculates — e.g., "2.2 ha".]**

> "The system automatically calculates the area. No measuring tape. No guesswork."

---

### 📝 Scene 3 — Enter Field Details

> **[On screen: Onboarding Step 3. A small form slides in. Three fields:]**
>
> - **Nama ladang / Field Name** — e.g., "Petak C"
> - **Varieti padi / Paddy Variety** — dropdown: MR297, MR269, MR284...
> - **Tarikh semai / Sowing Date** — date picker

**[Narration:]**

> "Step three — three things. What is the field called? What variety is planted? And when was it transplanted?"

**[Action: Fill in "Petak C", select "MR297", pick a transplanting date of September 6.]**

> "That's it. Three pieces of information.
> And with that, SawahSense can now track this field for its entire season —
> ninety days of satellite monitoring, calibrated to this exact variety and this exact start date."

**[Click "Mula / Start". The onboarding sidebar closes. The main application is revealed.]**

> "You're in."

---

## 02 - Dashboard (Scene 4)

### 🗺️ Scene 4 — The Dashboard: Your Farm From Space

> **[On screen: The main map view. Several field polygons visible — Petak A through F. Each one colour-coded by health status. Healthy fields are green; warning fields are amber; critical fields are red.]**

**[Narration:]**

> "This is the dashboard. Six fields. One season. Each one being watched by the Sentinel-2 satellite, every five days.
>
> Green means healthy.
> Amber means something needs your attention.
> Red means act now."

**[Action: Click on the Fields tab in the sidebar. A list of all six fields appears with their health status badges.]**

> "From the Fields tab, you can see every field at a glance — their alert level, their area, their latest index readings."

**[Click on "Petak C" in the list. The map pans and highlights Petak C. The bottom panel opens with the index chart for Petak C.]**

---

## 03 - Reading Data (Scene 5)

### 📊 Scene 5 — Reading the Data: Three Indices, One Story

> **[On screen: The bottom panel shows a time-series chart for Petak C. Three lines: NDVI (green), EVI (blue), LSWI (teal). Date carousel at the top. Heatmap selector chips.]**

**[Narration:]**

> "Most satellite tools only show NDVI — greenness.
> SawahSense tracks three indices, because three indices catch three different problems."

**[Hover over the NDVI line on the chart.]**

> "NDVI tells you if the plant is green and photosynthesising."

**[Hover over EVI.]**

> "EVI goes deeper — it measures canopy density and structure. It catches nutrient deficiency before NDVI does."

**[Hover over LSWI.]**

> "LSWI measures water content — in the leaves, in the soil. It catches irrigation failure before the plant shows it in colour."

**[Switch to the Heatmap tab. Click the NDVI chip for October 20.]**

> "Let's look at October 20. NDVI heatmap. Petak C looks mostly fine — deep green."

**[Switch to LSWI chip.]**

> "Now switch to LSWI — same date, same field.
> Still normal. Good soil moisture.
>
> But watch what happens when we switch to EVI and look closely at the southeast corner."

**[Zoom into the SE corner of Petak C heatmap. A yellow-orange wedge is visible.]**

> "That wedge. Yellow-orange, starting exactly at the irrigation water inlet.
> The satellite caught Bacterial Leaf Blight — entering through the canal water — on October 20.
> Before the farmer could see it walking his bund."

---

## 04 - Alerts (Scene 6)

### 🔔 Scene 6 — Alerts: The Early Warning System

> **[On screen: Click the Alerts tab. A red badge on the bell icon. Inside: two active alerts — one for Petak C (BLB), one for Petak D (LSWI drop).]**

**[Narration:]**

> "When the system detects an anomaly, it fires an alert — automatically, in real time."

**[Click on the Petak D alert. The alert card expands.]**

> "Petak D. November 4. NDVI: 0.76 — completely normal. EVI: 0.69 — completely normal.
> But LSWI dropped to 0.18 — 47% below what it should be at heading stage.
>
> The irrigation gate was partially blocked by silt. The panicle was developing under water stress.
> And NDVI showed absolutely nothing wrong.
>
> If you were only using NDVI — like most tools on the market — you would have missed this entirely.
> SawahSense didn't."

---

## 05 - Pak Tani (Scene 7, Image Diagnostics, Scene 8)

### 🤖 Scene 7 — Pak Tani: Your AI Agronomist

> **[Action: Click the Pak Tani tab (robot icon 🤖 at the bottom of the tab list). The Pak Tani chat interface opens.]**

**[Narration:]**

> "This is Pak Tani — our RAG-powered AI agronomist, built on Malaysian agricultural knowledge:
> Jabatan Pertanian, MARDI, IADA, and decades of paddy research."

**[Action: Petak C should be selected. Show the user selecting one of the suggested questions or typing a new one.]**

> **"Apa nasihat untuk Petak C?"** / **"What is the advice for Petak C?"**

**[Narration:]**

> "Farmers can select from pre-assigned common questions based on their field's current status, or write their own specific questions."

**[Pak Tani responds: Step-by-step mitigation for BLB — drain the field, apply copper hydroxide bactericide, isolate from shared irrigation, notify IADA BLS. Response cites sources like "Manual Penanaman Padi, DOA Malaysia".]**

**[Narration:]**

> "He doesn't give generic farming advice. He gives step-by-step guidance based on what your field data actually says, completely backed by official citations."

#### 📷 Image Diagnostics (within Pak Tani)

**[Action: Click the camera icon 📷 next to the chat input. Select "Muat naik sampel BLB" from the menu.]**

**[Narration:]**

> "Farmers can also send Pak Tani a photo.
> A close-up of an affected leaf — taken with any phone.
> Pak Tani analyses the image and gives a diagnosis right in the chat."

**[Pak Tani response: Detects lesion patterns consistent with Bacterial Leaf Blight. Suggests a scouting task and offers to log it.]**

**[Action: Type "ya" / "yes" / "boleh" in the chat.]**

**[Narration:]**

> "Pak Tani even proactively schedules exactly what needs to be done next."

---

### ✅ Scene 8 — Tasks: From Alert to Action

> **[On screen: Click the Tasks / Tugas tab. A new task has been auto-created: "Scouting & Semburan BLB — Petak C". Due tomorrow. Tagged with field name, alert context, and current index values.]**

**[Narration:]**

> "The recommendation didn't just stay in a chat.
> It became an actionable task — with a deadline, field context, and satellite readings attached."

**[Action: Click on the task card. Tap the WhatsApp button.]**

**[Narration:]**

> "From here, the task can be sent directly to the farmer via WhatsApp in one tap.
> The farmer receives the location, the problem, and exactly what to do."

**[Action: Select "Abu (Petak C)" from the farmer dropdown. Click "Hantar WhatsApp".]**

**[A toast/confirmation appears: "Tugas Dihantar!" / "Tasks Sent!"]**

**[Narration:]**

> "No email chains. No phone tag. No lost notes.
> One tap from the agronomist's desk to the farmer's pocket."

---

## 06 - Bonus (Multilingual & Mobile Accessibility)

> **[On screen: Click the Language toggle ("EN" / "BM") in the top navigation bar. Switch it to Bahasa Melayu. The interface, including the map sidebar, Pak Tani tab, and alerts immediately translate to Bahasa.]**

**[Narration:]**

> "But this isn't just a tool for Malaysia. ASEAN feeds half the world's population, and every country has its own local wisdom and language.
> With a single click, SawahSense transitions its entire UI and AI intelligence to Bahasa Melayu. It's built on an architecture that can instantly scale translation to Thai, Vietnamese, or Tagalog across borders."

> **[On screen: Resize the browser window's width down to simulate a mobile phone screen. Show how the sidebar collapses seamlessly into a hamburger menu while the map auto-focuses beautifully in the much smaller viewport.]**

**[Narration:]**

> "And because field workers don't carry laptops out to the fields, the entire platform is mobile-native responsive.
> Farmers can open SawahSense on the go, check real-time alerts, snap photos for diagnostics, and interact with Pak Tani directly from their smartphones, standing out in the hot sun."

---

## 🏁 Closing: The Numbers That Matter

> **[Montage of all six field heatmaps. Chart lines. Alert cards. Pak Tani chat. Task list.]**

**[Narration:]**

> SawahSense is not perfect. Agriculture never is.
> But better information, at the right time, is the difference between a difficult season and a lost one.
>
> Malaysia has 160,000 paddy farmers.
> Most of them are walking their bunds alone, looking for problems with their eyes.
>
> We can do better.
> They deserve better."

**[Final frame: SawahSense logo. Tagline.]**

> **"SawahSense — Pemantauan Sawah Dari Angkasa."**
> _"Rice Field Monitoring From Space."_

## 🗣️ Talking Points for Q&A

**"How is this different from existing apps like Proladang?"**

> Proladang and similar tools use NDVI only. We use three indices. The Petak D case — NDVI 0.76 while LSWI was critical — shows exactly where single-index tools fail silently.

**"Does it work for small farmers, not just large operators?"**

> Yes. The onboarding works with any polygon size. Field setup takes under 3 minutes with a smartphone. Pak Tani responds in Bahasa Malaysia. The WhatsApp integration means the farmer never even needs to open the app — the task comes to them.

**"What satellite do you use?"**

> Sentinel-2, operated by the European Space Agency (ESA). Free and publicly available. We pull data every 5 days. Cloud-affected passes are marked clearly in the UI.

**"How does Pak Tani know what advice to give?"**

> It uses Retrieval-Augmented Generation (RAG) — the AI retrieves relevant passages from official Malaysian agriculture manuals before generating a response. Every answer is grounded in actual published guidance from DOA, MARDI, and IADA — not hallucinated by a generic model.

**"What does AI for Food Security actually mean for Malaysia?"**

> Malaysia imports approximately 30% of its rice. Every percentage point improvement in average paddy yield reduces that import dependency. SawahSense targets the gap between Sekinchan's best-in-class 10 t/ha and the national average of 4 t/ha — that is not a genetic or soil problem, it's an information problem.

---

_Demo branch: `demo-video`. All data reflects agronomically accurate Sekinchan Season 2 / Musim Kedua 2025 scenario._
_Satellite monitoring window: September 5 – December 4, 2025._
