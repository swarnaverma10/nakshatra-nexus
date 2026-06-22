from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_db
from app.models.visitor import VisitorModel
from app.schemas.wheel import WheelSpinResponse, WheelSegmentsResponse
from app.engines.wheel_engine import spin_cosmic_wheel, get_all_segments

router = APIRouter(prefix="/visitors", tags=["Cosmic Wheel"])


@router.get("/wheel/segments", response_model=WheelSegmentsResponse)
async def get_wheel_segments():
    return WheelSegmentsResponse(segments=get_all_segments())


@router.post("/{visitor_id}/wheel/spin", response_model=WheelSpinResponse)
async def spin_wheel(visitor_id: str):
    db = get_db()

    try:
        oid = ObjectId(visitor_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visitor id")

    visitor = await db[VisitorModel.collection_name].find_one({"_id": oid})
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    result = spin_cosmic_wheel()

    await db[VisitorModel.collection_name].update_one(
        {"_id": oid},
        {"$set": {"wheel_result": result}},
    )

    return WheelSpinResponse(visitor_id=visitor_id, **result)