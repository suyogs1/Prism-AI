"""
Composite Score Calculator

Combines all 5 sub-index scores into the final Prism Score (0–100).

Weighting:
  GST Compliance    30%
  Cash Flow         30%
  Business Stability 20%
  Digital Footprint  10%
  Repayment Proxy    10%
  ──────────────────────
  Total             100%
"""

WEIGHTS = {
    "gst":       0.30,
    "cashflow":  0.30,
    "stability": 0.20,
    "digital":   0.10,
    "repayment": 0.10,
}

TIER_THRESHOLDS = {
    "GREEN": 70,
    "AMBER": 50,
    # Below 50 → RED
}


class CompositeScorer:
    """
    Computes the weighted composite Prism Score from sub-index scores.

    Formula:
        composite = sum(score_i * weight_i for i in indices)
        score is clamped to [0, 100]
    """

    def compute(self, sub_scores: dict) -> dict:
        """
        Compute composite score and risk tier.

        Args:
            sub_scores: dict mapping index name to score (0–100)
                Keys: gst, cashflow, stability, digital, repayment

        Returns:
            dict with:
                - composite_score (float): 0–100
                - risk_tier (str): GREEN | AMBER | RED
                - weighted_contributions (dict): each index's contribution
        """
        # TODO: implement in Phase 2
        raise NotImplementedError("CompositeScorer.compute() not yet implemented")

    def _apply_weights(self, sub_scores: dict) -> float:
        """Apply index weights and sum to composite."""
        # TODO: implement in Phase 2
        pass

    @staticmethod
    def classify_tier(score: float) -> str:
        """
        Classify score into risk tier.

        ≥70 → GREEN
        50–69 → AMBER
        <50 → RED
        """
        if score >= TIER_THRESHOLDS["GREEN"]:
            return "GREEN"
        elif score >= TIER_THRESHOLDS["AMBER"]:
            return "AMBER"
        return "RED"
