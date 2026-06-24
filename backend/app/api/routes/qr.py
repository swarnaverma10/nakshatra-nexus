from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId
from pydantic import BaseModel
from app.core.database import get_db
from app.core.config import settings
from app.models.visitor import VisitorModel
from app.engines.qr_engine import generate_qr_image
from app.services.cloudinary_service import upload_image

router = APIRouter(prefix="/visitors", tags=["QR"])

class QRResponse(BaseModel):
    visitor_id: str
    qr_url: str

@router.post("/{visitor_id}/qr", response_model=QRResponse)
async def generate_qr(visitor_id: str):
    db = get_db()
    try:
        oid = ObjectId(visitor_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visitor id")
    visitor = await db[VisitorModel.collection_name].find_one({"_id": oid})
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    frontend_url = settings.FRONTEND_URL.rstrip("/")
    qr_data = f"{frontend_url}/visitor/{visitor_id}"
    try:
        qr_bytes = generate_qr_image(qr_data)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"QR generation failed: {exc}")
    try:
        upload_result = upload_image(
            qr_bytes,
            folder="nakshatra-nexus/qrcodes",
            public_id=f"qr_{visitor_id}",
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"QR upload failed: {exc}")
    await db[VisitorModel.collection_name].update_one(
        {"_id": oid},
        {"$set": {"qr_url": upload_result["url"]}},
    )
    return QRResponse(visitor_id=visitor_id, qr_url=upload_result["url"])
