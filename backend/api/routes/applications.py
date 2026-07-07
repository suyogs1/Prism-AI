"""
Applications router — Evaluates MSME profiles using the Prism Decision Engine
and returns the dynamic JSON scoring.
"""

from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from engine.orchestrator import PrismDecisionEngine

router = APIRouter()
engine = PrismDecisionEngine()

# ── Raw MSME profiles on which the Decision Engine runs ────────────────────────
MSME_PROFILES = {
    "PRZ-2024-001": {
        "id": "PRZ-2024-001",
        "businessName": "Sharma Textiles Pvt Ltd",
        "ownerName": "Rajesh Sharma",
        "sector": "Textile Manufacturing",
        "location": "Surat, Gujarat",
        "submittedAt": "2024-01-15T09:30:00Z",
        # Sizing / Finance inputs
        "monthly_revenue": 500000.0,
        "monthly_expenses": 300000.0,
        "average_bank_balance": 800000.0,
        "existing_loans_monthly_emi": 20000.0,
        "revenue_growth_percentage": 15.0,
        "business_age": 5.2,
        "epfo_regular": True,
        "gst_regular": True,
        "customer_concentration": 15.0,
        "supplier_dependency": 20.0,
        "bounce_rate": 0.0,
        "existing_loans_balance": 150000.0,
        "turnover": 6000000.0,
        # Evidence inputs
        "bank_statements_present": True,
        "gst_present": True,
        "epfo_present": True,
        "upi_present": True,
        "relationship_present": True,
        "requested_loan_amount": 1200000.0,
    },
    "PRZ-2024-002": {
        "id": "PRZ-2024-002",
        "businessName": "Priya Foods & Catering",
        "ownerName": "Priya Nair",
        "sector": "Food & Beverages",
        "location": "Kochi, Kerala",
        "submittedAt": "2024-01-14T14:15:00Z",
        # Sizing / Finance inputs
        "monthly_revenue": 300000.0,
        "monthly_expenses": 220000.0,
        "average_bank_balance": 350000.0,
        "existing_loans_monthly_emi": 15000.0,
        "revenue_growth_percentage": 5.0,
        "business_age": 2.5,
        "epfo_regular": True,
        "gst_regular": True,
        "customer_concentration": 45.0,
        "supplier_dependency": 20.0,
        "bounce_rate": 2.0,
        "existing_loans_balance": 100000.0,
        "turnover": 3600000.0,
        # Evidence inputs
        "bank_statements_present": True,
        "gst_present": True,
        "epfo_present": False,
        "upi_present": False,
        "relationship_present": False,
        "requested_loan_amount": 500000.0,
    },
    "PRZ-2024-003": {
        "id": "PRZ-2024-003",
        "businessName": "MetalWorks Fabrication",
        "ownerName": "Suresh Kumar",
        "sector": "Metal Fabrication",
        "location": "Pune, Maharashtra",
        "submittedAt": "2024-01-13T11:00:00Z",
        # Sizing / Finance inputs
        "monthly_revenue": 200000.0,
        "monthly_expenses": 210000.0,
        "average_bank_balance": 10000.0,
        "existing_loans_monthly_emi": 40000.0,
        "revenue_growth_percentage": -10.0,
        "business_age": 0.8,
        "epfo_regular": False,
        "gst_regular": False,
        "customer_concentration": 55.0,
        "supplier_dependency": 65.0,
        "bounce_rate": 8.0,
        "existing_loans_balance": 300000.0,
        "turnover": 2400000.0,
        # Evidence inputs
        "bank_statements_present": False,
        "gst_present": False,
        "epfo_present": False,
        "upi_present": False,
        "relationship_present": False,
        "requested_loan_amount": 600000.0,
    },
    "PRZ-2024-004": {
        "id": "PRZ-2024-004",
        "businessName": "TechBridge Solutions",
        "ownerName": "Ananya Singh",
        "sector": "IT Services",
        "location": "Bengaluru, Karnataka",
        "submittedAt": "2024-01-12T09:00:00Z",
        "monthly_revenue": 450000.0,
        "monthly_expenses": 280000.0,
        "average_bank_balance": 520000.0,
        "existing_loans_monthly_emi": 20000.0,
        "revenue_growth_percentage": 22.0,
        "business_age": 3.2,
        "epfo_regular": True,
        "gst_regular": True,
        "customer_concentration": 25.0,
        "supplier_dependency": 15.0,
        "bounce_rate": 1.0,
        "existing_loans_balance": 150000.0,
        "turnover": 5400000.0,
        "bank_statements_present": True,
        "gst_present": True,
        "epfo_present": True,
        "upi_present": True,
        "relationship_present": False,
        "requested_loan_amount": 800000.0,
    },
    "PRZ-2024-005": {
        "id": "PRZ-2024-005",
        "businessName": "Green Harvest Agro",
        "ownerName": "Mohan Reddy",
        "sector": "Agriculture & Allied",
        "location": "Hyderabad, Telangana",
        "submittedAt": "2024-01-11T16:45:00Z",
        "monthly_revenue": 280000.0,
        "monthly_expenses": 210000.0,
        "average_bank_balance": 310000.0,
        "existing_loans_monthly_emi": 18000.0,
        "revenue_growth_percentage": 8.0,
        "business_age": 5.0,
        "epfo_regular": True,
        "gst_regular": True,
        "customer_concentration": 35.0,
        "supplier_dependency": 25.0,
        "bounce_rate": 3.0,
        "existing_loans_balance": 120000.0,
        "turnover": 3360000.0,
        "bank_statements_present": True,
        "gst_present": True,
        "epfo_present": False,
        "upi_present": False,
        "relationship_present": True,
        "requested_loan_amount": 650000.0,
    },
    "PRZ-2024-006": {
        "id": "PRZ-2024-006",
        "businessName": "Nova Logistics & Packaging",
        "ownerName": "Vikram Mehta",
        "sector": "Transport & Logistics",
        "location": "Indore, Madhya Pradesh",
        "submittedAt": "2024-01-10T14:20:00Z",
        "monthly_revenue": 620000.0,
        "monthly_expenses": 410000.0,
        "average_bank_balance": 680000.0,
        "existing_loans_monthly_emi": 35000.0,
        "revenue_growth_percentage": 15.0,
        "business_age": 4.1,
        "epfo_regular": True,
        "gst_regular": True,
        "customer_concentration": 20.0,
        "supplier_dependency": 30.0,
        "bounce_rate": 1.5,
        "existing_loans_balance": 250000.0,
        "turnover": 7440000.0,
        "bank_statements_present": True,
        "gst_present": True,
        "epfo_present": True,
        "upi_present": False,
        "relationship_present": True,
        "requested_loan_amount": 1500000.0,
    },
    "PRZ-2024-007": {
        "id": "PRZ-2024-007",
        "businessName": "Aura Healthcare & Diagnostics",
        "ownerName": "Dr. Sneha Patel",
        "sector": "Healthcare Services",
        "location": "Ahmedabad, Gujarat",
        "submittedAt": "2024-01-09T11:15:00Z",
        "monthly_revenue": 510000.0,
        "monthly_expenses": 360000.0,
        "average_bank_balance": 440000.0,
        "existing_loans_monthly_emi": 25000.0,
        "revenue_growth_percentage": 11.0,
        "business_age": 2.8,
        "epfo_regular": True,
        "gst_regular": True,
        "customer_concentration": 15.0,
        "supplier_dependency": 20.0,
        "bounce_rate": 2.0,
        "existing_loans_balance": 180000.0,
        "turnover": 6120000.0,
        "bank_statements_present": True,
        "gst_present": False,
        "epfo_present": True,
        "upi_present": True,
        "relationship_present": True,
        "requested_loan_amount": 1000000.0,
    }
}


def _get_evaluated_app(app_id: str) -> dict:
    """Helper to evaluate profile dynamically using Decision Engine."""
    profile = MSME_PROFILES.get(app_id)
    if not profile:
        return None

    # Evaluate using the Decision Engine
    decision = engine.evaluate(profile)

    # Return combined data containing application meta & Decision Engine scores
    return {
        "id": profile["id"],
        "businessName": profile["businessName"],
        "ownerName": profile["ownerName"],
        "sector": profile["sector"],
        "location": profile["location"],
        "submittedAt": profile["submittedAt"],
        "loanAmount": profile["requested_loan_amount"],
        
        # Values from Decision Engine
        "prismScore": decision["overall_score"],
        "riskTier": "GREEN" if decision["overall_score"] >= 75 else "AMBER" if decision["overall_score"] >= 50 else "RED",
        "confidence": "HIGH" if decision["confidence"] >= 70 else "MEDIUM" if decision["confidence"] >= 40 else "LOW",
        "status": "PENDING_REVIEW" if decision["recommendation"] == "REQUEST_EVIDENCE" else "UNDER_REVIEW" if decision["recommendation"] == "REVIEW" else "APPROVED" if decision["recommendation"] == "APPROVE" else "ADDITIONAL_DOCS",
        
        "subScores": {
            "gst": decision["financial_health_card"]["trust"], # mapping for legacy UI subScores compatibility
            "cashflow": decision["financial_health_card"]["cash_flow"],
            "stability": decision["financial_health_card"]["trust"],
            "digital": decision["financial_health_card"]["growth"],
            "repayment": decision["financial_health_card"]["risk"]
        },
        "recommendedLoan": decision["recommended_loan_amount"],
        "missingData": decision["missing_evidence"],
        
        # Include raw decision object
        "decision": decision,
        
        # Include original profile inputs
        "profile": profile,
        
        # Include original inputs for preview/signals
        "signals": {
            "avgMonthlyTurnover": profile["monthly_revenue"],
            "filingGaps": 0 if profile["gst_regular"] else 3,
            "businessAge": profile["business_age"],
            "bounceRate": profile["bounce_rate"] / 100.0,
            "udyamRegistered": profile["relationship_present"]
        }
    }


# ── Endpoints ──────────────────────────────────────────────────────────────────
@router.get("")
def list_applications():
    """List all applications in the pipeline, calculated dynamically."""
    apps = [_get_evaluated_app(app_id) for app_id in MSME_PROFILES.keys()]
    return {"data": apps, "total": len(apps)}


@router.get("/{application_id}")
def get_application(application_id: str):
    """Get a single application by ID with full Decision Engine details."""
    app = _get_evaluated_app(application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


@router.post("")
def create_application(payload: dict):
    """Create a new MSME loan application."""
    # Placeholder for application creation
    new_id = f"PRZ-2024-{datetime.now().strftime('%H%M%S')}"
    return {
        "id": new_id,
        "status": "PENDING_REVIEW",
        "message": "Application created successfully.",
    }


@router.put("/{application_id}")
def update_application(application_id: str, payload: dict):
    """Update an application."""
    return {"id": application_id, "updated": True}


@router.post("/{application_id}/notes")
def add_notes(application_id: str, payload: dict):
    """Add underwriter notes to an application."""
    return {"id": application_id, "notes_saved": True}
