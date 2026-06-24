from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_db
from app.models.visitor import VisitorModel
from app.engines.passport_engine import generate_passport
from app.services.cloudinary_service import upload_image

router = APIRouter(prefix="/visitors", tags=["Passport"])


class PassportResponse(BaseModel):
    visitor_id: str
    passport_url: str


@router.post("/{visitor_id}/passport", response_model=PassportResponse)
async def create_passport(visitor_id: str):
    db = get_db()

    try:
        oid = ObjectId(visitor_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visitor id")

    visitor = await db[VisitorModel.collection_name].find_one({"_id": oid})
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    if visitor.get("passport_url"):
        return PassportResponse(
            visitor_id=visitor_id,
            passport_url=visitor["passport_url"],
        )

    try:
        passport_bytes = await generate_passport(visitor)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Passport generation failed: {exc}")

    try:
        upload_result = upload_image(
            passport_bytes,
            folder="nakshatra-nexus/passports",
            public_id=f"passport_{visitor_id}",
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Passport upload failed: {exc}")

    await db[VisitorModel.collection_name].update_one(
        {"_id": oid},
        {"$set": {"passport_url": upload_result["url"]}},
    )

    return PassportResponse(
        visitor_id=visitor_id,
        passport_url=upload_result["url"],
    )