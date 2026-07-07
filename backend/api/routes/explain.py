"""
Explain router — Handles natural-language narration of credit score report.
Enforces architectural separation: LLM narrates, deterministic engine computes.
"""

from fastapi import APIRouter, HTTPException
from api.routes.applications import _get_evaluated_app
from explainer.narrator import narrator

router = APIRouter()


@router.post("/{application_id}")
def generate_explanation(application_id: str):
    """
    Generate a natural-language explanation of the scoring engine output.
    """
    # 1. Fetch evaluated application (calculates scores deterministically)
    app = _get_evaluated_app(application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    # 2. Narration (invokes Gemini or falls back to template programmatically)
    narration_result = narrator.narrate(app)

    return {
        "applicationId": application_id,
        "explanation": narration_result["explanation"],
        "model": narration_result["model"],
        "disclaimer": narration_result["disclaimer"]
    }
