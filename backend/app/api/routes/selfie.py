from fastapi import APIRouter, UploadFile, File, HTTPException
from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_db
from app.models.visitor import VisitorModel
from app.schemas.selfie import SelfieUploadResponse
from app.services.cloudinary_service import upload_image

router = APIRouter(prefix="/visitors", tags=["Selfie"])

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE_MB = 8


@router.post("/{visitor_id}/selfie", response_model=SelfieUploadResponse)
async def upload_selfie(visitor_id: str, file: UploadFile = File(...)):
    db = get_db()

    try:
        oid = ObjectId(visitor_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visitor id")

    visitor = await db[VisitorModel.collection_name].find_one({"_id": oid})
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, or WEBP images are allowed")

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large. Max {MAX_FILE_SIZE_MB}MB")

    upload_result = upload_image(
        file_bytes,
        folder="nakshatra-nexus/selfies",
        public_id=f"selfie_{visitor_id}",
    )

    await db[VisitorModel.collection_name].update_one(
        {"_id": oid},
        {"$set": {"selfie_url": upload_result["url"]}},
    )

    return SelfieUploadResponse(visitor_id=visitor_id, selfie_url=upload_result["url"])
