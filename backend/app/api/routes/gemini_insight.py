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
        raise HTTPException(status_code=502, detail=f"Gemini API failed: {exc}")

    await db[VisitorModel.collection_name].update_one(
        {"_id": oid},
        {"$set": {"gemini_insight": insight}},
    )

    return GeminiInsightResponse(visitor_id=visitor_id, insight=insight)