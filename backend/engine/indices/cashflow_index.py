"""
Cash Flow Index Scorer

Weight: 30% of composite score

Signals analysed:
  - Average monthly bank inflow (12-month)
  - Inflow stability (coefficient of variation)
  - EMI bounce rate
  - Cash inflow to outflow ratio
  - Minimum balance trend
"""


class CashFlowIndex:
    """
    Computes the Cash Flow Index from bank statement analysis.

    Score range: 0–100
    Weight in composite: 30%
    """

    WEIGHT = 0.30

    def compute(self, signals: dict) -> float:
        """
        Compute cash flow index from extracted bank statement signals.

        Args:
            signals: dict with keys:
                - avg_monthly_inflow (float): mean monthly credit
                - inflow_cov (float): coefficient of variation (0.0–1.0)
                - emi_bounce_rate (float): proportion of bounced EMIs
                - inflow_outflow_ratio (float): credits / debits
                - min_balance_trend (str): 'improving' | 'stable' | 'declining'

        Returns:
            float: index score 0–100
        """
        # TODO: implement in Phase 2
        raise NotImplementedError("CashFlowIndex.compute() not yet implemented")

    def _score_inflow_volume(self, avg_monthly_inflow: float) -> float:
        """Score based on absolute inflow volume relative to loan ask."""
        # TODO: implement in Phase 2
        pass

    def _score_stability(self, cov: float) -> float:
        """Score based on inflow stability. Lower CoV = more stable = higher score."""
        # TODO: implement in Phase 2
        pass

    def _score_emi_behaviour(self, bounce_rate: float) -> float:
        """
        Score based on EMI bounce rate.

        0%   bounce → 100
        <5%  bounce → 80–100
        5–15% bounce → 40–80 (linear)
        >15% bounce → <40 (high risk)
        """
        # TODO: implement in Phase 2
        pass
