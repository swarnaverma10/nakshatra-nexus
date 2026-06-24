from pydantic import BaseModel, EmailStr, Field
from datetime import date, time
from typing import Optional

class VisitorCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    date_of_birth: date
    time_of_birth: Optional[time] = time(12, 0, 0)
    place_of_birth: str = Field(..., min_length=2, max_length=150)

class VisitorResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    date_of_birth: date
    time_of_birth: time
    place_of_birth: str
    selfie_url: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: str
