import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from './Card'
import Badge from './Badge'
import Button from './Button'

export default function ConfidenceGap({ currentConfidence = 65, missingEvidence = ['EPFO Summary', 'UPI History'], onSimulateUpload }) {
  const [simulating, setSimulating] = useState(null)

  const getDocDetails = (docName) => {
    switch (docName) {
      case 'EPFO Summary':
      case 'EPFO Summary':
        return {
          gain: '+15%',
          why: 'Verifies employee headcount, monthly wage bills, and operational going-concern status without manual field investigation.',
          connector: 'EPFO Portal API'
        }
      case 'UPI History':
      case 'UPI History':
        return {
          gain: '+10%',
          why: 'Validates high-frequency digital retail receipts, unique payer diversity, and real-time cash turnover velocity.',
          connector: 'NPCI Sandbox API'
        }
      case 'Bank Statement':
        return {
          gain: '+40%',
          why: 'Primary source of truth for operating cash flows, EMI bounce rates, and average monthly balances.',
          connector: 'Account Aggregator (FIU-IND)'
        }
      case 'GST Return':
        return {
          gain: '+25%',
          why: 'Verifies outward taxable supplies, ITC claims, and revenue growth trajectory against tax records.',
          connector: 'GSTN Portal API'
        }
      default:
        return {
          gain: '+15%',
          why: 'Provides secondary cryptographic verification of financial health.',
          connector: 'IDBI Sandbox API'
        }
    }
  }

  const handleSimulate = (doc) => {
    setSimulating(doc)
    setTimeout(() => {
      setSimulating(null)
      if (onSimulateUpload) {
        onSimulateUpload(doc)
      }
    }, 1200)
  }

  const projectedConfidence = Math.min(100, currentConfidence + missingEvidence.length * 15)

  return (
    <Card padding={20} style={{
      background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(15,22,41,0.95))',
      border: '1px solid rgba(245,158,11,0.3)',
      boxShadow: '0 0 25px rgba(245,158,11,0.08)'
    }}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 20 }}>🎯</span>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
              Confidence Gap Analysis & Sandbox Simulation
            </h4>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
              Simulate live API ingestion to bridge missing evidence and unlock automated loan decisions
            </div>
          </div>
        </div>
        <Badge variant="amber" size="sm">Evidence Threshold: 70% Required</Badge>
      </div>

      {/* Progress Bars */}
      <div className="mb-5 p-3.5 rounded-xl" style={{ background: 'var(--color-void)', border: '1px solid var(--color-border-subtle)' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)' }}>
            Current Confidence Level: <strong style={{ color: '#f59e0b' }}>{currentConfidence}%</strong>
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>
            Projected Post-Ingestion: <strong>{projectedConfidence}%</strong>
          </span>
        </div>

        <div style={{ width: '100%', height: 10, background: 'var(--color-elevated)', borderRadius: 5, overflow: 'hidden', position: 'relative' }}>
          {/* Projected Bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${projectedConfidence}%`,
            background: 'linear-gradient(90deg, rgba(16,185,129,0.3), rgba(16,185,129,0.6))',
            borderRadius: 5,
            transition: 'width 0.5s ease'
          }} />
          {/* Current Bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${currentConfidence}%`,
            background: currentConfidence >= 70 ? '#10b981' : '#f59e0b',
            borderRadius: 5,
            boxShadow: '0 0 10px rgba(245,158,11,0.5)',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      {/* Missing Documents Table */}
      <div className="flex flex-col gap-3">
        {missingEvidence.map((doc, idx) => {
          const details = getDocDetails(doc)
          const isThisSimulating = simulating === doc

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl flex-wrap gap-4"
              style={{
                background: 'var(--color-elevated)',
                border: '1px solid var(--color-border-default)'
              }}
            >
              <div className="flex items-start gap-3 flex-1">
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18
                }}>
                  📄
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      {doc}
                    </span>
                    <Badge variant="green" size="xs">Gain {details.gain}</Badge>
                    <span style={{ fontSize: 10, color: 'var(--color-prism-400)', fontFamily: 'var(--font-mono)' }}>
                      via {details.connector}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    {details.why}
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="primary"
                onClick={() => handleSimulate(doc)}
                disabled={isThisSimulating}
                style={{
                  background: isThisSimulating ? 'var(--color-elevated)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
                  minWidth: 170,
                  fontWeight: 700
                }}
              >
                {isThisSimulating ? '⚡ Ingesting API...' : '⚡ Simulate Ingestion ➔'}
              </Button>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}
