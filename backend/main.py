import os
import json
import logging
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import ee
import twilio
from twilio.rest import Client
import anthropic

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

class WhatsAppRequest(BaseModel):
    recipientName: str
    phoneNumber: str
    fieldName: str
    alertMessage: Optional[str] = None
    eviValue: Optional[float] = None
    ndviValue: Optional[float] = None
    stage: Optional[str] = None
    dayNum: Optional[int] = None

PAK_TANI_SYSTEM_PROMPT = """You are Pak Tani, a trusted agricultural advisor in the SawahSense app for Malaysian paddy farmers. Talk like a knowledgeable senior farmer or Jabatan Pertanian extension officer — warm, practical, never condescending.

You know: Malaysian paddy cultivation, NDVI/EVI/LSWI satellite indices explained simply, common pests (BPH/wereng, padi blast, sheath blight, tungro), fertiliser timing by stage (NPK, urea), MADA/KADA subsidy info, BERNAS procurement, Malaysian paddy varieties (MR219, MR263, MR284).

Rules:
- Match the farmer's language (Malay or English) naturally
- Always tie advice to their specific field situation — never give generic answers
- Keep responses under 120 words — farmers are busy people in the field
- When action is needed, say exactly what, where, and when
- Translate satellite index terms into plain farmer language (e.g. EVI = "kehijauan kanopi")
- For initial insights: lead with the most important observation, then give ONE specific action

Current field context is provided as JSON in every message."""

def init_ee():
    if not ee.data._credentials:
        project_id = os.getenv("GEE_PROJECT_ID")
        service_account_email = os.getenv("GEE_SERVICE_ACCOUNT_EMAIL")
        private_key = os.getenv("GEE_PRIVATE_KEY")
        
        if not project_id or not service_account_email or not private_key:
            return False
            
        private_key = private_key.replace('\\n', '\n')
        
        credentials = ee.ServiceAccountCredentials(
            service_account_email,
            key_data=private_key
        )
        ee.Initialize(credentials, project=project_id)
        return True
    return True

@app.post("/api/gee-indices")
async def gee_indices(request: GEEIndicesRequest):
    try:
        if not init_ee():
             raise HTTPException(status_code=503, detail="GEE credentials not configured")
        
        # Define field geometry
        field_geom = ee.Geometry.Polygon(request.geometry.coordinates)
        
        def calculate_indices(image):
            nir = image.select("B8")
            red = image.select("B4")
            blue = image.select("B2")
            swir = image.select("B11")
            
            ndvi = nir.subtract(red).divide(nir.add(red)).rename("NDVI")
            evi = image.expression(
                "2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))",
                {"NIR": nir, "RED": red, "BLUE": blue}
            ).rename("EVI")
            lswi = nir.subtract(swir).divide(nir.add(swir)).rename("LSWI")
            
            return image.addBands([ndvi, evi, lswi]).set("cloud_pct", image.get("CLOUDY_PIXEL_PERCENTAGE"))

        collection = (ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
                      .filterBounds(field_geom)
                      .filterDate(request.startDate, request.endDate)
                      .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 80))
                      .map(calculate_indices))
                      
        image_list = collection.toList(30)
        size = image_list.size().getInfo()
        
        time_series = []
        for i in range(size):
            img = ee.Image(image_list.get(i))
            date = ee.Date(img.get("system:time_start")).format("YYYY-MM-dd").getInfo()
            cloud_pct = img.get("CLOUDY_PIXEL_PERCENTAGE").getInfo()
            
            stats = img.select(["NDVI", "EVI", "LSWI"]).reduceRegion(
                reducer=ee.Reducer.mean(),
                geometry=field_geom,
                scale=10,
                maxPixels=1e9
            ).getInfo()
            
            time_series.append({
                "date": date,
                "ndvi": round(stats.get("NDVI"), 3) if stats.get("NDVI") is not None else None,
                "evi": round(stats.get("EVI"), 3) if stats.get("EVI") is not None else None,
                "lswi": round(stats.get("LSWI"), 3) if stats.get("LSWI") is not None else None,
                "cloudPct": round(cloud_pct) if cloud_pct else 0
            })
            
        latest_clear = None
        for p in reversed(time_series):
            if p["cloudPct"] < 40 and p["ndvi"] is not None:
                latest_clear = p
                break
                
        return {
            "fieldId": request.fieldId,
            "timeSeries": time_series,
            "latestIndices": {
                "ndvi": latest_clear["ndvi"],
                "evi": latest_clear["evi"],
                "lswi": latest_clear["lswi"]
            } if latest_clear else None,
            "source": "live"
        }
    except Exception as e:
        logger.error(f"GEE indices error: {e}")
        raise HTTPException(status_code=503, detail=f"GEE unavailable: {str(e)}")


@app.post("/api/pak-tani")
async def pak_tani(request: PakTaniRequest):
    try:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Anthropic API Key missing")
            
        client = anthropic.AsyncAnthropic(api_key=api_key)
        
        context_str = f"[KONTEKS LADANG: {json.dumps(request.fieldContext)}]"
        api_messages = []
        
        if request.mode == "initial_insight":
            api_messages = [{
                "role": "user",
                "content": f"{context_str}\n\nBerikan nasihat ringkas tentang keadaan semasa ladang ini. Fokus pada perkara paling penting yang perlu perhatian petani sekarang."
            }]
        else:
            for i, msg in enumerate(request.messages):
                content = f"{context_str}\n\n{msg.content}" if i == 0 else msg.content
                api_messages.append({
                    "role": msg.role,
                    "content": content
                })
                
        async def stream_generator():
            async with client.messages.stream(
                model="claude-3-5-sonnet-20241022",
                max_tokens=300,
                system=PAK_TANI_SYSTEM_PROMPT,
                messages=api_messages
            ) as stream:
                async for chunk in stream.text_stream:
                    yield chunk

        return StreamingResponse(stream_generator(), media_type="text/plain")
        
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
