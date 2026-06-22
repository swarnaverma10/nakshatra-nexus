from pydantic import BaseModel


class GeminiInsightResponse(BaseModel):
    visitor_id: str
    insight: str