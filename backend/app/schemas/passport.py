from pydantic import BaseModel


class PassportResponse(BaseModel):
    visitor_id: str
    passport_url: str