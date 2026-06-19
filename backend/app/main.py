from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.api.routes import visitor, selfie, avatar


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(visitor.router, prefix=settings.API_PREFIX)
app.include_router(selfie.router, prefix=settings.API_PREFIX)
app.include_router(avatar.router, prefix=settings.API_PREFIX)


@app.get("/")
async def root():
    return {"status": "ok", "service": settings.APP_NAME, "environment": settings.ENVIRONMENT}


@app.get(f"{settings.API_PREFIX}/health")
async def health_check():
    return {"status": "healthy"}
