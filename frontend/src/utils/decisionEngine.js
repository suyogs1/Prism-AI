/**
 * Prism AI — Frontend Client-Side Decision Engine
 *
 * Replicates the exact deterministic scoring math of the Python Decision Engine.
 * Enables instant, interactive simulation of evidence uploads during hackathon demos.
 */
const CONFIG = {
  weights: {
    cash_flow_weight: 0.35,
    growth_weight: 0.20,
    trust_weight: 0.25,
    risk_weight: 0.20
  },
  thresholds: {
    approval_threshold: 75,
    review_threshold: 50,
    evidence_threshold: 70
  },
  confidence_points: {
    bank_statement: 40,
    gst_returns: 25,
    epfo_summary: 15,
    upi_history: 10,
    relationship_history: 10
  },
  loan_sizing: {
    max_monthly_revenue_multiplier: 3.0,
    max_debt_to_income_ratio: 0.40,
    risk_multiplier_high: 0.50,
    risk_multiplier_medium: 0.80,
    risk_multiplier_low: 1.00
  }
}
export function evaluateProfile(profile, configOverride = null) {
  const cfg = configOverride ? {
    ...CONFIG,
    weights: { ...CONFIG.weights, ...(configOverride.weights || {}) },
    thresholds: { ...CONFIG.thresholds, ...(configOverride.thresholds || {}) },
    confidence_points: { ...CONFIG.confidence_points, ...(configOverride.confidence_points || {}) },
    loan_sizing: { ...CONFIG.loan_sizing, ...(configOverride.loan_sizing || {}) }
  } : CONFIG
  // 1. Confidence Score & missing evidence
  const { confidence, confidence_breakdown, missing_evidence } = computeConfidence(profile, cfg)
  // 2. Health card scores
  const cash_flow = profile.subScores?.cashflow !== undefined ? profile.subScores.cashflow : computeCashFlow(profile)
  const growth = profile.subScores?.digital !== undefined ? profile.subScores.digital : computeGrowth(profile)
  const trust = profile.subScores?.gst !== undefined ? profile.subScores.gst : computeTrust(profile)
  const { risk, risk_flags } = profile.subScores?.repayment !== undefined
    ? { risk: profile.subScores.repayment, risk_flags: (profile.signals?.bounceRate > 0.05 || profile.bounce_rate > 0.05) ? ["Cheque Bounce Rate"] : [] }
    : computeRiskSafety(profile)
  const financial_health_card = {
    cash_flow: Math.round(cash_flow),
    growth: Math.round(growth),
    trust: Math.round(trust),
    risk: Math.round(risk)
  }
  // 3. Overall Score
  const overall_score = Math.round(
    financial_health_card.cash_flow * cfg.weights.cash_flow_weight +
    financial_health_card.growth * cfg.weights.growth_weight +
    financial_health_card.trust * cfg.weights.trust_weight +
    financial_health_card.risk * cfg.weights.risk_weight
  )
  // 4. Recommendation
  let recommendation = "DECLINE"
  if (overall_score >= cfg.thresholds.approval_threshold) {
    recommendation = confidence >= cfg.thresholds.evidence_threshold ? "APPROVE" : "REQUEST_EVIDENCE"
  } else if (overall_score >= cfg.thresholds.review_threshold) {
    recommendation = "REVIEW"
  }
  // 5. Loan Sizing
  let recommended_loan_amount = 0
  if (recommendation !== "DECLINE") {
    const rev = parseFloat(profile.monthly_revenue || profile.signals?.avgMonthlyTurnover || profile.loanAmount || 0)
    const emi = parseFloat(profile.existing_loans_monthly_emi || (profile.signals?.avgMonthlyTurnover ? profile.signals.avgMonthlyTurnover * 0.15 : 0))
    const rev_cap = rev * cfg.loan_sizing.max_monthly_revenue_multiplier
    const max_emi_capacity = (rev * cfg.loan_sizing.max_debt_to_income_ratio) - emi
    const cashflow_cap = Math.max(0, max_emi_capacity) * 12.0
    const base_limit = Math.min(rev_cap, cashflow_cap)
    const quality_multiplier = overall_score / 100.0
    const confidence_multiplier = confidence / 100.0
    let risk_mult = cfg.loan_sizing.risk_multiplier_low
    if (risk < 50) {
      risk_mult = cfg.loan_sizing.risk_multiplier_high
    } else if (risk < 70) {
      risk_mult = cfg.loan_sizing.risk_multiplier_medium
    }
    recommended_loan_amount = base_limit * quality_multiplier * confidence_multiplier * risk_mult
    
    const requested = parseFloat(profile.requested_loan_amount || profile.loanAmount || 0)
    if (requested > 0) {
      recommended_loan_amount = Math.min(recommended_loan_amount, requested)
    }
  }
  return {
    overall_score,
    confidence,
    recommendation,
    recommended_loan_amount: Math.round(recommended_loan_amount),
    financial_health_card,
    confidence_breakdown,
    missing_evidence,
    risk_flags
  }
}
function computeConfidence(profile, cfg = CONFIG) {
  const pts = cfg.confidence_points
  const breakdown = { aa: 0, gst: 0, epfo: 0, upi: 0, relationship: 0 }
  const missing_evidence = []
  let confidence = 0
  const hasBank = profile.bank_statements_present !== undefined
    ? profile.bank_statements_present
    : profile.missingData ? !profile.missingData.includes('bank_statement') : true
  const hasGst = profile.gst_present !== undefined
    ? profile.gst_present
    : profile.missingData ? !profile.missingData.includes('gst_returns') : true
  const hasEpfo = profile.epfo_present !== undefined
    ? profile.epfo_present
    : profile.missingData ? !profile.missingData.includes('epfo_summary') : true
  const hasUpi = profile.upi_present !== undefined
    ? profile.upi_present
    : profile.missingData ? !profile.missingData.includes('upi_history') : true
  const hasRel = profile.relationship_present !== undefined
    ? profile.relationship_present
    : profile.signals ? (profile.signals.businessAge >= 3.0) : true
  if (hasBank) {
    breakdown.aa = pts.bank_statement
    confidence += pts.bank_statement
  } else {
    missing_evidence.push("Bank Statement")
  }
  if (hasGst) {
    breakdown.gst = pts.gst_returns
    confidence += pts.gst_returns
  } else {
    missing_evidence.push("GST Return")
  }
  if (hasEpfo) {
    breakdown.epfo = pts.epfo_summary
    confidence += pts.epfo_summary
  } else {
    missing_evidence.push("EPFO Summary")
  }
  if (hasUpi) {
    breakdown.upi = pts.upi_history
    confidence += pts.upi_history
  } else {
    missing_evidence.push("UPI History")
  }
  if (hasRel) {
    breakdown.relationship = pts.relationship_history
    confidence += pts.relationship_history
  }
  return { confidence, confidence_breakdown: breakdown, missing_evidence }
}
function computeCashFlow(profile) {
  if (profile.subScores?.cashflow !== undefined) return profile.subScores.cashflow
  const rev = parseFloat(profile.monthly_revenue || profile.signals?.avgMonthlyTurnover || 0)
  const exp = parseFloat(profile.monthly_expenses || (rev * 0.75) || 0)
  const avg_bal = parseFloat(profile.average_bank_balance || (rev * 0.4) || 0)
  const emi = parseFloat(profile.existing_loans_monthly_emi || (rev * 0.1) || 0)
  if (rev <= 0) return 0
  const surplus = rev - exp
  const surplus_ratio = Math.max(0, surplus / rev)
  const surplus_score = Math.min(100, surplus_ratio * 150.0)
  const balance_ratio = avg_bal / (exp + 1.0)
  const balance_score = Math.min(100, balance_ratio * 50.0)
  let dscr_score = 100.0
  if (emi > 0) {
    const dscr = Math.max(0, surplus) / emi
    dscr_score = Math.min(100, dscr * 40.0)
  }
  return 0.4 * surplus_score + 0.3 * balance_score + 0.3 * dscr_score
}
function computeGrowth(profile) {
  if (profile.subScores?.digital !== undefined) return profile.subScores.digital
  const growth = parseFloat(profile.revenue_growth_percentage || 0)
  const score = 50.0 + (growth * 2.5)
  return Math.max(0, Math.min(100, score))
}
function computeTrust(profile) {
  if (profile.subScores?.gst !== undefined) return profile.subScores.gst
  const age = parseFloat(profile.business_age || profile.signals?.businessAge || 0)
  const age_score = age >= 5.0 ? 100.0 : age >= 3.0 ? 85.0 : age >= 1.0 ? 60.0 : 30.0
  let compliance = 100.0
  if (!profile.epfo_regular && profile.epfo_regular !== undefined) compliance -= 30.0
  if (!profile.gst_regular && profile.gst_regular !== undefined) compliance -= 30.0
  return 0.4 * age_score + 0.6 * compliance
}
function computeRiskSafety(profile) {
  if (profile.subScores?.repayment !== undefined) {
    const bounce_rate = parseFloat(profile.bounce_rate || profile.signals?.bounceRate || 0)
    return {
      risk: profile.subScores.repayment,
      risk_flags: bounce_rate > 0.05 ? ["Cheque Bounce Rate"] : []
    }
  }
  const cust_conc = parseFloat(profile.customer_concentration || 0)
  const supp_dep = parseFloat(profile.supplier_dependency || 0)
  const bounce_rate = parseFloat(profile.bounce_rate || profile.signals?.bounceRate || 0)
  const existing_loans = parseFloat(profile.existing_loans_balance || 0)
  const turnover = parseFloat(profile.turnover || profile.signals?.avgMonthlyTurnover || 1.0)
  let score = 100.0
  const risk_flags = []
  if (cust_conc > 40.0) {
    score -= 15.0
    risk_flags.push("Customer Concentration")
  }
  if (supp_dep > 50.0) {
    score -= 15.0
    risk_flags.push("Supplier Dependency")
  }
  if (bounce_rate > 5.0 || bounce_rate > 0.05) {
    score -= 20.0
    risk_flags.push("Cheque Bounce Rate")
  }
  const leverage = existing_loans / turnover
  if (leverage > 0.5) {
    score -= 15.0
    risk_flags.push("High Leverage")
  }
  return { risk: Math.max(0, score), risk_flags }
}
export function generateFallbackExplanation(decision, name) {
  const cf = decision.financial_health_card.cash_flow
  const growth = decision.financial_health_card.growth
  const trust = decision.financial_health_card.trust
  const risk = decision.financial_health_card.risk
  const score = decision.overall_score
  const rec = decision.recommendation
  const sections = []
  // 1. Summary
  sections.push(
    `### Summary\n${name} has been evaluated by the Prism credit decision engine with an overall score of ${score}. The entity falls under the credit category matching the parameters of recommendation status: ${rec}.`
  )
  // 2. Positive Factors
  const pos = []
  if (cf >= 70) pos.push(`Strong cash flow safety score of ${cf}/100.`)
  if (growth >= 70) pos.push(`Robust growth momentum index of ${growth}/100.`)
  if (trust >= 70) pos.push(`Established regulatory trust index of ${trust}/100.`)
  if (risk >= 70) pos.push(`Low risk safety score of ${risk}/100.`)
  const pos_str = pos.length > 0 ? pos.map(item => `- ${item}`).join('\n') : "- Baseline financial performance indices observed."
  sections.push(`### Positive Factors\n${pos_str}`)
  // 3. Risk Factors
  const flags = decision.risk_flags || []
  const flags_str = flags.length > 0 ? flags.map(f => `- ${f}`).join('\n') : "- No significant risk safety flags detected."
  sections.push(`### Risk Factors\n${flags_str}`)
  // 4. Recommendation Rationale
  sections.push(
    `### Recommendation Rationale\nThe overall score of ${score} and scoring confidence level of ${decision.confidence}% generated a recommendation status of ${rec}. This status reflects adherence to current bank underwriting rules.`
  )
  // 5. Suggested Improvements
  const missing = decision.missing_evidence || []
  const imp_str = missing.length > 0 ? missing.map(item => `- Submit ${item} to increase scoring confidence.`).join('\n') : "- No pending evidence documents requested."
  sections.push(`### Suggested Improvements\n${imp_str}`)
  return sections.join('\n\n')
}
