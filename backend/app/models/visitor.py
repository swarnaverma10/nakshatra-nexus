from datetime import datetime, date, time
from bson import ObjectId

class VisitorModel:
    collection_name = "visitors"

    @staticmethod
    def to_document(data: dict) -> dict:
        return {
            "full_name": data["full_name"],
            "email": data["email"],
            "date_of_birth": data["date_of_birth"].isoformat() if isinstance(data["date_of_birth"], date) else data["date_of_birth"],
            "time_of_birth": data.get("time_of_birth", time(12,0,0)).isoformat() if isinstance(data.get("time_of_birth"), time) else data.get("time_of_birth", "12:00:00"),
            "place_of_birth": data["place_of_birth"],
            "selfie_url": data.get("selfie_url"),
            "avatar_url": data.get("avatar_url"),
            "zodiac": data.get("zodiac"),
            "nakshatra": data.get("nakshatra"),
            "aura": data.get("aura"),
            "spirit_animal": data.get("spirit_animal"),
            "archetype": data.get("archetype"),
            "wheel_result": data.get("wheel_result"),
            "gemini_insight": data.get("gemini_insight"),
            "passport_url": data.get("passport_url"),
            "qr_url": data.get("qr_url"),
            "email_sent": data.get("email_sent", False),
            "created_at": datetime.utcnow(),
        }

    @staticmethod
    def to_response(doc: dict) -> dict:
        return {
            "id": str(doc["_id"]),
            "full_name": doc["full_name"],
            "email": doc["email"],
            "date_of_birth": doc["date_of_birth"],
            "time_of_birth": doc.get("time_of_birth", "12:00:00"),
            "place_of_birth": doc["place_of_birth"],
            "selfie_url": doc.get("selfie_url"),
            "avatar_url": doc.get("avatar_url"),
            "created_at": doc["created_at"].isoformat() if isinstance(doc["created_at"], datetime) else doc["created_at"],
        }
