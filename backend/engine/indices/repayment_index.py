"""
Repayment Proxy Index Scorer

Weight: 10% of composite score

Signals analysed (proxy for credit behaviour when no credit history exists):
  - Utility bill payment regularity (electricity, water, gas)
  - Rental payment regularity
  - Vendor/supplier payment consistency
  - Insurance premium payment history
  - Trade credit utilisation
"""


class RepaymentProxyIndex:
    """
    Estimates repayment behaviour from non-credit payment proxies.

    This index is specifically designed for New-to-Credit (NTC) entities
    who have no formal credit history.

    Score range: 0–100
    Weight in composite: 10%
    """

    WEIGHT = 0.10

    def compute(self, signals: dict) -> float:
        """
        Compute repayment proxy index.

        Args:
            signals: dict with keys:
                - utility_payment_regularity (float): 0.0–1.0 (% on-time)
                - rental_payment_regularity (float): 0.0–1.0
                - supplier_payment_regularity (float): 0.0–1.0
                - trade_credit_utilisation (float): used / available credit

        Returns:
            float: index score 0–100
        """
        # TODO: implement in Phase 2
        raise NotImplementedError("RepaymentProxyIndex.compute() not yet implemented")

    def _score_utility_payments(self, regularity: float) -> float:
        """Score based on utility bill payment on-time rate."""
        # TODO: implement in Phase 2
        pass

    def _score_supplier_payments(self, regularity: float) -> float:
        """Score based on supplier/vendor payment consistency."""
        # TODO: implement in Phase 2
        pass
