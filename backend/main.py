import hashlib
import logging
import os
import re
from pathlib import Path
from typing import List, Optional, Dict, Any, Union

import chromadb
import ee
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel
import twilio
from twilio.rest import Client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
BACKEND_DIR = Path(__file__).parent

load_dotenv()
load_dotenv(BACKEND_DIR / ".env")

MAX_COLLECTION_CLOUD_PCT = 80
PRIMARY_CLEAR_CLOUD_PCT = 20
HEATMAP_DIMENSIONS = 512
# Palettes mirror frontend INDEX_LEGENDS in map-container.tsx — keep in sync.
INDEX_VIS_PARAMS = {
    "ndvi": {
        "min": 0.0,
        "max": 1.0,
        "palette": ["8b0000", "d29922", "74c476", "3fb950", "1a7f37"],
    },
    "evi": {
        "min": 0.0,
        "max": 0.9,
        "palette": ["8b0000", "d29922", "74c476", "3fb950", "1a7f37"],
    },
    "lswi": {
        "min": -0.1,
        "max": 0.7,
        "palette": ["f85149", "d29922", "58a6ff", "2171b5", "084594"],
    },
}
PAK_TANI_CHROMA_PATH = BACKEND_DIR / "chroma_db"
PAK_TANI_COLLECTION = "paddy_knowledge"
PAK_TANI_EMBED_MODEL = "text-embedding-3-small"
PAK_TANI_CHAT_MODEL = "gpt-4.1"
PAK_TANI_TOP_K = 4
PAK_TANI_FALLBACK_DIMENSIONS = 1536

app = FastAPI(title="SawahSense Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Geometry(BaseModel):
    type: str
    coordinates: List[Any]

class GEEIndicesRequest(BaseModel):
    fieldId: str
    geometry: Geometry
    startDate: str
    endDate: str

class MessageItem(BaseModel):
    role: str
    content: str

class PakTaniRequest(BaseModel):
    fieldContext: Dict[str, Any]
    mode: str
    messages: List[MessageItem]
    lang: Optional[str] = None

class PakTaniResponse(BaseModel):
    reply: str
    sources: List[str]

class WhatsAppRequest(BaseModel):
    recipientName: str
    phoneNumber: str
    fieldName: str
    alertMessage: Optional[str] = None
    eviValue: Optional[float] = None
    ndviValue: Optional[float] = None
    stage: Optional[str] = None
    dayNum: Optional[Union[int, str]] = None

PAK_TANI_SYSTEM_PROMPT = """
Kamu Pak Tani — kawan petani padi di SawahSense. Mesra, santai, macam sembang dengan jiran.

Cara jawab:
- SENTIASA jawab dalam Bahasa Malaysia, walaupun soalan dalam bahasa lain.
- Pendek dan padat. 2–4 ayat sudah cukup. Elakkan ayat panjang berjela.
- Nada mesra: guna "abang", "kita", "jom" bila sesuai. Senyum dalam tulisan.
- Jawab berdasarkan KONTEKS yang diberi sahaja. Kalau tak tahu, terus terang cakap "saya tak pasti" dan minta rujuk pegawai pertanian tempatan atau MARDI.
- Bagi langkah ringkas (boleh guna senarai bullet pendek) jika perlu.
- Jangan mengarang nombor dos baja/racun. Jangan diagnosis penyakit tanpa pemeriksaan fizikal.
""".strip()


def normalize_api_key(value: str | None) -> str | None:
    if not value:
        return None
    lowered = value.strip().lower()
    if "your_" in lowered and lowered.endswith("_here"):
        return None
    return value


pak_tani_openai_api_key = normalize_api_key(os.getenv("OPENAI_API_KEY"))
pak_tani_oai = OpenAI(api_key=pak_tani_openai_api_key) if pak_tani_openai_api_key else None
pak_tani_chroma = chromadb.PersistentClient(path=str(PAK_TANI_CHROMA_PATH))
pak_tani_collection = pak_tani_chroma.get_or_create_collection(
    name=PAK_TANI_COLLECTION,
    metadata={"hnsw:space": "cosine"},
)


def pak_tani_fallback_embed(text: str) -> list[float]:
    vector: list[float] = []
    counter = 0
    while len(vector) < PAK_TANI_FALLBACK_DIMENSIONS:
        digest = hashlib.sha256(f"{text}:{counter}".encode("utf-8")).digest()
        for byte in digest:
            vector.append((byte / 127.5) - 1.0)
            if len(vector) == PAK_TANI_FALLBACK_DIMENSIONS:
                break
        counter += 1
    return vector


def pak_tani_embed_query(text: str) -> list[float]:
    if pak_tani_oai is None:
        return pak_tani_fallback_embed(text)
    response = pak_tani_oai.embeddings.create(
        input=text,
        model=PAK_TANI_EMBED_MODEL,
    )
    return response.data[0].embedding


def pak_tani_format_context(context: str, question: str) -> str:
    return (
        "Konteks daripada pangkalan ilmu pertanian:\n"
        f"```\n{context}\n```\n\n"
        f"Soalan petani: {question}"
    )


def pak_tani_fallback_reply(question: str, context: str, sources: list[str]) -> str:
    query_terms = set(re.findall(r"\w+", question.lower()))
    candidate_lines = []
    for line in context.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        score = len(query_terms & set(re.findall(r"\w+", stripped.lower())))
        if "urea" in question.lower() and "urea" in stripped.lower():
            score += 8
        if "blas" in question.lower() and "blas" in stripped.lower():
            score += 8
        if score > 0:
            candidate_lines.append((score, stripped))

    candidate_lines.sort(key=lambda item: item[0], reverse=True)
    short_lead = "\n".join(line for _, line in candidate_lines[:6])
    source_note = ", ".join(sources) if sources else "pangkalan ilmu"
    if not short_lead:
        return (
            "Saya belum ada konteks yang cukup untuk jawab dengan yakin. "
            "Sila semak semula pangkalan ilmu atau rujuk pegawai pertanian tempatan."
        )
    return (
        f"Berdasarkan {source_note}, perkara paling relevan untuk soalan \"{question}\" ialah:\n\n"
        f"{short_lead}\n\n"
        "Saya sedang berjalan dalam mod tempatan tanpa kunci API penuh, jadi jawapan ini diringkaskan terus daripada konteks yang ditemui."
    )


def pak_tani_build_reply(
    question: str,
    history: list[MessageItem],
    context: str,
    sources: list[str],
) -> str:
    if pak_tani_oai is None:
        return pak_tani_fallback_reply(question, context, sources)

    history_msgs = [{"role": item.role, "content": item.content} for item in history]
    response = pak_tani_oai.responses.create(
        model=PAK_TANI_CHAT_MODEL,
        instructions=PAK_TANI_SYSTEM_PROMPT,
        input=history_msgs + [{
            "role": "user",
            "content": pak_tani_format_context(context, question),
        }],
        max_output_tokens=1024,
    )
    return response.output_text


def pak_tani_keyword_search(question: str) -> tuple[str, list[str]]:
    payload = pak_tani_collection.get(include=["documents", "metadatas"])
    documents = payload.get("documents", [])
    metadatas = payload.get("metadatas", [])
    if not documents:
        return "", []

    query_terms = set(re.findall(r"\w+", question.lower()))
    scored: list[tuple[int, str, dict]] = []
    for document, metadata in zip(documents, metadatas):
        doc_terms = set(re.findall(r"\w+", document.lower()))
        score = len(query_terms & doc_terms)
        if question.lower() in document.lower():
            score += 5
        if "urea" in question.lower() and "urea" in document.lower():
            score += 8
        if "blas" in question.lower() and "blas" in document.lower():
            score += 8
        if "baja" in question.lower() and "baja" in document.lower():
            score += 4
        scored.append((score, document, metadata))

    scored.sort(key=lambda item: item[0], reverse=True)
    top = [item for item in scored[:PAK_TANI_TOP_K] if item[0] > 0] or scored[:PAK_TANI_TOP_K]
    return (
        "\n\n---\n\n".join(item[1] for item in top),
        list(dict.fromkeys(item[2]["source"] for item in top)),
    )


def pak_tani_retrieve_context(question: str) -> tuple[str, list[str]]:
    if pak_tani_oai is None:
        return pak_tani_keyword_search(question)

    results = pak_tani_collection.query(
        query_embeddings=[pak_tani_embed_query(question)],
        n_results=PAK_TANI_TOP_K,
        include=["documents", "metadatas"],
    )
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    sources = list(dict.fromkeys(item["source"] for item in metadatas)) if metadatas else []
    return "\n\n---\n\n".join(documents), sources

def compute_polygon_bounds(coordinates):
    """Polygon coords [[ [lng, lat], ... ]] -> [[south, west], [north, east]]."""
    ring = coordinates[0]
    lngs = [pt[0] for pt in ring]
    lats = [pt[1] for pt in ring]
    return [[min(lats), min(lngs)], [max(lats), max(lngs)]]


def compute_index_bands(image):
    nir = image.select("B8").multiply(0.0001)
    red = image.select("B4").multiply(0.0001)
    blue = image.select("B2").multiply(0.0001)
    swir = image.select("B11").multiply(0.0001)

    ndvi = nir.subtract(red).divide(nir.add(red)).rename("NDVI")
    evi = image.expression(
        "2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))",
        {"NIR": nir, "RED": red, "BLUE": blue},
    ).rename("EVI")
    lswi = nir.subtract(swir).divide(nir.add(swir)).rename("LSWI")
    return {"ndvi": ndvi, "evi": evi, "lswi": lswi}


def make_heatmap_url(index_image, geom, vis):
    visualized = index_image.clip(geom).visualize(
        min=vis["min"],
        max=vis["max"],
        palette=vis["palette"],
    )
    return visualized.getThumbURL({
        "region": geom,
        "dimensions": HEATMAP_DIMENSIONS,
        "format": "png",
    })


def init_ee():
    try:
        ee.data.getAssetRoots()
        return True
    except Exception:
        project_id = os.getenv("GEE_PROJECT_ID")
        service_account_email = os.getenv("GEE_SERVICE_ACCOUNT_EMAIL")
        private_key = os.getenv("GEE_PRIVATE_KEY")

        if not project_id or not service_account_email or not private_key:
            return False

        private_key = private_key.replace("\\n", "\n")
        credentials = ee.ServiceAccountCredentials(
            service_account_email,
            key_data=private_key,
        )
        ee.Initialize(credentials, project=project_id)
        ee.data.getAssetRoots()
        return True

@app.post("/api/gee-indices")
async def gee_indices(request: GEEIndicesRequest):
    try:
        if not init_ee():
            raise HTTPException(status_code=503, detail="GEE credentials not configured")

        field_geom = ee.Geometry.Polygon(request.geometry.coordinates)

        def per_image_feature(image):
            bands = compute_index_bands(image)
            stats = bands["ndvi"].addBands([bands["evi"], bands["lswi"]]).reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=field_geom,
                scale=20,
                maxPixels=1e9,
                bestEffort=True,
            )
            return ee.Feature(None, {
                "date": ee.Date(image.get("system:time_start")).format("YYYY-MM-dd"),
                "ndvi": stats.get("NDVI"),
                "evi": stats.get("EVI"),
                "lswi": stats.get("LSWI"),
                "cloudPct": image.get("CLOUDY_PIXEL_PERCENTAGE"),
            })

        collection = (
            ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
            .filterBounds(field_geom)
            .filterDate(request.startDate, request.endDate)
            .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", MAX_COLLECTION_CLOUD_PCT))
            .sort("system:time_start", False)
            .limit(16)
        )

        feature_collection = collection.map(per_image_feature).getInfo()
        items = feature_collection.get("features", [])

        time_series = []
        for feat in items:
            props = feat.get("properties", {}) or {}
            ndvi = props.get("ndvi")
            evi = props.get("evi")
            lswi = props.get("lswi")
            cloud_pct = props.get("cloudPct")
            time_series.append({
                "date": props.get("date"),
                "ndvi": round(ndvi, 3) if ndvi is not None else None,
                "evi": round(evi, 3) if evi is not None else None,
                "lswi": round(lswi, 3) if lswi is not None else None,
                "cloudPct": round(cloud_pct) if cloud_pct is not None else 0,
            })

        if not time_series:
            return {
                "fieldId": request.fieldId,
                "timeSeries": [],
                "latestIndices": None,
                "source": "live",
            }

        latest_clear = next(
            (
                point for point in time_series
                if point["cloudPct"] <= PRIMARY_CLEAR_CLOUD_PCT and point["ndvi"] is not None
            ),
            None,
        )
        latest_point = latest_clear or next(
            (point for point in time_series if point["ndvi"] is not None),
            None,
        )

        heatmap_urls = None
        heatmap_bounds = None
        if latest_point:
            try:
                target_date = latest_point["date"]
                next_day = ee.Date(target_date).advance(1, "day")
                heatmap_image = ee.Image(
                    collection.filterDate(target_date, next_day).first()
                )
                bands = compute_index_bands(heatmap_image)
                heatmap_urls = {
                    key: make_heatmap_url(bands[key], field_geom, INDEX_VIS_PARAMS[key])
                    for key in ("ndvi", "evi", "lswi")
                }
                heatmap_bounds = compute_polygon_bounds(request.geometry.coordinates)
            except Exception as exc:
                logger.warning(f"Heatmap generation failed for {request.fieldId}: {exc}")

        return {
            "fieldId": request.fieldId,
            "timeSeries": time_series,
            "latestIndices": {
                "ndvi": latest_point["ndvi"],
                "evi": latest_point["evi"],
                "lswi": latest_point["lswi"],
            } if latest_point else None,
            "heatmapUrls": heatmap_urls,
            "heatmapBounds": heatmap_bounds,
            "heatmapDate": latest_point["date"] if latest_point else None,
            "source": "live"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"GEE indices error: {e}")
        raise HTTPException(status_code=503, detail=f"GEE unavailable: {str(e)}")


@app.post("/api/pak-tani", response_model=PakTaniResponse)
async def pak_tani(request: PakTaniRequest):
    try:
        if request.mode == "initial_insight":
            field_name = request.fieldContext.get("fieldName", "ladang ini")
            stage = request.fieldContext.get("stage")
            alert = request.fieldContext.get("alert")
            prompt_parts = [f"Beri nasihat ringkas untuk {field_name}."]
            if stage:
                prompt_parts.append(f"Peringkat semasa: {stage}.")
            if alert:
                prompt_parts.append(f"Amaran semasa: {alert}.")
            prompt_parts.append("Fokus pada tindakan paling penting hari ini.")
            question = " ".join(prompt_parts)
            history: list[MessageItem] = []
        else:
            if not request.messages:
                raise HTTPException(status_code=400, detail="messages is required")
            question = request.messages[-1].content
            history = request.messages[:-1]

        context, sources = pak_tani_retrieve_context(question)
        if not context:
            raise HTTPException(
                status_code=500,
                detail="Pak Tani knowledge base is empty. Run backend/ingest.py first.",
            )

        reply = pak_tani_build_reply(question, history, context, sources)
        return PakTaniResponse(reply=reply, sources=sources)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Pak Tani API error: {e}")
        raise HTTPException(status_code=500, detail="Pak Tani tidak dapat dihubungi sekarang.")

@app.post("/api/send-whatsapp")
async def send_whatsapp(request: WhatsAppRequest):
    try:
        if not request.phoneNumber or not request.recipientName or not request.fieldName:
            raise HTTPException(status_code=400, detail="Missing required fields")
            
        alert_msg = request.alertMessage or ""
        evi_val = request.eviValue if request.eviValue is not None else "N/A"
        ndvi_val = request.ndviValue if request.ndviValue is not None else "N/A"
        stage_val = request.stage or "N/A"
        day_val = request.dayNum if request.dayNum is not None else "N/A"
        
        message_body = (
            f"{request.recipientName}, sila pergi semak {request.fieldName} hari ini. {alert_msg} "
            f"Fokus kawasan yang menunjukkan perubahan terbesar.\n\n"
            f"📊 EVI: {evi_val} | NDVI: {ndvi_val}\n"
            f"🗓 Peringkat: {stage_val}, Hari {day_val}\n\n"
            f"— SawahSense 🌾"
        )
        
        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        from_phone = os.getenv("TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886")
        
        if not account_sid or account_sid == "test" or not auth_token or auth_token == "test":
            logger.info(f"[Demo] WhatsApp message would be sent to: {request.phoneNumber}")
            logger.info(f"[Demo] Message: {message_body}")
            return {
                "success": True,
                "demo": True,
                "message": "Demo mode - message simulated",
                "recipient": request.phoneNumber
            }
            
        client = Client(account_sid, auth_token)
        to_phone = request.phoneNumber if request.phoneNumber.startswith("whatsapp:") else f"whatsapp:{request.phoneNumber}"
        
        message = client.messages.create(
            from_=from_phone,
            body=message_body,
            to=to_phone
        )
        
        return {
            "success": True,
            "messageSid": message.sid
        }
        
    except Exception as e:
        logger.error(f"WhatsApp send error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
