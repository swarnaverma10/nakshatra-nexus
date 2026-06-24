from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId
from app.core.database import get_db
from app.models.visitor import VisitorModel

router = APIRouter(prefix="/visitors", tags=["Profile"])


@router.get("/{visitor_id}/profile")
async def get_public_profile(visitor_id: str):
    db = get_db()

    try:
        oid = ObjectId(visitor_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visitor id")

    visitor = await db[VisitorModel.collection_name].find_one({"_id": oid})
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    return {
        "visitor_id": visitor_id,
        "full_name": visitor.get("full_name", "Cosmic Traveler"),
        "avatar_url": visitor.get("avatar_url", ""),
        "passport_url": visitor.get("passport_url", ""),
        "zodiac": visitor.get("zodiac", {}),
        "nakshatra": visitor.get("nakshatra", {}),
        "aura": visitor.get("aura", {}),
        "spirit_animal": visitor.get("spirit_animal", {}),
        "archetype": visitor.get("archetype", {}),
    }
