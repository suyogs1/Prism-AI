import api from './api'

/**
 * scoringService — interfaces with the Prism scoring engine via the API.
 *
 * The scoring engine is deterministic and runs server-side.
 * The LLM explainer is also triggered through this service.
 */
const scoringService = {
  /**
   * Trigger the scoring engine for an application.
   * Returns a ScoreReport (all indices + composite + recommendation).
   */
  computeScore: (applicationId) =>
    api.post(`/scoring/${applicationId}/compute`),

  /**
   * Fetch the latest score report for an application.
   */
  getScoreReport: (applicationId) =>
    api.get(`/scoring/${applicationId}/report`),

  /**
   * Request an LLM-generated natural-language explanation.
   * The LLM receives only the computed score JSON — it does not decide.
   */
  getExplanation: (applicationId) =>
    api.post(`/explain/${applicationId}`),
}

export default scoringService
