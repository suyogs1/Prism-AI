"""
GST Compliance Index Scorer

Weight: 30% of composite score

Signals analysed:
  - Filing regularity (gap count over 12 months)
  - Turnover trend (MoM growth rate)
  - ITC utilisation ratio
  - Filing timeliness (days after due date)
  - Turnover consistency (CoV)
"""


class GSTIndex:
    """
    Computes the GST Compliance Index from GSTR-1 and GSTR-3B data.

    Score range: 0–100
    Weight in composite: 30%
    """

    WEIGHT = 0.30

    def compute(self, signals: dict) -> float:
        """
        Compute GST index from extracted signals.

        Args:
            signals: dict with keys:
                - filing_gap_count (int): number of missed filings in 12m
                - avg_monthly_turnover (float): average declared turnover
                - turnover_growth_rate (float): MoM growth (0.0 – 1.0)
                - itc_utilisation_ratio (float): ITC claimed / eligible
                - filing_delay_avg_days (int): avg delay in filing

        Returns:
            float: index score 0–100
        """
        # TODO: implement in Phase 2
        raise NotImplementedError("GSTIndex.compute() not yet implemented")

    def _score_filing_regularity(self, gap_count: int) -> float:
        """
        Convert filing gap count to a regularity score.

        0 gaps  → 100
        1 gap   → 80
        2 gaps  → 60
        3+ gaps → linear decay to 0
        """
        # TODO: implement in Phase 2
        pass

    def _score_turnover_trend(self, growth_rate: float) -> float:
        """Score based on month-over-month turnover growth."""
        # TODO: implement in Phase 2
        pass

    def _score_itc_utilisation(self, ratio: float) -> float:
        """Score based on ITC utilisation ratio (healthy = 0.6–0.95)."""
        # TODO: implement in Phase 2
        pass
