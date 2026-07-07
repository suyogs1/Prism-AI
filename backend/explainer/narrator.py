"""
Narrator — LLM Explanation Service

Orchestrates the LLM narration pipeline:
  ScoreReport -> PromptBuilder -> GeminiClient -> Explanation

If Gemini is unavailable, displays a programmatic deterministic explanation instead.
Includes a profile-state sensitive memory cache to prevent redundant API calls.
"""

from explainer.gemini_client import gemini_client
from explainer.prompt_builder import build_prompt


def generate_fallback_explanation(decision: dict, name: str) -> str:
    """
    Generates a factual, programmatic fallback narrative.
    Used if Gemini is unconfigured, rate-limited, or otherwise unavailable.
    """
    cf = decision["financial_health_card"]["cash_flow"]
    growth = decision["financial_health_card"]["growth"]
    trust = decision["financial_health_card"]["trust"]
    risk = decision["financial_health_card"]["risk"]
    score = decision["overall_score"]
    rec = decision["recommendation"]
    
    sections = []
    
    # 1. Summary
    sections.append(
        f"### Summary\n"
        f"{name} has been evaluated by the Prism credit decision engine with an overall score of {score}. "
        f"The entity falls under the credit category matching the parameters of recommendation status: {rec}."
    )
    
    # 2. Positive Factors
    pos = []
    if cf >= 70: pos.append(f"Strong cash flow safety score of {cf}/100.")
    if growth >= 70: pos.append(f"Robust growth momentum index of {growth}/100.")
    if trust >= 70: pos.append(f"Established regulatory trust index of {trust}/100.")
    if risk >= 70: pos.append(f"Low risk safety score of {risk}/100.")
    pos_str = "\n".join([f"- {item}" for item in pos]) if pos else "- Baseline financial performance indices observed."
    sections.append(f"### Positive Factors\n{pos_str}")
    
    # 3. Risk Factors
    flags = decision.get("risk_flags", [])
    flags_str = "\n".join([f"- {f}" for f in flags]) if flags else "- No significant risk safety flags detected."
    sections.append(f"### Risk Factors\n{flags_str}")
    
    # 4. Recommendation Rationale
    sections.append(
        f"### Recommendation Rationale\n"
        f"The overall score of {score} and scoring confidence level of {decision['confidence']}% generated a recommendation status of {rec}. "
        f"This status reflects adherence to current bank underwriting rules."
    )
    
    # 5. Suggested Improvements
    missing = decision.get("missing_evidence", [])
    if missing:
        imp_str = "\n".join([f"- Submit {item} to increase scoring confidence." for item in missing])
    else:
        imp_str = "- No pending evidence documents requested."
    sections.append(f"### Suggested Improvements\n{imp_str}")
    
    return "\n\n".join(sections)


class Narrator:
    """
    Orchestrates LLM narration of scoring engine output.
    Enforces that Gemini NEVER performs calculations.
    """

    def __init__(self):
        # Memory cache sensitive to application ID and document upload configuration
        self._cache = {}

    def narrate(self, app_data: dict) -> dict:
        """
        Generate a natural-language explanation.
        """
        decision = app_data["decision"]
        profile = app_data.get("profile", {})
        app_id = app_data["id"]
        business_name = app_data["businessName"]

        # Generate a state-sensitive cache key using document indicators
        doc_sig = (
            f"{profile.get('bank_statements_present', False)}-"
            f"{profile.get('gst_present', False)}-"
            f"{profile.get('epfo_present', False)}-"
            f"{profile.get('upi_present', False)}"
        )
        cache_key = f"{app_id}-{doc_sig}"

        # Return cached result if available
        if cache_key in self._cache:
            return self._cache[cache_key]

        # 1. Build strict prompt template
        prompt = build_prompt(decision, app_data)

        # 2. Try Gemini invocation
        explanation = None
        model_used = "deterministic-fallback"

        if gemini_client._model is not None:
            try:
                explanation = gemini_client.generate(prompt)
                model_used = gemini_client.MODEL_NAME
                
                # Check for empty response or placeholder response
                if not explanation or "placeholder explanation" in explanation.lower():
                    explanation = None
            except Exception as e:
                print(f"ERROR: Gemini narration failed: {e}")
                explanation = None

        # 3. Fallback to programmatic narration if Gemini fails/is unconfigured
        if explanation is None:
            explanation = generate_fallback_explanation(decision, business_name)
            model_used = "deterministic-fallback"

        result = {
            "explanation": explanation,
            "model": model_used,
            "disclaimer": (
                "This explanation narrates the output of a deterministic scoring engine. "
                "The AI model does not perform credit calculations or make lending decisions. "
                "All assessments are subject to final underwriter approval."
            ),
        }

        # Cache the result
        self._cache[cache_key] = result
        return result


# Module-level singleton
narrator = Narrator()
