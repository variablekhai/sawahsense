<img src="frontend/public/logo.png" alt="SawahSense Logo" width="40" align="left" style="margin-right: 12px;" />

# SawahSense — Rice Field Monitoring From Space

> **Pemantauan Sawah Dari Angkasa**  
> AI-powered satellite monitoring for Malaysian paddy farmers — detecting crop stress before it becomes crop loss.

SawahSense is a full-stack precision agriculture platform that uses Sentinel-2 satellite imagery to monitor paddy fields in real time. It tracks three spectral indices (NDVI, EVI, LSWI) to detect irrigation failure, disease outbreaks, and nutrient deficiency weeks before they become visible to the human eye — then communicates actionable advice directly to farmers via an AI agronomist and WhatsApp.

---

## Table of Contents

- [Project Overview](#project-overview)
- [The Three Indices — What the Satellite Sees](#the-three-indices--what-the-satellite-sees)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [APIs & External Services](#apis--external-services)
- [Prerequisites](#prerequisites)
- [Quick Start — Demo Mode (No API Keys)](#quick-start--demo-mode-no-api-keys)
- [Full Setup — Live Mode (With API Keys)](#full-setup--live-mode-with-api-keys)
- [Environment Variables Reference](#environment-variables-reference)
- [Testing Guide for Judges](#testing-guide-for-judges)

---

## Project Overview

Malaysia has 160,000 paddy farmers. Most of them are walking their bunds alone, looking for problems with their eyes. Sekinchan, Selangor — the highest-yielding paddy zone in the country at 8–12 t/ha — still loses crops to problems farmers couldn't see coming.

SawahSense addresses this by:

1. **Monitoring fields every 5 days** via ESA Sentinel-2 satellite (free, publicly available)
2. **Computing three spectral indices** that together catch problems NDVI alone misses
3. **Firing targeted alerts** calibrated to growth stage, paddy variety, and historical baselines
4. **Providing Pak Tani** — an RAG-powered AI agronomist that gives field-specific advice in Bahasa Melayu or English, grounded in official DOA/MARDI/IADA publications
5. **Delivering tasks via WhatsApp** — one tap from agronomist desk to farmer's pocket

---

## Architecture

```
sawahsense/                  ← pnpm monorepo root
├── frontend/                ← Next.js 16 app (port 3000)
│   ├── src/
│   │   ├── app/             ← Next.js App Router pages
│   │   ├── components/
│   │   │   ├── Map/         ← Leaflet map + heatmap overlay
│   │   │   ├── Sidebar/     ← Fields, Alerts, Pak Tani, Tasks tabs
│   │   │   └── BottomPanel/ ← Time-series charts, date carousel
│   │   ├── data/            ← Demo field data + alert rules
│   │   └── hooks/           ← useFieldData, usePakTani, useGDD
│   └── public/
│       ├── demo-tiles/      ← Pre-rendered heatmap PNGs for demo mode
│       └── locales/         ← i18n strings (en / ms)
└── backend/                 ← FastAPI Python app (port 8000)
    └── main.py              ← GEE indices, Pak Tani AI, WhatsApp API
```

---

## The Three Indices — What the Satellite Sees

Most satellite agriculture tools only show NDVI. SawahSense tracks three, because each one catches a different category of problem.

| Index    | Full Name                              | What it measures                  | Plain language                                               |
| -------- | -------------------------------------- | --------------------------------- | ------------------------------------------------------------ |
| **NDVI** | Normalised Difference Vegetation Index | Chlorophyll / greenness of leaves | _"Is the plant green and photosynthesising?"_                |
| **EVI**  | Enhanced Vegetation Index              | Canopy density and structure      | _"How thick and healthy is the crop canopy?"_                |
| **LSWI** | Land Surface Water Index               | Water content in leaves and soil  | _"Is there enough water in the field and inside the plant?"_ |

**Why three?** Because the three indices fail in different situations — and that's exactly the point:

- A plant suffering from **irrigation failure** can look perfectly green (NDVI normal, EVI normal) while its internal water is critically low (LSWI drops). By the time the leaves visibly wilt, the grain damage is already done.
- A field with **nutrient deficiency** shows a subtle, uniform drop in EVI (canopy is thinner) before NDVI picks it up — catching it 2–3 weeks earlier.
- A **bacterial disease** like BLB attacks leaf tissue but not the water system — so NDVI and EVI fall in the affected patch while LSWI stays normal. That specific combination is a disease fingerprint.

---

## Key Features

| Feature                        | Description                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------ |
| **Satellite Index Monitoring** | NDVI, EVI, LSWI computed from Sentinel-2 SR Harmonized (10 m resolution)                         |
| **Smart Alerts**               | Stage-aware thresholds — the same LSWI value means different things at transplanting vs. heading |
| **Heatmap Visualisation**      | Spatial per-pixel index maps overlaid on Leaflet satellite base tiles                            |
| **Pak Tani AI**                | Claude-powered agronomist with field context injection and streaming responses                   |
| **Image Diagnostics**          | Upload leaf photos for disease identification directly in the chat                               |
| **Task Management**            | AI-generated tasks with field context, due dates, and WhatsApp dispatch                          |
| **Multilingual UI**            | Full Bahasa Melayu / English toggle (i18next)                                                    |
| **Mobile Responsive**          | Works on smartphones for field use                                                               |
| **Demo Mode**                  | Runs entirely offline with pre-computed Sekinchan Season 2/2025 data                             |

---

## Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Map**: Leaflet + react-leaflet, leaflet-draw (polygon field drawing)
- **Charts**: Recharts (time-series index charts)
- **Styling**: Tailwind CSS v4
- **i18n**: i18next + react-i18next
- **Icons**: Lucide React

### Backend

- **Framework**: FastAPI (Python 3.10+)
- **Package manager**: uv
- **AI**: Anthropic Claude 3.5 Sonnet (streaming)
- **Satellite data**: Google Earth Engine Python API (earthengine-api)
- **Messaging**: Twilio WhatsApp API
- **Validation**: Pydantic v2

### Monorepo

- **Package manager**: pnpm workspaces

---

## APIs & External Services

| Service                       | Purpose                                                   | Required for                                        |
| ----------------------------- | --------------------------------------------------------- | --------------------------------------------------- |
| **Google Earth Engine (GEE)** | Sentinel-2 satellite data retrieval and index computation | Live satellite data (optional in demo mode)         |
| **Anthropic Claude API**      | Pak Tani AI agronomist responses (streaming)              | Pak Tani chat feature                               |
| **Twilio WhatsApp API**       | Sending task alerts to farmers via WhatsApp               | WhatsApp dispatch (degrades gracefully to demo log) |

All three services degrade gracefully — the app runs fully in demo mode without any API keys.

---

## Prerequisites

- **Node.js** 20+ and **pnpm** 9+
- **Python** 3.10+ and **uv** (Python package manager)
- A modern browser (Chrome / Firefox / Safari)

Install `uv` if you don't have it:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Install `pnpm` if you don't have it:

```bash
npm install -g pnpm
```

---

## Quick Start — Demo Mode (No API Keys)

This is the recommended path for judges. The demo runs entirely offline using pre-computed Sekinchan Season 2/2025 satellite data, with no GEE credentials required. Pak Tani still requires an Anthropic API key (see step 4 below); everything else works without any keys.

### 1. Clone the repository

```bash
git clone https://github.com/your-org/sawahsense.git
cd sawahsense
```

### 2. Install frontend dependencies

```bash
pnpm install
```

### 3. Install backend dependencies

```bash
cd backend
uv sync
cd ..
```

### 4. Configure environment variables

Create `frontend/.env.local`:

```bash
# Enable demo mode — uses pre-computed Sekinchan data, no GEE needed
NEXT_PUBLIC_DEMO=true

# Optional: set backend URL if running backend on a different port
# BACKEND_URL=http://127.0.0.1:8000
```

Create `backend/.env`:

```bash
# Required for Pak Tani AI chat
ANTHROPIC_API_KEY=sk-ant-...

# Demo mode — no real WhatsApp messages are sent (logged to console instead)
DEMO=true

# Leave GEE vars unset or empty in demo mode
# GEE_PROJECT_ID=
# GEE_SERVICE_ACCOUNT_EMAIL=
# GEE_PRIVATE_KEY=

# Leave Twilio vars unset or set to "test" for demo mode
# TWILIO_ACCOUNT_SID=test
# TWILIO_AUTH_TOKEN=test
# TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### 5. Start both services

**Terminal 1 — Backend:**

```bash
pnpm dev:backend
# FastAPI starts at http://127.0.0.1:8000
```

**Terminal 2 — Frontend:**

```bash
pnpm dev
# Next.js starts at http://localhost:3000
```

### 6. Open the application

Navigate to [http://localhost:3000](http://localhost:3000)

The demo loads with six pre-configured paddy fields from Sekinchan, Selangor (Season 2, September–December 2025), with the demo "clock" set to **November 4, 2025** — the most critical monitoring date.

---

## Full Setup — Live Mode (With API Keys)

To run with live Sentinel-2 satellite data retrieval, follow the demo steps above and add the additional credentials below.

### Google Earth Engine

1. Create a [Google Earth Engine](https://earthengine.google.com/) account and a Cloud project.
2. Create a Service Account with the **Earth Engine Resource Viewer** role.
3. Download the service account JSON key file.
4. Add to `backend/.env`:

```bash
GEE_PROJECT_ID=your-gcp-project-id
GEE_SERVICE_ACCOUNT_EMAIL=your-sa@your-project.iam.gserviceaccount.com
# Paste the private_key field from the JSON key (newlines as \n)
GEE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

5. Set `NEXT_PUBLIC_DEMO=false` in `frontend/.env.local` to switch the frontend to live mode.

### Twilio WhatsApp

1. Sign up at [twilio.com](https://www.twilio.com/) and enable the WhatsApp Sandbox.
2. Note your Account SID, Auth Token, and sandbox number.
3. Add to `backend/.env`:

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

> **Note:** In demo mode (`DEMO=true` or missing Twilio credentials), the WhatsApp endpoint logs the message to the server console and returns `{ "demo": true }` instead of making a real API call. All other features work identically.

---

## Environment Variables Reference

### `frontend/.env.local`

| Variable           | Required | Default                 | Description                                                        |
| ------------------ | -------- | ----------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_DEMO` | No       | `false`                 | Set `true` to use pre-computed demo data instead of live GEE calls |
| `BACKEND_URL`      | No       | `http://127.0.0.1:8000` | Override backend URL (used by Next.js API rewrites at build time)  |

### `backend/.env`

| Variable                    | Required               | Description                                                      |
| --------------------------- | ---------------------- | ---------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`         | **Yes** (for Pak Tani) | Claude API key for Pak Tani AI responses                         |
| `GEE_PROJECT_ID`            | No (demo mode)         | Google Cloud project ID registered with Earth Engine             |
| `GEE_SERVICE_ACCOUNT_EMAIL` | No (demo mode)         | GEE service account email                                        |
| `GEE_PRIVATE_KEY`           | No (demo mode)         | GEE service account private key (newlines as `\n`)               |
| `TWILIO_ACCOUNT_SID`        | No (demo mode)         | Twilio Account SID                                               |
| `TWILIO_AUTH_TOKEN`         | No (demo mode)         | Twilio Auth Token                                                |
| `TWILIO_WHATSAPP_FROM`      | No                     | Twilio WhatsApp sender number (default: `whatsapp:+14155238886`) |
| `DEMO`                      | No                     | Set `true` to skip real Twilio calls and log messages to console |

---

## Testing Guide for Judges

The demo is pre-loaded with agronomically accurate data for six adjacent paddy fields in Sekinchan, Selangor, Season 2 / Musim Kedua 2025. The demo clock is frozen at **November 4, 2025** (Day 62 — booting/early heading stage), the most critical monitoring window.

### Step 1 — Explore the field map

Open [http://localhost:3000](http://localhost:3000). You will see six colour-coded field polygons on the map:

- **Green** = healthy (Petak A, B, E)
- **Amber** = warning (Petak D, F)
- **Red** = critical (Petak C)

Click any field polygon or select it from the **Fields** tab in the left sidebar.

---

### Step 2 — Explore Pak Tani AI (requires Anthropic API key)

Click the **robot icon** (Pak Tani) tab at the bottom of the sidebar.

1. Select **Petak C** (critical — BLB). Ask:

   > _"What should I do about the BLB alert?"_

   Pak Tani will give step-by-step mitigation: drain field, apply copper hydroxide, isolate from shared irrigation, notify IADA BLS.

2. Select **Petak D** (warning — water stress). Ask:

   > _"Petak D looks green — why is there a warning?"_

   Pak Tani explains that NDVI/EVI are normal at 0.76/0.69 but LSWI dropped to 0.18 — 47% below the heading-stage minimum. The plant is internally dehydrated while still appearing visually green.

3. Try the **language toggle** (EN/BM) in the top navigation bar and ask the same question — Pak Tani responds in the selected language.

---

### Step 3 — The key demo moment (NDVI vs. LSWI)

1. Select **Petak D** from the Fields tab.
2. In the bottom panel, open the **Heatmap** view.
3. Select date **2025-11-04** in the date carousel.
4. Toggle between the **NDVI** and **LSWI** heatmap chips.
   - NDVI: Petak D is deep green — indistinguishable from healthy fields.
   - LSWI: Petak D is pale yellow while all surrounding fields are teal-blue.

This is the core argument: **a tool using only NDVI would have missed this completely.**

---

### Step 4 — Explore Alerts

Click the **bell icon** (Alerts) tab. Two active alerts are shown:

- **Petak C** — BLB outbreak (NDVI/EVI patch, SE quadrant, detected Oct 20)
- **Petak D** — LSWI collapse at heading (detected Nov 4)

Click either alert card to expand its detail and see the detected values vs. expected ranges.

---

### Step 5 — Create and dispatch a task via WhatsApp

1. In Pak Tani chat with Petak C selected, ask:

   > _"Can you create a scouting task for Petak C?"_

2. Switch to the **Tasks** tab (checkbox icon). A new task `Scouting & Semburan BLB — Petak C` will appear.

3. Click the task card and tap **Hantar WhatsApp** (Send WhatsApp). In demo mode, the message is logged to the backend terminal — no real SMS is sent.

---

### Step 6 — Time-series charts

Select any field and look at the bottom panel chart. Observe:

- **Petak F**: EVI dips uniformly in early October (nitrogen deficiency) then recovers after Oct 8 urea application — the curve shows a visible trough and recovery.
- **Petak C**: NDVI and EVI diverge from the healthy field trajectories starting Oct 20 (BLB onset).
- **Petak D**: NDVI and EVI remain flat while LSWI drops sharply on Nov 4.

Cloudy acquisition passes (e.g. Sep 15 at 72% cloud) are greyed out in the date carousel.

---

## Frequently Asked Questions

**"Is there a similar app for this?"**  
Yes — two exist, and SawahSense sits between them. **EOS Crop Monitoring** (European) offers satellite indices but is expensive and built for agronomists with deep technical training, not field farmers. **Rakan Tani AI** (Malaysian government) provides AI advice via WhatsApp but has no satellite monitoring at all. SawahSense bridges both: satellite intelligence delivered through a simple interface and WhatsApp, built for Malaysian farmers.

**"Is Pak Tani a generic chatbot?"**  
No. Pak Tani is agentic — it monitors your fields via satellite, fires alerts when indices fall below stage-calibrated thresholds, and then explains exactly what is wrong and what to do. Every response is grounded in a knowledge base (RAG) built from official Malaysian agriculture agencies including BERNAS, DOA, MARDI, and IADA. No hallucinations.

**"What satellite does it use?"**  
Sentinel-2, operated by the European Space Agency (ESA) and accessed via Google Earth Engine API. Free, publicly available, 10-metre resolution, 5-day revisit cycle.

**"Does it work for small farmers?"**  
Yes. The field drawing interface requires no GPS devices — just draw on the map. Pak Tani responds in Bahasa Malaysia. WhatsApp delivery means the farmer receives instructions without ever opening the app.

---
