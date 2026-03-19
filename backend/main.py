"""
FastAPI Application Entrypoint
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.database import connect_db, close_db
from api import sessions, upload, reviewer, audit


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    os.makedirs(settings.upload_dir, exist_ok=True)
    await connect_db()
    print(f"✅ Connected to MongoDB at {settings.mongodb_url}")
    yield
    # Shutdown
    await close_db()
    print("🔌 MongoDB connection closed")


app = FastAPI(
    title="Agentic AI Onboarding API",
    description=(
        "End-to-end AI agent pipeline for intelligent account opening and onboarding. "
        "Supports KYC, OCR, risk scoring, AML screening, and explainable AI decisions."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(sessions.router)
app.include_router(upload.router)
app.include_router(reviewer.router)
app.include_router(audit.router)


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "onboarding-api",
        "version": "1.0.0",
        "environment": settings.environment,
    }


@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "Agentic AI Onboarding API",
        "docs": "/docs",
        "health": "/health",
    }
