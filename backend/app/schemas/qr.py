from pydantic import BaseModel


class QRResponse(BaseModel):
    visitor_id: str
    qr_url: str
