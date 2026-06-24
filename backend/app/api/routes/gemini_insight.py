from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_db
from app.models.visitor import VisitorModel
from app.schemas.gemini_insight import GeminiInsightResponse
from app.engines.gemini_engine import generate_gemini_insight

router = APIRouter(prefix="/visitors", tags=["Gemini Insight"])

@router.post("/{visitor_id}/gemini-insight", response_model=GeminiInsightResponse)
async def get_gemini_insight(visitor_id: str):
    db = get_db()
    try:
        oid = ObjectId(visitor_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visitor id")

    visitor = await db[VisitorModel.collection_name].find_one({"_id": oid})
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    if not visitor.get("zodiac"):
        raise HTTPException(status_code=400, detail="Run /astrology first")

    try:
        insight = await generate_gemini_insight(visitor)
    except Exception as exc:
        print(f"[gemini] failed: {exc}")
        name = visitor.get("full_name", "Cosmic Traveler")
        sign = (visitor.get("zodiac") or {}).get("sign", "the stars")
        animal = (visitor.get("spirit_animal") or {}).get("animal", "your spirit guide")
        insight = f"Dear {name}, the cosmos has aligned to reveal your extraordinary path. As a child of {sign}, you carry the wisdom of {animal} within your soul. The universe has chosen this moment to illuminate your destiny and awaken the ancient power that flows through you. Step forward � your cosmic journey has only just begun."

    await db[VisitorModel.collection_name].update_one(
        {"_id": oid},
        {"$set": {"gemini_insight": insight}},
    )

    return GeminiInsightResponse(visitor_id=visitor_id, insight=insight)
