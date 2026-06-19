from pydantic import BaseModel


class SelfieUploadResponse(BaseModel):
    visitor_id: str
    selfie_url: str
