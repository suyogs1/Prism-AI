"""
Confidence Engine

Computes the data completeness score and maps it to a confidence band.

Confidence bands:
  HIGH   → ≥75% of expected signals present
  MEDIUM → 50–74% of expected signals present
  LOW    → <50% of expected signals present

The confidence band affects the loan sizing formula via a multiplier.
"""

# All signals the engine expects
EXPECTED_SIGNALS = [
    "gst_returns_12m",
    "bank_statement_12m",
    "udyam_registration",
    "itr_2y",
    "upi_transaction_history",
    "pan_card",
    "trade_references",
    "utility_payments",
    "supplier_invoices",
    "business_address_proof",
]

CONFIDENCE_MULTIPLIERS = {
    "HIGH":   1.0,
    "MEDIUM": 0.85,
    "LOW":    0.65,
}

CONFIDENCE_THRESHOLDS = {
    "HIGH":   0.75,
    "MEDIUM": 0.50,
    # Below 0.50 → LOW
}


class ConfidenceEngine:
    """
    Computes data completeness and assigns a confidence band.

    The confidence band is a transparency mechanism — it tells the
    underwriter how much of the expected data was available for scoring.
    """

    def compute(self, available_signals: list[str]) -> dict:
        """
        Compute confidence band from available signals.

        Args:
            available_signals: list of signal keys that are present

        Returns:
            dict with:
                - level (str): HIGH | MEDIUM | LOW
                - completeness (float): 0.0–1.0
                - missing (list[str]): missing signal keys
                - multiplier (float): loan sizing multiplier
        """
        # TODO: implement in Phase 2
        raise NotImplementedError("ConfidenceEngine.compute() not yet implemented")

    @staticmethod
    def classify_level(completeness: float) -> str:
        """Map completeness ratio to confidence level."""
        if completeness >= CONFIDENCE_THRESHOLDS["HIGH"]:
            return "HIGH"
        elif completeness >= CONFIDENCE_THRESHOLDS["MEDIUM"]:
            return "MEDIUM"
        return "LOW"

    @staticmethod
    def get_multiplier(level: str) -> float:
        """Return the loan sizing multiplier for a confidence level."""
        return CONFIDENCE_MULTIPLIERS.get(level, 0.65)
