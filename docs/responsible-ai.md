# Responsible AI & Ethical Governance Framework — Prism AI

This document establishes the ethical lending principles, AI governance protocols, and regulatory compliance safeguards governing **Prism AI** for IDBI Bank.

> [!IMPORTANT]
> **Strict Separation of Concerns**: In accordance with RBI guidelines on digital lending and AI ethics, Prism AI strictly decouples mathematical credit risk evaluation from Generative AI models. **Large Language Models (LLMs) have zero write access or authority over credit scores and loan approvals.**

---

## 1. Human-in-the-Loop (HITL) Decision Making

Prism AI is designed as an **underwriting copilot**, not an autonomous credit decision maker.

* **Underwriter Supremacy**: While Prism AI calculates credit scores and loan ceilings in real-time, final lending authority rests strictly with IDBI Bank credit officers.
* **No Auto-Rejection Blackboxes**: Applications scoring below policy thresholds are flagged for review or decline, but bankers retain the operational mechanism to manually override recommendations based on qualitative relationship knowledge.
* **Mandatory Override Justification**: Every underwriter override mandates entering formal justification notes into the system, which are immutably timestamped and logged in the Regulatory Audit Ledger.

---

## 2. 100% Deterministic Decision Engine

To eliminate the risks of hallucination, bias, and unpredictability inherent in Generative AI, Prism AI's scoring engine (`orchestrator.py`) is **100% deterministic**.

$$\text{Overall Score} = (\text{CF} \times 0.35) + (\text{Growth} \times 0.20) + (\text{Trust} \times 0.25) + (\text{Risk} \times 0.20)$$

* **Mathematical Predictability**: Given identical input financial signals, the engine will generate the exact same score 100% of the time, across any server or environment.
* **Zero Stochastic Drift**: Unlike neural networks or LLMs whose weights drift or produce varying outputs between runs, our rule-based index math guarantees reproducible audit results required by banking regulators.

---

## 3. LLM Role & Strict Limitations

Google Gemini / Amazon Bedrock is deployed within Prism AI under strict architectural guardrails:

* **Read-Only Narration**: The LLM receives pre-computed JSON parameters (scores, index values, risk flags) and is confined strictly to translating those numbers into clear, professional natural language summaries for bankers and MSMEs.
* **System Prompt Guardrails**: The LLM system prompt explicitly prohibits speculating on creditworthiness, recommending alternative loan amounts, or altering financial figures.
* **Fail-Safe Fallbacks**: If the LLM service experiences latency or downtime, the application seamlessly falls back to rule-based template explanations (`generateFallbackExplanation`), ensuring zero interruption to banking operations.

---

## 4. Explainability & Transparency (XAI)

Prism AI rejects "black box" lending. Every scoring decision is fully explainable to both underwriters and borrowers:

* **Mathematical Score Trace**: The UI provides an interactive, factor-by-factor breakdown showing exactly which behaviors added or deducted points (e.g., *"+25 pts for 12/12 GSTR-3B on-time filings"*, *"-15 pts for customer concentration > 40%"*).
* **Cryptographic Data Lineage**: Every data point displayed on the Financial Health Card traces back to its verified origin (Account Aggregator FIU-IND, GSTN, EPFO) with timestamp and digital signature confirmation.

---

## 5. Regulatory Auditability & RBI Compliance

To satisfy RBI mandates for AI in financial services, Prism AI incorporates comprehensive audit mechanisms:

* **Immutable Audit Ledger**: All credit evaluations, document simulations, and banker overrides are recorded in a chronological ledger with unique transaction IDs (`AUD-2024-XXX`).
* **Complete Snapshotting**: Each audit record stores the applicant entity, timestamp, underwriter identity, exact system score at the time of action, and final recommendation status.
* **WORM Storage Readiness**: In production AWS cloud deployment, audit logs mirror directly to WORM-compliant (Write Once, Read Many) Amazon S3 vaults, preventing tampering or retroactive editing.

---

## 6. Fairness & Non-Discrimination

Ethical credit underwriting requires eliminating demographic and socioeconomic bias:

* **Exclusion of Protected Attributes**: The Decision Engine algorithm explicitly excludes demographic variables such as gender, caste, religion, marital status, and geographical location from all scoring formulas.
* **Performance-Only Evaluation**: Creditworthiness is evaluated solely on verified operational cash flows, tax compliance regularity, provident fund employee remittances, and repayment velocity.
* **Financial Inclusion Focus**: By incorporating alternative verified data (UPI transaction velocity and EPFO headcount), Prism AI enables credit access for modern, digital-first MSMEs that lack traditional brick-and-mortar collateral.
