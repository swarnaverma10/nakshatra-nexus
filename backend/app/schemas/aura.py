from pydantic import BaseModel


class AuraResponse(BaseModel):
    visitor_id: str
    color: str
    hex: str
    meaning: str
    nakshatra_boost: str
    zodiac_sign: str
    nakshatra: str