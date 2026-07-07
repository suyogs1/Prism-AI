"""
Base Parser Interface

Defines the contract for all document parsers.
Ensures clean abstraction so that future production parsers require no engine changes.
"""

from abc import ABC, abstractmethod


class BaseParser(ABC):
    """
    Abstract Base Class for all Prism document parsers.
    Each parser must consume a file path and return a standardized JSON dictionary of signals.
    """

    @abstractmethod
    def parse(self, file_path: str) -> dict:
        """
        Parses a document and extracts standardized scoring signals.

        Args:
            file_path: absolute path to the document file

        Returns:
            dict: standardized JSON containing scoring signals
        """
        pass
