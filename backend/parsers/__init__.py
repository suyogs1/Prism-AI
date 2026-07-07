"""
Parsers Module

Exposes all document parsers from a single interface.
"""

from parsers.gst_parser import gst_parser
from parsers.bank_statement_parser import bank_statement_parser
from parsers.epfo_parser import epfo_parser
from parsers.upi_history_parser import upi_history_parser

__all__ = [
    "gst_parser",
    "bank_statement_parser",
    "epfo_parser",
    "upi_history_parser",
]
