from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId
from pydantic import BaseModel
from app.core.database import get_db
from app.models.visitor import VisitorModel
from app.engines.email_engine import send_cosmic_passport_email
router = APIRouter(prefix="/visitors", tags=["Email"])
class EmailResponse(BaseModel):
    visitor_id: str
    sent: bool
    message: str
@router.post("/{visitor_id}/send-email", response_model=EmailResponse)
async def send_email(visitor_id: str):
    db = get_db()
    try:
        oid = ObjectId(visitor_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visitor id")
    visitor = await db[VisitorModel.collection_name].find_one({"_id": oid})
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    if not visitor.get("email"):
        raise HTTPException(status_code=400, detail="Visitor has no email address")
    sent = send_cosmic_passport_email(visitor)
    await db[VisitorModel.collection_name].update_one(
        {"_id": oid},
        {"$set": {"email_sent": sent}},
    )
    return EmailResponse(
        visitor_id=visitor_id,
        sent=sent,
        message="Email delivered successfully" if sent else "Email delivery failed",
    )
