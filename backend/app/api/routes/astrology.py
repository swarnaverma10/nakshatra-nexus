from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId
from datetime import date, time

from app.core.database import get_db
from app.models.visitor import VisitorModel
from app.schemas.astrology import AstrologyResponse
from app.engines.astrology_engine import calculate_full_astrology

router = APIRouter(prefix="/visitors", tags=["Astrology"])

@router.post("/{visitor_id}/astrology", response_model=AstrologyResponse)
async def calculate_astrology(visitor_id: str):
    db = get_db()

    try:
        oid = ObjectId(visitor_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visitor id")

    visitor = await db[VisitorModel.collection_name].find_one({"_id": oid})
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    birth_date = date.fromisoformat(visitor["date_of_birth"])
    birth_time = time.fromisoformat(visitor["time_of_birth"])
    place_of_birth = visitor.get("place_of_birth", "Delhi, India")

    try:
        result = calculate_full_astrology(
            birth_date=birth_date,
            birth_time=birth_time,
            place_of_birth=place_of_birth,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Astrology calculation failed: {exc}")

    await db[VisitorModel.collection_name].update_one(
        {"_id": oid},
        {"$set": {"zodiac": result["zodiac"], "nakshatra": result["nakshatra"]}},
    )

    return AstrologyResponse(visitor_id=visitor_id, **result)
