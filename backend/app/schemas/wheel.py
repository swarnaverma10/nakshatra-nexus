from pydantic import BaseModel
from typing import List


class WheelSegment(BaseModel):
    segment: str
    reward: str
    color: str
    icon: str


class WheelSpinResponse(BaseModel):
    visitor_id: str
    segment: str
    reward: str
    color: str
    icon: str
    spin_index: int
    total_segments: int


class WheelSegmentsResponse(BaseModel):
    segments: List[WheelSegment]