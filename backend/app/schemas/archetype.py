from pydantic import BaseModel


class ArchetypeResponse(BaseModel):
    visitor_id: str
    archetype: str
    title: str
    description: str
    symbol: str
    deity: str
    nakshatra: str
