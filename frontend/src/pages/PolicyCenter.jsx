import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { DEMO_APPLICATIONS } from '../data/mockData'
import { evaluateProfile } from '../utils/decisionEngine'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

export default function PolicyCenter() {
  const [weights, setWeights] = useState({
    cash_flow_weight: 0.35,
    growth_weight: 0.20,
    trust_weight: 0.25,
    risk_weight: 0.20
  })

  const [thresholds, setThresholds] = useState({
    approval_threshold: 75,
    review_threshold: 50,
    evidence_threshold: 70
  })

  const totalWeight = useMemo(() => {
    return Number((weights.cash_flow_weight + weights.growth_weight + weights.trust_weight + weights.risk_weight).toFixed(2))
  }, [weights])

  const isValidWeight = totalWeight === 1.00

  // Handle slider change
  const handleWeightChange = (key, val) => {
    setWeights(prev => ({ ...prev, [key]: parseFloat(val) }))
  }

  const handleThresholdChange = (key, val) => {
    setThresholds(prev => ({ ...prev, [key]: parseInt(val, 10) }))
  }

  const handleReset = () => {
    setWeights({
      cash_flow_weight: 0.35,
      growth_weight: 0.20,
      trust_weight: 0.25,
      risk_weight: 0.20
    })
    setThresholds({
      approval_threshold: 75,
      review_threshold: 50,
      evidence_threshold: 70
    })
  }

  // Simulate scores for all demo applicants
  const simulatedResults = useMemo(() => {
    const configOverride = {
      weights,
      thresholds
    }

    return DEMO_APPLICATIONS.map(app => {
      // Evaluate with current IDBI defaults
      const defaultDecision = evaluateProfile(app)
      // Evaluate with new slider overrides
      const simDecision = evaluateProfile(app, configOverride)

      const recChanged = defaultDecision.recommendation !== simDecision.recommendation
      const scoreDiff = simDecision.overall_score - defaultDecision.overall_score

      return {
        ...app,
        defaultScore: defaultDecision.overall_score,
        simScore: simDecision.overall_score,
        defaultRec: defaultDecision.recommendation,
        simRec: simDecision.recommendation,
        defaultLimit: defaultDecision.recommended_loan_amount,
        simLimit: simDecision.recommended_loan_amount,
        recChanged,
        scoreDiff
      }
    })
  }, [weights, thresholds])

  return (
    <div className="p-8 min-h-screen" style={{ background: 'var(--color-base)' }}>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>
              ⚙️ Policy Center — Sandbox Underwriting Studio
            </span>
            <Badge variant="purple" size="xs">Live Simulation Engine</Badge>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 800 }}>
            Test adjusting Decision Engine weights and credit policy thresholds. Watch live portfolio impacts in real-time without modifying backend code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleReset}>
            ↺ Reset to IDBI Sandbox Defaults
          </Button>
          <Badge variant={isValidWeight ? 'green' : 'red'} size="md">
            Total Weight: {(totalWeight * 100).toFixed(0)}% {isValidWeight ? '✓ Valid (1.0)' : '✕ Must equal 100%'}
          </Badge>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Card 1: Index Weighting Studio */}
        <Card padding={24}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
              1. Credit Index Weighting Studio
            </h3>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Formula: CF*W1 + Growth*W2 + Trust*W3 + Risk*W4</span>
          </div>

          <div className="flex flex-col gap-5">
            {/* Cash Flow */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  💵 Cash Flow Safety Weight
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10b981' }}>
                  {(weights.cash_flow_weight * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range" min="0.10" max="0.60" step="0.05"
                value={weights.cash_flow_weight}
                onChange={e => handleWeightChange('cash_flow_weight', e.target.value)}
                style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
              />
              <div className="flex justify-between text-xs text-muted mt-1"><span>10% (Min)</span><span>Default: 35%</span><span>60% (Max)</span></div>
            </div>

            {/* Growth */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  📈 Revenue Growth Weight
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>
                  {(weights.growth_weight * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range" min="0.10" max="0.50" step="0.05"
                value={weights.growth_weight}
                onChange={e => handleWeightChange('growth_weight', e.target.value)}
                style={{ width: '100%', accentColor: '#06b6d4', cursor: 'pointer' }}
              />
              <div className="flex justify-between text-xs text-muted mt-1"><span>10% (Min)</span><span>Default: 20%</span><span>50% (Max)</span></div>
            </div>

            {/* Trust */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  🏛️ Regulatory Trust Weight (GST/EPFO)
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#a855f7' }}>
                  {(weights.trust_weight * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range" min="0.10" max="0.50" step="0.05"
                value={weights.trust_weight}
                onChange={e => handleWeightChange('trust_weight', e.target.value)}
                style={{ width: '100%', accentColor: '#a855f7', cursor: 'pointer' }}
              />
              <div className="flex justify-between text-xs text-muted mt-1"><span>10% (Min)</span><span>Default: 25%</span><span>50% (Max)</span></div>
            </div>

            {/* Risk */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  🛡️ Risk & Leverage Weight
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>
                  {(weights.risk_weight * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range" min="0.10" max="0.50" step="0.05"
                value={weights.risk_weight}
                onChange={e => handleWeightChange('risk_weight', e.target.value)}
                style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
              <div className="flex justify-between text-xs text-muted mt-1"><span>10% (Min)</span><span>Default: 20%</span><span>50% (Max)</span></div>
            </div>
          </div>
        </Card>

        {/* Card 2: Decision Thresholds Studio */}
        <Card padding={24}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
              2. Credit Decision Thresholds
            </h3>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Underwriting Cutoffs</span>
          </div>

          <div className="flex flex-col gap-5">
            {/* Approval Threshold */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  🌟 Auto-Approval Cutoff Score
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10b981' }}>
                  {thresholds.approval_threshold} Pts
                </span>
              </div>
              <input
                type="range" min="65" max="85" step="1"
                value={thresholds.approval_threshold}
                onChange={e => handleThresholdChange('approval_threshold', e.target.value)}
                style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
              />
              <div className="flex justify-between text-xs text-muted mt-1"><span>65 Pts (Lenient)</span><span>Default: 75 Pts</span><span>85 Pts (Strict)</span></div>
            </div>

            {/* Review Threshold */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  📋 Review / Manual Assessment Cutoff
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>
                  {thresholds.review_threshold} Pts
                </span>
              </div>
              <input
                type="range" min="40" max="65" step="1"
                value={thresholds.review_threshold}
                onChange={e => handleThresholdChange('review_threshold', e.target.value)}
                style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
              <div className="flex justify-between text-xs text-muted mt-1"><span>40 Pts (Lenient)</span><span>Default: 50 Pts</span><span>65 Pts (Strict)</span></div>
            </div>

            {/* Evidence Threshold */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  📁 Minimum Evidence Confidence Score
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#6366f1' }}>
                  {thresholds.evidence_threshold}%
                </span>
              </div>
              <input
                type="range" min="50" max="90" step="5"
                value={thresholds.evidence_threshold}
                onChange={e => handleThresholdChange('evidence_threshold', e.target.value)}
                style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
              />
              <div className="flex justify-between text-xs text-muted mt-1"><span>50% (Lenient)</span><span>Default: 70%</span><span>90% (Strict)</span></div>
            </div>

            <div className="p-3 rounded-xl" style={{ background: 'var(--color-void)', border: '1px solid var(--color-border-subtle)', marginTop: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                💡 Policy Rule Summary:
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4, lineHeight: 1.5 }}>
                Applicants scoring ≥ <strong>{thresholds.approval_threshold}</strong> with confidence ≥ <strong>{thresholds.evidence_threshold}%</strong> receive auto-approval. Scores between <strong>{thresholds.review_threshold}</strong> and <strong>{thresholds.approval_threshold}</strong> route to banker review. Below <strong>{thresholds.review_threshold}</strong> is declined.
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Live Simulation Results Table */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div className="p-5 border-b flex items-center justify-between flex-wrap gap-4" style={{ borderColor: 'var(--color-border-default)', background: 'var(--color-elevated)' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
              Live Portfolio Impact Simulation ({simulatedResults.length} Applicants)
            </h3>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
              Comparing current IDBI Sandbox defaults against your custom simulated policy rules
            </div>
          </div>
          <Badge variant="blue" size="sm">
            {simulatedResults.filter(r => r.recChanged).length} Recommendation Change(s) Detected
          </Badge>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-strong)' }}>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Applicant Entity</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Score Impact (Default ➔ Sim)</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Recommendation Impact</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Loan Ceiling Impact</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {simulatedResults.map((res, idx) => (
                <motion.tr
                  key={res.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    borderBottom: idx === simulatedResults.length - 1 ? 'none' : '1px solid var(--color-border-default)',
                    background: res.recChanged ? 'rgba(245,158,11,0.08)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'
                  }}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{res.businessName}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{res.id} · Conf: {res.confidenceScore || 80}%</div>
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{res.defaultScore}</span>
                      <span style={{ fontSize: 14 }}>➔</span>
                      <span style={{
                        fontSize: 15, fontWeight: 800, fontFamily: 'var(--font-mono)',
                        color: res.simScore >= 75 ? '#10b981' : res.simScore >= 50 ? '#f59e0b' : '#ef4444'
                      }}>
                        {res.simScore}
                      </span>
                      {res.scoreDiff !== 0 && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: res.scoreDiff > 0 ? '#10b981' : '#ef4444' }}>
                          ({res.scoreDiff > 0 ? `+${res.scoreDiff}` : res.scoreDiff})
                        </span>
                      )}
                    </div>
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={res.defaultRec === 'APPROVE' ? 'green' : res.defaultRec === 'REVIEW' ? 'blue' : res.defaultRec === 'REQUEST_EVIDENCE' ? 'amber' : 'red'} size="xs">
                        {res.defaultRec}
                      </Badge>
                      <span style={{ fontSize: 14 }}>➔</span>
                      <Badge variant={res.simRec === 'APPROVE' ? 'green' : res.simRec === 'REVIEW' ? 'blue' : res.simRec === 'REQUEST_EVIDENCE' ? 'amber' : 'red'} size="xs">
                        {res.simRec}
                      </Badge>
                    </div>
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                      ₹{(res.simLimit / 100000).toFixed(2)} Lakhs
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                      Default: ₹{(res.defaultLimit / 100000).toFixed(2)} L
                    </div>
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    {res.recChanged ? (
                      <Badge variant="amber" size="sm">⚠️ Policy Shift</Badge>
                    ) : (
                      <Badge variant="green" size="sm">✓ Unchanged</Badge>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
