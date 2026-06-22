from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_db
from app.models.visitor import VisitorModel
from app.schemas.spirit_animal import SpiritAnimalResponse
from app.engines.spirit_animal_engine import calculate_spirit_animal

router = APIRouter(prefix="/visitors", tags=["Spirit Animal"])


@router.post("/{visitor_id}/spirit-animal", response_model=SpiritAnimalResponse)
async def reveal_spirit_animal(visitor_id: str):
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

    result = calculate_spirit_animal(zodiac_sign=visitor["zodiac"]["sign"])
    result["zodiac_sign"] = visitor["zodiac"]["sign"]

    await db[VisitorModel.collection_name].update_one(
        {"_id": oid},
        {"$set": {"spirit_animal": result}},
    )

    return SpiritAnimalResponse(visitor_id=visitor_id, **result)