from pydantic import BaseModel


class EmailResponse(BaseModel):
    visitor_id: str
    sent: bool
    message: str
