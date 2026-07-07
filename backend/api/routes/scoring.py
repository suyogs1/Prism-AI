"""
Scoring router — returns the computed ScoreReport from the Decision Engine.
"""

from fastapi import APIRouter, HTTPException
from api.routes.applications import _get_evaluated_app

router = APIRouter()


@router.post("/{application_id}/compute")
def compute_score(application_id: str):
    """Trigger the scoring engine computation."""
    app = _get_evaluated_app(application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app["decision"]


@router.get("/{application_id}/report")
def get_score_report(application_id: str):
    """Retrieve the latest score report containing Decision Engine JSON."""
    app = _get_evaluated_app(application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app["decision"]
