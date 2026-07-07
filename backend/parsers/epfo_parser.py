"""
EPFO Parser — Mock Implementation

Extracts active payroll and regulatory filing regularity from EPFO summaries.
"""

from parsers.base_parser import BaseParser


class EPFOParser(BaseParser):
    """
    Mock EPFO parser returning standardized JSON.
    """

    def parse(self, file_path: str) -> dict:
        """
        Mock parsing returns standard EPFO payroll signals.
        """
        return {
            "epfo_regular": True,
            "payroll_size": 18,
            "monthly_contribution_avg": 45000.0,
            "filing_gaps": 0
        }


# Module singleton
epfo_parser = EPFOParser()
