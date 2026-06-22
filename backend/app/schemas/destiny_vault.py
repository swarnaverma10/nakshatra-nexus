from pydantic import BaseModel


class DestinyVaultResponse(BaseModel):
    visitor_id: str
    destiny_message: str
    power_mantra: str
    lucky_number: int
    lucky_color: str
    lucky_gem: str
    cosmic_mission: str
    past_life: str
    future_prophecy: str
    zodiac_sign: str