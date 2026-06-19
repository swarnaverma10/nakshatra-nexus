from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    ENVIRONMENT: str = "development"
    APP_NAME: str = "Nakshatra Nexus API"
    API_PREFIX: str = "/api/v1"
    FRONTEND_URL: str = "http://localhost:5173"

    MONGODB_URI: str
    MONGODB_DB_NAME: str = "nakshatra_nexus"

    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    GEMINI_API_KEY: str = ""

    FLUX_API_KEY: str = ""
    FLUX_API_URL: str = "https://api.together.xyz/v1/images/generations"

    RESEND_API_KEY: str = ""
    RESEND_FROM_EMAIL: str = "Nakshatra Nexus <noreply@yourdomain.com>"

    SECRET_KEY: str = "changeme"


settings = Settings()
