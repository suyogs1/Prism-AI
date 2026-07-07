import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from './Badge'

export default function DataLineage({ metricName = 'Score Metric', sources = [], lastUpdated = 'Just now' }) {
  const [expanded, setExpanded] = useState(false)

  // Default fallback sources if none provided
  const defaultSources = [
    { name: 'Account Aggregator (FIU-IND)', status: 'Verified', confidence: '98%', timestamp: '2 mins ago', origin: 'IDBI Bank Sandbox Gateway' },
    { name: 'GST Network (GSTR-3B)', status: 'Verified', confidence: '100%', timestamp: '5 mins ago', origin: 'GSTN Portal API' },
    { name: 'EPFO Compliance Logs', status: 'Verified', confidence: '95%', timestamp: '10 mins ago', origin: 'EPFO Shram Suvidha' },
    { name: 'NPCI / UPI Payment Velocity', status: 'Verified', confidence: '92%', timestamp: '1 min ago', origin: 'NPCI Sandbox' }
  ]

  const activeSources = sources.length > 0 ? sources : defaultSources

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
          <span style={{ fontSize: 13 }}>🔗</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)' }}>
            Data Lineage & Provenance
          </span>
          <Badge variant="blue" size="xs">{activeSources.length} Sources</Badge>
        </div>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          {expanded ? '▲ Hide Chain of Custody' : '▼ Inspect Provenance'}
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
                Cryptographic Chain of Custody ({metricName})
              </div>

              {activeSources.map((src, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border-subtle)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: src.status === 'Verified' ? '#10b981' : '#f59e0b',
                      boxShadow: src.status === 'Verified' ? '0 0 6px #10b981' : '0 0 6px #f59e0b'
                    }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {src.name}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--color-text-muted)' }}>
                        Origin: {src.origin || 'IDBI Sandbox API'} · Updated: {src.timestamp || lastUpdated}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-prism-400)' }}>
                      {src.confidence || '99%'} Conf.
                    </span>
                    <Badge variant={src.status === 'Verified' ? 'green' : 'amber'} size="xs">
                      {src.status || 'Verified'}
                    </Badge>
                  </div>
                </div>
              ))}

              <div style={{ fontSize: 9, color: 'var(--color-text-muted)', fontStyle: 'italic', marginTop: 4 }}>
                🔒 All ingested data points are digitally signed by FIU-IND / Sandbox API connectors before entering the invariant Decision Engine.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
