from pydantic import BaseModel


class SpiritAnimalResponse(BaseModel):
    visitor_id: str
    animal: str
    description: str
    power: str
    element: str
    zodiac_sign: str