"""
Business Stability Index Scorer

Weight: 20% of composite score

Signals analysed:
  - Business age (years in operation)
  - Sector risk classification
  - Udyam / MSME registration status
  - Ownership continuity
  - Geographic risk factor
"""

# Sector risk classifications
SECTOR_RISK = {
    "low":    ["IT Services", "Education & Training", "Healthcare"],
    "medium": ["Textile & Apparel", "Food & Beverages", "Retail Trade", "Agriculture & Allied"],
    "high":   ["Metal Fabrication", "Construction", "Transport & Logistics", "Manufacturing"],
}


class StabilityIndex:
    """
    Computes the Business Stability Index.

    Score range: 0–100
    Weight in composite: 20%
    """

    WEIGHT = 0.20

    def compute(self, signals: dict) -> float:
        """
        Compute stability index from business profile signals.

        Args:
            signals: dict with keys:
                - business_age_years (float): years since incorporation
                - sector (str): business sector
                - udyam_registered (bool): has Udyam/MSME registration
                - ownership_changes (int): number of ownership changes
                - state (str): state of operation

        Returns:
            float: index score 0–100
        """
        # TODO: implement in Phase 2
        raise NotImplementedError("StabilityIndex.compute() not yet implemented")

    def _score_business_age(self, years: float) -> float:
        """
        Score based on years in operation.

        <1 year  → 20
        1–2 years → 40
        2–4 years → 60
        4–7 years → 80
        7+ years  → 100
        """
        # TODO: implement in Phase 2
        pass

    def _score_sector(self, sector: str) -> float:
        """Score based on sector risk tier."""
        # TODO: implement in Phase 2
        pass

    def _score_udyam(self, registered: bool) -> float:
        """Udyam registration is a positive signal (+10 points)."""
        return 10.0 if registered else 0.0
