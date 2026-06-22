from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_db
from app.models.visitor import VisitorModel
from app.schemas.archetype import ArchetypeResponse
from app.engines.archetype_engine import calculate_archetype

router = APIRouter(prefix="/visitors", tags=["Archetype"])


@router.post("/{visitor_id}/archetype", response_model=ArchetypeResponse)
async def reveal_archetype(visitor_id: str):
    db = get_db()

    try:
        oid = ObjectId(visitor_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visitor id")

    visitor = await db[VisitorModel.collection_name].find_one({"_id": oid})
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    if not visitor.get("nakshatra"):
        raise HTTPException(status_code=400, detail="Run /astrology first")

    result = calculate_archetype(nakshatra=visitor["nakshatra"]["nakshatra"])
    result["nakshatra"] = visitor["nakshatra"]["nakshatra"]

    await db[VisitorModel.collection_name].update_one(
        {"_id": oid},
        {"$set": {"archetype": result}},
    )

    return ArchetypeResponse(visitor_id=visitor_id, **result)
