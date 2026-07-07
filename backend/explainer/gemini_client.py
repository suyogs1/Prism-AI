"""
Gemini API Client

Wrapper around the Google Generative AI SDK for the Prism AI explainer.

ARCHITECTURE CONSTRAINT:
  This client is ONLY called from explainer/narrator.py.
  It must NEVER be called from the scoring engine.
  The LLM receives only structured score data — never raw financial documents.
"""

import google.generativeai as genai
from core.config import settings


class GeminiClient:
    """
    Thin wrapper around the Gemini API for LLM narration.

    Uses gemini-pro model (or gemini-1.5-flash for cost efficiency).
    """

    MODEL_NAME = "gemini-2.5-flash"

    def __init__(self):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self._model = genai.GenerativeModel(self.MODEL_NAME)
        else:
            self._model = None

    def generate(self, prompt: str) -> str:
        """
        Generate a text response from Gemini.

        Args:
            prompt: structured prompt built by prompt_builder.py

        Returns:
            str: generated explanation text

        Raises:
            RuntimeError: if API key is not configured
        """
        if self._model is None:
            # Return placeholder when API key not configured (scaffold phase)
            return self._placeholder_response()

        try:
            response = self._model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise RuntimeError(f"Gemini API error: {e}") from e

    def _placeholder_response(self) -> str:
        """
        Placeholder response when Gemini API key is not configured.
        Used during scaffold and development phases.
        """
        return (
            "This is a placeholder explanation. Configure GEMINI_API_KEY in .env "
            "to enable real LLM-generated narratives. The scoring engine has computed "
            "all indices deterministically and is ready for narration."
        )


# Module-level singleton
gemini_client = GeminiClient()
