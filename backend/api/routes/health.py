"""Health check router."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():
    """Liveness probe."""
    return {"status": "ok", "service": "prism-ai-api"}
