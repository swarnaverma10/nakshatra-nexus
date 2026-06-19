from pydantic import BaseModel


class AvatarGenerateResponse(BaseModel):
    visitor_id: str
    avatar_url: str
