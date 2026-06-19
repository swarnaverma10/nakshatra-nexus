from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_db
from app.schemas.visitor import VisitorCreate, VisitorResponse
from app.models.visitor import VisitorModel

router = APIRouter(prefix="/visitors", tags=["Visitors"])


@router.post("", response_model=VisitorResponse, status_code=201)
async def create_visitor(payload: VisitorCreate):
    db = get_db()
    document = VisitorModel.to_document(payload.model_dump())
    result = await db[VisitorModel.collection_name].insert_one(document)
    document["_id"] = result.inserted_id
    return VisitorModel.to_response(document)


@router.get("/{visitor_id}", response_model=VisitorResponse)
async def get_visitor(visitor_id: str):
    db = get_db()
    try:
        oid = ObjectId(visitor_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid visitor id")

    doc = await db[VisitorModel.collection_name].find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Visitor not found")
    return VisitorModel.to_response(doc)
