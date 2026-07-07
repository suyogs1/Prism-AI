"""
Digital Footprint Index Scorer

Weight: 10% of composite score

Signals analysed:
  - Payment gateway presence (Razorpay, PayU, etc.)
  - UPI transaction volume and regularity
  - Online business presence (website age, Google Maps listing)
  - E-commerce platform activity
  - Digital bill payment regularity (utilities, rent)
"""


class DigitalIndex:
    """
    Computes the Digital Footprint Index from alternate digital signals.

    Score range: 0–100
    Weight in composite: 10%

    This index differentiates Prism from traditional credit systems.
    High digital activity correlates with business formality and cash flow visibility.
    """

    WEIGHT = 0.10

    def compute(self, signals: dict) -> float:
        """
        Compute digital footprint index.

        Args:
            signals: dict with keys:
                - payment_gateway_active (bool): registered with a payment gateway
                - upi_monthly_txn_count (int): monthly UPI transactions
                - upi_monthly_volume (float): monthly UPI transaction value
                - has_website (bool): active business website
                - google_maps_listed (bool): listed on Google Maps
                - ecommerce_active (bool): sells on Amazon/Flipkart/Meesho

        Returns:
            float: index score 0–100
        """
        # TODO: implement in Phase 2
        raise NotImplementedError("DigitalIndex.compute() not yet implemented")

    def _score_payment_gateway(self, active: bool, monthly_volume: float) -> float:
        """Score payment gateway presence and volume."""
        # TODO: implement in Phase 2
        pass

    def _score_upi_activity(self, txn_count: int, volume: float) -> float:
        """Score UPI transaction regularity and volume."""
        # TODO: implement in Phase 2
        pass

    def _score_online_presence(self, has_website: bool, google_listed: bool) -> float:
        """Score online business presence."""
        # TODO: implement in Phase 2
        pass
