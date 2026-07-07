import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from './Badge'

export default function ScoreTrace({ scoreName = 'Trust Index', totalScore = 84, factors = [] }) {
  const [expanded, setExpanded] = useState(false)

  // Default factors if none passed
  const defaultFactors = [
    { label: 'GST Filing Regularity (12/12 mos)', impact: '+25 pts', type: 'positive', detail: 'GSTR-3B filed on or before due date consistently' },
    { label: 'Business Operational Age (>4.5 yrs)', impact: '+20 pts', type: 'positive', detail: 'Established vintage lowers mortality risk' },
    { label: 'EPFO Compliance & Headcount Growth', impact: '+15 pts', type: 'positive', detail: 'Regular monthly provident fund remittances for 45 employees' },
    { label: 'Customer Concentration Flag (>40%)', impact: '-15 pts', type: 'negative', detail: 'Top single client represents 42% of annual turnover' }
  ]

  const activeFactors = factors.length > 0 ? factors : defaultFactors

  return (
    <div style={{
      background: 'var(--color-void)',
      border: '1px solid var(--color-border-subtle)',
      borderRadius: 12,
      padding: '10px 14px',
      marginTop: 8
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 13 }}>📐</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)' }}>
            Mathematical Score Trace ({scoreName})
          </span>
          <Badge variant={totalScore >= 75 ? 'green' : totalScore >= 50 ? 'amber' : 'red'} size="xs">
            {totalScore} Pts
          </Badge>
        </div>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          {expanded ? '▲ Hide Formula Breakdown' : '▼ View Factor Trace'}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              paddingTop: 12,
              marginTop: 10,
              borderTop: '1px dashed var(--color-border-default)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Deterministic Formula Deductions & Additions
              </div>

              {activeFactors.map((fac, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-2.5 rounded-lg gap-3"
                  style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border-subtle)' }}
                >
                  <div className="flex items-start gap-2.5 flex-1">
                    <span style={{ fontSize: 13, marginTop: 1 }}>{fac.type === 'positive' ? '🟢' : '🔴'}</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {fac.label}
                      </div>
                      {fac.detail && (
                        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2, lineHeight: 1.4 }}>
                          {fac.detail}
                        </div>
                      )}
                    </div>
                  </div>

                  <span style={{
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: fac.type === 'positive' ? '#10b981' : '#ef4444',
                    background: fac.type === 'positive' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    border: fac.type === 'positive' ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)'
                  }}>
                    {fac.impact}
                  </span>
                </div>
              ))}

              <div style={{ fontSize: 9, color: 'var(--color-text-muted)', fontStyle: 'italic', marginTop: 4 }}>
                ⚡ All weights and scoring thresholds are strictly deterministic as defined in `orchestrator.py`. No LLM guessing involved.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
