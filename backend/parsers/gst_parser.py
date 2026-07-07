"""
GST Parser — Mock Implementation

Extracts compliance and growth signals from GSTR returns.
"""

from parsers.base_parser import BaseParser


class GSTParser(BaseParser):
    """
    Mock GST parser returning standardized JSON.
    """

    def parse(self, file_path: str) -> dict:
        """
        Mock parsing returns standard GSTR signals.
        """
        # Standarized JSON schema for scoring engine ingestion
        return {
            "avg_monthly_turnover": 200000.0,
            "turnover_growth_rate": 0.12,  # +12% growth
            "filing_gaps": 0,
            "gst_regular": True,
            "itc_utilisation_ratio": 0.65
        }


# Module singleton
gst_parser = GSTParser()
