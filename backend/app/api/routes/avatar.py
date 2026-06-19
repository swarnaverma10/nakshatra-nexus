from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_db
from app.models.visitor import VisitorModel
from app.schemas.avatar import AvatarGenerateResponse
from app.services.avatar_service import generate_avatar_from_selfie
from app.services.cloudinary_service import upload_image

router = APIRouter(prefix="/visitors", tags=["Avatar"])


@router.post("/{visitor_id}/avatar", response_model=AvatarGenerateResponse)
async def generate_avatar(visitor_id: str):
    db = get_db()

    try:
        oid = ObjectId(visitor_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visitor id")

    visitor = await db[VisitorModel.collection_name].find_one({"_id": oid})
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    if not visitor.get("selfie_url"):
        raise HTTPException(status_code=400, detail="Visitor has no selfie uploaded yet")

    try:
        image_bytes = await generate_avatar_from_selfie(visitor["selfie_url"])
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Avatar generation failed: {exc}")

    upload_result = upload_image(
        image_bytes,
        folder="nakshatra-nexus/avatars",
        public_id=f"avatar_{visitor_id}",
    )

    await db[VisitorModel.collection_name].update_one(
        {"_id": oid},
        {"$set": {"avatar_url": upload_result["url"]}},
    )

    return AvatarGenerateResponse(visitor_id=visitor_id, avatar_url=upload_result["url"])
