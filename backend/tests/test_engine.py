"""
Prism AI — Scoring Engine Unit Tests.
Verifies scoring logic and loan sizing across three distinct profiles:
- Healthy applicant
- Borderline applicant
- High-risk applicant
"""

import sys
from pathlib import Path

# Add backend directory to path so engine can be imported
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from engine.orchestrator import PrismDecisionEngine


def test_healthy_applicant():
    """
    Verifies that a healthy applicant with complete evidence documents
    receives an APPROVE recommendation and appropriate loan sizing.
    """
    engine = PrismDecisionEngine()
    profile = {
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
        # Evidence check
        "bank_statements_present": True,
        "gst_present": True,
        "epfo_present": True,
        "upi_present": True,
        "relationship_present": True,
        "requested_loan_amount": 1000000.0,
    }

    result = engine.evaluate(profile)

    print("\n--- Healthy Applicant Score Details ---")
    print(f"Overall Score: {result['overall_score']}")
    print(f"Confidence: {result['confidence']}")
    print(f"Recommendation: {result['recommendation']}")
    print(f"Recommended Loan Amount: Rs.{result['recommended_loan_amount']:,}")
    print(f"Financial Health Card: {result['financial_health_card']}")
    print(f"Risk Flags: {result['risk_flags']}")
    print(f"Missing Evidence: {result['missing_evidence']}")

    # Assertions
    assert result["overall_score"] >= 75
    assert result["confidence"] >= 70
    assert result["recommendation"] == "APPROVE"
    assert result["recommended_loan_amount"] > 0
    assert len(result["missing_evidence"]) == 0
    assert len(result["risk_flags"]) == 0


def test_borderline_applicant():
    """
    Verifies that a borderline applicant with moderate financials
    or missing evidence documents receives a REVIEW or REQUEST_EVIDENCE recommendation.
    """
    engine = PrismDecisionEngine()
    profile = {
        "monthly_revenue": 300000.0,
        "monthly_expenses": 220000.0,
        "average_bank_balance": 150000.0,
        "existing_loans_monthly_emi": 15000.0,
        "revenue_growth_percentage": 5.0,
        "business_age": 2.5,
        "epfo_regular": True,
        "gst_regular": True,
        "customer_concentration": 45.0,  # Risk flag
        "supplier_dependency": 20.0,
        "bounce_rate": 2.0,
        "existing_loans_balance": 100000.0,
        "turnover": 3600000.0,
        # Evidence check (missing EPFO summary and UPI)
        "bank_statements_present": True,
        "gst_present": True,
        "epfo_present": False,
        "upi_present": False,
        "relationship_present": True,
        "requested_loan_amount": 500000.0,
    }

    result = engine.evaluate(profile)

    print("\n--- Borderline Applicant Score Details ---")
    print(f"Overall Score: {result['overall_score']}")
    print(f"Confidence: {result['confidence']}")
    print(f"Recommendation: {result['recommendation']}")
    print(f"Recommended Loan Amount: Rs.{result['recommended_loan_amount']:,}")
    print(f"Financial Health Card: {result['financial_health_card']}")
    print(f"Risk Flags: {result['risk_flags']}")
    print(f"Missing Evidence: {result['missing_evidence']}")

    # Assertions
    assert 50 <= result["overall_score"] < 90
    assert "Customer Concentration" in result["risk_flags"]
    assert len(result["missing_evidence"]) > 0
    # Recommendation should be REVIEW or REQUEST_EVIDENCE
    assert result["recommendation"] in ["REVIEW", "REQUEST_EVIDENCE"]


def test_high_risk_applicant():
    """
    Verifies that a high risk applicant with poor financials,
    cheque bounces, high debt, or missing major documents is declined.
    """
    engine = PrismDecisionEngine()
    profile = {
        "monthly_revenue": 200000.0,
        "monthly_expenses": 210000.0,  # Negative surplus
        "average_bank_balance": 10000.0,
        "existing_loans_monthly_emi": 40000.0,  # High debt burden
        "revenue_growth_percentage": -10.0,     # Declining growth
        "business_age": 0.8,                    # Young business
        "epfo_regular": False,                  # Irregular
        "gst_regular": False,
        "customer_concentration": 55.0,         # Concentration flag
        "supplier_dependency": 65.0,            # Supplier dependency flag
        "bounce_rate": 8.0,                     # Bounce flag
        "existing_loans_balance": 300000.0,
        "turnover": 2400000.0,
        # Evidence check
        "bank_statements_present": False,       # Missing major evidence
        "gst_present": False,
        "epfo_present": False,
        "upi_present": False,
        "relationship_present": False,
        "requested_loan_amount": 600000.0,
    }

    result = engine.evaluate(profile)

    print("\n--- High Risk Applicant Score Details ---")
    print(f"Overall Score: {result['overall_score']}")
    print(f"Confidence: {result['confidence']}")
    print(f"Recommendation: {result['recommendation']}")
    print(f"Recommended Loan Amount: Rs.{result['recommended_loan_amount']:,}")
    print(f"Financial Health Card: {result['financial_health_card']}")
    print(f"Risk Flags: {result['risk_flags']}")
    print(f"Missing Evidence: {result['missing_evidence']}")

    # Assertions
    assert result["overall_score"] < 50
    assert result["recommendation"] == "DECLINE"
    assert result["recommended_loan_amount"] == 0.0
    assert "Bank Statement" in result["missing_evidence"]
    assert "GST Return" in result["missing_evidence"]
    assert len(result["risk_flags"]) > 0


if __name__ == "__main__":
    print("Running Prism Scoring Engine Unit Tests...")
    test_healthy_applicant()
    test_borderline_applicant()
    test_high_risk_applicant()
    print("\nAll unit tests passed successfully!")
