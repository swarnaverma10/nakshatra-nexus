from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings


class MongoDB:
    client: AsyncIOMotorClient | None = None
    db = None


mongodb = MongoDB()


async def connect_to_mongo():
    mongodb.client = AsyncIOMotorClient(settings.MONGODB_URI)
    mongodb.db = mongodb.client[settings.MONGODB_DB_NAME]
    # Sanity check
    await mongodb.client.admin.command("ping")
    print(f"[MongoDB] Connected to database: {settings.MONGODB_DB_NAME}")


async def close_mongo_connection():
    if mongodb.client:
        mongodb.client.close()
        print("[MongoDB] Connection closed")


def get_db():
    return mongodb.db
