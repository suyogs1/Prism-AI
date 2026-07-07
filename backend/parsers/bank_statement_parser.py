"""
Bank Statement Parser — Mock Implementation

Extracts cash flow and credit signals from bank statements.
"""

from parsers.base_parser import BaseParser


class BankStatementParser(BaseParser):
    """
    Mock Bank Statement parser returning standardized JSON.
    """

    def parse(self, file_path: str) -> dict:
        """
        Mock parsing returns standard cash flow signals.
        """
        return {
            "monthly_inflows": [190000, 210000, 205000, 220000],
            "monthly_outflows": [150000, 160000, 155000, 170000],
            "avg_monthly_inflow": 206250.0,
            "bounce_rate": 0.0,  # Zero bounces
            "existing_loans_balance": 100000.0,
            "existing_loans_monthly_emi": 15000.0,
            "average_bank_balance": 300000.0
        }


# Module singleton
bank_statement_parser = BankStatementParser()
