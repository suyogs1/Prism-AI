"""
Prism AI — FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.database import create_db_and_tables
from api.routes import applications, scoring, documents, explain, health

app = FastAPI(
    title="Prism AI API",
    description="AI-powered Credit Decisioning Assistant for MSME lending",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health.router,       prefix="/api",              tags=["health"])
app.include_router(applications.router, prefix="/api/applications", tags=["applications"])
app.include_router(scoring.router,      prefix="/api/scoring",      tags=["scoring"])
app.include_router(documents.router,    prefix="/api/documents",    tags=["documents"])
app.include_router(explain.router,      prefix="/api/explain",      tags=["explain"])

# ── Root ──────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "service": "Prism AI API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/api/docs",
    }
