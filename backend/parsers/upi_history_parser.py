"""
UPI History Parser — Mock Implementation

Extracts micro-receipt parameters and velocity metrics from retail UPI logs.
"""

from parsers.base_parser import BaseParser


class UPIHistoryParser(BaseParser):
    """
    Mock UPI History parser returning standardized JSON.
    """

    def parse(self, file_path: str) -> dict:
        """
        Mock parsing returns standard UPI transactional signals.
        """
        return {
            "upi_present": True,
            "monthly_upi_volume": 45000.0,
            "avg_transaction_value": 320.0,
            "digital_receipts_ratio": 0.85
        }


# Module singleton
upi_history_parser = UPIHistoryParser()
