from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_db
from app.models.visitor import VisitorModel
from app.schemas.aura import AuraResponse
from app.engines.aura_engine import calculate_aura

router = APIRouter(prefix="/visitors", tags=["Aura"])


@router.post("/{visitor_id}/aura", response_model=AuraResponse)
async def reveal_aura(visitor_id: str):
    db = get_db()

    try:
        oid = ObjectId(visitor_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visitor id")

    visitor = await db[VisitorModel.collection_name].find_one({"_id": oid})
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    if not visitor.get("zodiac") or not visitor.get("nakshatra"):
        raise HTTPException(status_code=400, detail="Run /astrology first")

    result = calculate_aura(
        zodiac_sign=visitor["zodiac"]["sign"],
        nakshatra=visitor["nakshatra"]["nakshatra"],
    )

    await db[VisitorModel.collection_name].update_one(
        {"_id": oid},
        {"$set": {"aura": result}},
    )

    return AuraResponse(visitor_id=visitor_id, **result)