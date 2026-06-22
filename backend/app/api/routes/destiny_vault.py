from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_db
from app.models.visitor import VisitorModel
from app.schemas.destiny_vault import DestinyVaultResponse
from app.engines.destiny_vault_engine import calculate_destiny_vault

router = APIRouter(prefix="/visitors", tags=["Destiny Vault"])


@router.post("/{visitor_id}/destiny-vault", response_model=DestinyVaultResponse)
async def reveal_destiny_vault(visitor_id: str):
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

    result = calculate_destiny_vault(zodiac_sign=visitor["zodiac"]["sign"])
    result["zodiac_sign"] = visitor["zodiac"]["sign"]

    await db[VisitorModel.collection_name].update_one(
        {"_id": oid},
        {"$set": {"destiny_vault": result}},
    )

    return DestinyVaultResponse(visitor_id=visitor_id, **result)