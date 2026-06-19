from pydantic import BaseModel


class ZodiacInfo(BaseModel):
    sign: str
    degree: float


class NakshatraInfo(BaseModel):
    nakshatra: str
    lord: str
    pada: int
    degree: float


class AstrologyResponse(BaseModel):
    visitor_id: str
    zodiac: ZodiacInfo
    nakshatra: NakshatraInfo
