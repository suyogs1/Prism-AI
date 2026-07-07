"""
Prism AI — Deterministic scoring engine orchestrator.
Calculates sub-indices, overall score, confidence score, recommendation,
loan sizing, and required additional evidence.
"""

import json
from pathlib import Path
from typing import Dict, Any, List

CONFIG_PATH = Path(__file__).resolve().parent.parent / "core" / "scoring_config.json"


class PrismDecisionEngine:
    """
    100% deterministic decision engine.
    No LLM, no AI. Operates purely on configurable rules.
    """

    def __init__(self, config_path: Path = CONFIG_PATH):
        self.config = self._load_config(config_path)

    def _load_config(self, path: Path) -> Dict[str, Any]:
        """Loads configuration weights and thresholds."""
        try:
            with open(path, "r") as f:
                return json.load(f)
        except Exception as e:
            # Fallback configuration in case file read fails
            return {
                "weights": {
                    "cash_flow_weight": 0.35,
                    "growth_weight": 0.20,
                    "trust_weight": 0.25,
                    "risk_weight": 0.20
                },
                "thresholds": {
                    "approval_threshold": 75,
                    "review_threshold": 50,
                    "evidence_threshold": 70
                },
                "confidence_points": {
                    "bank_statement": 40,
                    "gst_returns": 25,
                    "epfo_summary": 15,
                    "upi_history": 10,
                    "relationship_history": 10
                },
                "loan_sizing": {
                    "max_monthly_revenue_multiplier": 3.0,
                    "max_debt_to_income_ratio": 0.40,
                    "risk_multiplier_high": 0.50,
                    "risk_multiplier_medium": 0.80,
                    "risk_multiplier_low": 1.00
                }
            }

    def evaluate(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluates an MSME profile and returns the structured decision JSON.
        """
        # 1. Compute Confidence Score & missing evidence list
        confidence, confidence_breakdown, missing_evidence = self._compute_confidence(profile)

        # 2. Compute Individual Index Scores (0-100)
        cash_flow_score = self._compute_cash_flow(profile)
        growth_score = self._compute_growth(profile)
        trust_score = self._compute_trust(profile)
        risk_safety_score, risk_flags = self._compute_risk_safety(profile)

        financial_health = {
            "cash_flow": int(round(cash_flow_score)),
            "growth": int(round(growth_score)),
            "trust": int(round(trust_score)),
            "risk": int(round(risk_safety_score))
        }

        # 3. Compute Overall Score
        overall_score = self._compute_overall_score(financial_health)

        # 4. Determine Recommendation
        recommendation = self._determine_recommendation(overall_score, confidence)

        # 5. Compute Suggested Loan Amount
        recommended_loan = self._compute_loan_sizing(profile, overall_score, confidence, risk_safety_score, recommendation)

        return {
            "overall_score": int(round(overall_score)),
            "confidence": int(round(confidence)),
            "recommendation": recommendation,
            "recommended_loan_amount": int(round(recommended_loan)),
            "financial_health_card": financial_health,
            "confidence_breakdown": confidence_breakdown,
            "missing_evidence": missing_evidence,
            "risk_flags": risk_flags
        }

    def _compute_confidence(self, profile: Dict[str, Any]) -> tuple:
        """
        Calculates confidence score and maps it to data presence.
        Returns: (confidence_score, confidence_breakdown, missing_evidence)
        """
        points_cfg = self.config.get("confidence_points", {})
        breakdown = {}
        missing = []
        total = 0

        # Bank statements / AA (Account Aggregator)
        if profile.get("bank_statements_present", False) or profile.get("bank_statements", None):
            val = points_cfg.get("bank_statement", 40)
            breakdown["aa"] = val
            total += val
        else:
            breakdown["aa"] = 0
            missing.append("Bank Statement")

        # GST Returns
        if profile.get("gst_present", False) or profile.get("gst", None):
            val = points_cfg.get("gst_returns", 25)
            breakdown["gst"] = val
            total += val
        else:
            breakdown["gst"] = 0
            missing.append("GST Return")

        # EPFO Summary
        if profile.get("epfo_present", False) or profile.get("epfo", None):
            val = points_cfg.get("epfo_summary", 15)
            breakdown["epfo"] = val
            total += val
        else:
            breakdown["epfo"] = 0
            missing.append("EPFO Summary")

        # UPI History
        if profile.get("upi_present", False) or profile.get("upi_volume", 0) > 0:
            val = points_cfg.get("upi_history", 10)
            breakdown["upi"] = val
            total += val
        else:
            breakdown["upi"] = 0
            missing.append("UPI History")

        # Relationship History
        if profile.get("relationship_present", False):
            val = points_cfg.get("relationship_history", 10)
            breakdown["relationship"] = val
            total += val
        else:
            breakdown["relationship"] = 0
            # Relationship is not an external evidence document, so don't list as missing evidence unless requested

        return total, breakdown, missing

    def _compute_cash_flow(self, profile: Dict[str, Any]) -> float:
        """Computes Cash Flow health score (0-100)."""
        rev = float(profile.get("monthly_revenue", 0))
        exp = float(profile.get("monthly_expenses", 0))
        avg_bal = float(profile.get("average_bank_balance", 0))
        emi = float(profile.get("existing_loans_monthly_emi", 0))

        if rev <= 0:
            return 0.0

        # Surplus ratio: net surplus / revenue
        surplus = rev - exp
        surplus_ratio = max(0.0, surplus / rev)
        surplus_score = min(100.0, surplus_ratio * 150.0)  # 66% surplus ratio gets 100 points

        # Balance coverage: average balance / expenses
        balance_ratio = avg_bal / (exp + 1.0)
        balance_score = min(100.0, balance_ratio * 50.0)  # Covers 2 months expenses gets 100 points

        # Debt Service Coverage (DSCR) proxy
        available_for_debt = max(0.0, surplus)
        if emi > 0:
            dscr = available_for_debt / emi
            dscr_score = min(100.0, dscr * 40.0)  # 2.5x debt service gets 100 points
        else:
            dscr_score = 100.0  # No existing EMIs

        return 0.4 * surplus_score + 0.3 * balance_score + 0.3 * dscr_score

    def _compute_growth(self, profile: Dict[str, Any]) -> float:
        """Computes Growth health score (0-100)."""
        growth_rate = float(profile.get("revenue_growth_percentage", 0.0))  # e.g. 15.0 for 15%
        
        # Scale: -20% growth is 0 points, 0% is 50 points, 20% or more is 100 points
        score = 50.0 + (growth_rate * 2.5)
        return max(0.0, min(100.0, score))

    def _compute_trust(self, profile: Dict[str, Any]) -> float:
        """Computes Trust/Stability health score (0-100)."""
        age = float(profile.get("business_age", 0.0))
        epfo_regular = profile.get("epfo_regular", True)
        gst_regular = profile.get("gst_regular", True)

        # Age scoring
        if age >= 5.0:
            age_score = 100.0
        elif age >= 3.0:
            age_score = 85.0
        elif age >= 1.0:
            age_score = 60.0
        else:
            age_score = 30.0

        # Compliance score
        compliance = 100.0
        if not epfo_regular:
            compliance -= 30.0
        if not gst_regular:
            compliance -= 30.0

        return 0.4 * age_score + 0.6 * compliance

    def _compute_risk_safety(self, profile: Dict[str, Any]) -> tuple:
        """
        Computes Risk/Safety health score (0-100, where 100 is safest).
        Also returns detected risk flags.
        """
        cust_conc = float(profile.get("customer_concentration", 0.0))  # e.g. 45.0 for 45%
        supp_dep = float(profile.get("supplier_dependency", 0.0))      # e.g. 60.0 for 60%
        bounce_rate = float(profile.get("bounce_rate", 0.0))           # e.g. 5.0 for 5% of checks/transactions
        existing_loans = float(profile.get("existing_loans_balance", 0.0))
        turnover = float(profile.get("turnover", 1.0))

        score = 100.0
        flags = []

        if cust_conc > 40.0:
            score -= 15.0
            flags.append("Customer Concentration")

        if supp_dep > 50.0:
            score -= 15.0
            flags.append("Supplier Dependency")

        if bounce_rate > 5.0:
            score -= 20.0
            flags.append("Cheque Bounce Rate")

        # Leverage ratio: existing debt / turnover
        leverage = existing_loans / max(1.0, turnover)
        if leverage > 0.5:
            score -= 15.0
            flags.append("High Leverage")

        return max(0.0, score), flags

    def _compute_overall_score(self, health_card: Dict[str, int]) -> float:
        """Computes weighted overall score."""
        weights = self.config.get("weights", {})
        
        score = (
            health_card["cash_flow"] * weights.get("cash_flow_weight", 0.35) +
            health_card["growth"] * weights.get("growth_weight", 0.20) +
            health_card["trust"] * weights.get("trust_weight", 0.25) +
            health_card["risk"] * weights.get("risk_weight", 0.20)
        )
        return score

    def _determine_recommendation(self, overall_score: float, confidence: float) -> str:
        """Determines the application recommendation."""
        th = self.config.get("thresholds", {})
        
        app_th = th.get("approval_threshold", 75)
        rev_th = th.get("review_threshold", 50)
        ev_th = th.get("evidence_threshold", 70)

        if overall_score >= app_th:
            if confidence >= ev_th:
                return "APPROVE"
            else:
                return "REQUEST_EVIDENCE"
        elif overall_score >= rev_th:
            return "REVIEW"
        else:
            return "DECLINE"

    def _compute_loan_sizing(
        self,
        profile: Dict[str, Any],
        overall_score: float,
        confidence: float,
        risk_safety_score: float,
        recommendation: str
    ) -> float:
        """Computes loan sizing ceiling based on cash flow capacity and scoring confidence."""
        if recommendation == "DECLINE":
            return 0.0

        rev = float(profile.get("monthly_revenue", 0))
        emi = float(profile.get("existing_loans_monthly_emi", 0))
        sizing_cfg = self.config.get("loan_sizing", {})

        # Capacity based on revenue multiplier
        rev_cap = rev * sizing_cfg.get("max_monthly_revenue_multiplier", 3.0)

        # Capacity based on free cash flow debt service limit
        max_emi_capacity = (rev * sizing_cfg.get("max_debt_to_income_ratio", 0.40)) - emi
        cashflow_cap = max(0.0, max_emi_capacity) * 12.0

        # Base limit is the lesser of the two capacities
        base_limit = min(rev_cap, cashflow_cap)

        # Scale by overall score quality & data confidence
        quality_multiplier = overall_score / 100.0
        confidence_multiplier = confidence / 100.0
        
        # Risk safety multiplier
        if risk_safety_score < 50.0:
            risk_mult = sizing_cfg.get("risk_multiplier_high", 0.50)
        elif risk_safety_score < 70.0:
            risk_mult = sizing_cfg.get("risk_multiplier_medium", 0.80)
        else:
            risk_mult = sizing_cfg.get("risk_multiplier_low", 1.0)

        recommended_amount = base_limit * quality_multiplier * confidence_multiplier * risk_mult
        
        # Clamp to requested loan amount if present
        requested_loan = float(profile.get("requested_loan_amount", 0.0))
        if requested_loan > 0:
            recommended_amount = min(recommended_amount, requested_loan)

        return recommended_amount
