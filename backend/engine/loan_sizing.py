"""
Loan Sizing Engine

Computes the maximum recommended loan amount deterministically.

Formula:
    max_loan = min(
        avg_monthly_turnover × TURNOVER_MULTIPLE,
        avg_monthly_cash_inflow × INFLOW_MULTIPLE,
        sector_cap
    ) × confidence_multiplier

This is NOT an approval — it is the engine's computed ceiling.
The underwriter makes the final decision.
"""

# Multiples applied to financial data
TURNOVER_MULTIPLE = 6    # Up to 6× avg monthly GST turnover
INFLOW_MULTIPLE   = 4    # Up to 4× avg monthly bank inflow

# Sector-specific caps (in INR)
SECTOR_CAPS = {
    "Manufacturing":       5_000_000,   # ₹50 lakhs
    "IT Services":         3_000_000,   # ₹30 lakhs
    "Food & Beverages":    2_000_000,   # ₹20 lakhs
    "Textile & Apparel":   4_000_000,   # ₹40 lakhs
    "Agriculture & Allied": 2_500_000,  # ₹25 lakhs
    "Metal Fabrication":   5_000_000,   # ₹50 lakhs
    "Retail Trade":        2_000_000,   # ₹20 lakhs
    "default":             3_000_000,   # ₹30 lakhs default cap
}


class LoanSizer:
    """
    Computes the deterministic loan ceiling for a Prism application.

    All inputs come from the scoring engine — no LLM involvement.
    """

    def compute(
        self,
        avg_monthly_turnover: float,
        avg_monthly_inflow: float,
        sector: str,
        confidence_multiplier: float,
    ) -> dict:
        """
        Compute the recommended loan ceiling.

        Args:
            avg_monthly_turnover: average monthly GST-declared turnover (₹)
            avg_monthly_inflow: average monthly bank credit (₹)
            sector: business sector string
            confidence_multiplier: from ConfidenceEngine (0.65–1.0)

        Returns:
            dict with:
                - recommended_loan (float): computed ceiling in ₹
                - binding_constraint (str): which factor limited the amount
                - turnover_based (float): raw turnover multiple
                - inflow_based (float): raw inflow multiple
                - sector_cap (float): applicable sector cap
                - confidence_multiplier (float): applied multiplier
        """
        # TODO: implement in Phase 2
        raise NotImplementedError("LoanSizer.compute() not yet implemented")

    def _get_sector_cap(self, sector: str) -> float:
        """Return the sector-specific loan cap."""
        return SECTOR_CAPS.get(sector, SECTOR_CAPS["default"])
