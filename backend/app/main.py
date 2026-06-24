from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.routes import (
    profile,
    visitor, selfie, avatar, astrology,
    aura, spirit_animal, archetype, wheel,
    destiny_vault, gemini_insight, qr, email, passport,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "https://nakshatra-nexus.onrender.com",
        "https://nakshatra-nexus-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(visitor.router,        prefix=settings.API_PREFIX)
app.include_router(selfie.router,         prefix=settings.API_PREFIX)
app.include_router(avatar.router,         prefix=settings.API_PREFIX)
app.include_router(astrology.router,      prefix=settings.API_PREFIX)
app.include_router(aura.router,           prefix=settings.API_PREFIX)
app.include_router(spirit_animal.router,  prefix=settings.API_PREFIX)
app.include_router(archetype.router,      prefix=settings.API_PREFIX)
app.include_router(wheel.router,          prefix=settings.API_PREFIX)
app.include_router(destiny_vault.router,  prefix=settings.API_PREFIX)
app.include_router(gemini_insight.router, prefix=settings.API_PREFIX)
app.include_router(passport.router,       prefix=settings.API_PREFIX)
app.include_router(qr.router,             prefix=settings.API_PREFIX)
app.include_router(profile.router,        prefix=settings.API_PREFIX)
app.include_router(email.router,          prefix=settings.API_PREFIX)


@app.get("/")
async def root():
    return {"status": "ok", "service": settings.APP_NAME, "environment": settings.ENVIRONMENT}


@app.get(f"{settings.API_PREFIX}/health")
async def health_check():
    return {"status": "healthy"}
