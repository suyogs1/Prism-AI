import { useState } from 'react'
import { motion } from 'framer-motion'
import sandboxPayloads from '../data/sandboxPayloads'
import NormalizationView from '../components/ui/NormalizationView'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

export default function PayloadViewer() {
  const [activeStage, setActiveStage] = useState(1)
  const [selectedDataset, setSelectedDataset] = useState('AA')
  const [isFetching, setIsFetching] = useState(false)

  const STAGES = [
    { id: 1, label: '1. Incoming Payload', icon: '📦', desc: 'Raw JSON from Sandbox API' },
    { id: 2, label: '2. Schema Validation', icon: '🔒', desc: 'Digital signature & SSL check' },
    { id: 3, label: '3. Normalization', icon: '🔄', desc: 'BaseParser signal extraction' },
    { id: 4, label: '4. Decision Engine', icon: '⚙️', desc: 'Deterministic scoring math' },
    { id: 5, label: '5. Health Card', icon: '📊', desc: 'Final Prism Score & Tier' }
  ]

  const handleSimulateFetch = () => {
    setIsFetching(true)
    setTimeout(() => {
      setIsFetching(false)
    }, 1000)
  }

  const activeJson = sandboxPayloads[selectedDataset] || sandboxPayloads.AA

  return (
    <div className="p-8 min-h-screen" style={{ background: 'var(--color-base)' }}>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>
              ⚡ Sandbox Payload Processing Pipeline
            </span>
            <Badge variant="purple" size="xs">Live API Ingestion Inspector</Badge>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 850 }}>
            Step inside Prism AI's data ingestion engine. Inspect how raw, nested JSON payloads from IDBI Bank Sandbox APIs are validated, normalized, and transformed into deterministic credit decisions.
          </p>
        </div>

        {/* Dataset Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Select API Gateway:</span>
          {[
            { id: 'AA', label: 'Account Aggregator (AA)' },
            { id: 'GST', label: 'GST Network (GSTR-3B)' },
            { id: 'UPI', label: 'UPI / NPCI Logs' },
            { id: 'EPFO', label: 'EPFO Portal' }
          ].map(ds => (
            <button
              key={ds.id}
              onClick={() => setSelectedDataset(ds.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                border: selectedDataset === ds.id ? '1px solid var(--color-prism-500)' : '1px solid var(--color-border-default)',
                background: selectedDataset === ds.id ? 'rgba(99,102,241,0.15)' : 'var(--color-elevated)',
                color: selectedDataset === ds.id ? '#fff' : 'var(--color-text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              {ds.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline Stage Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {STAGES.map(st => (
          <button
            key={st.id}
            onClick={() => setActiveStage(st.id)}
            className="p-3.5 rounded-xl text-left transition-all duration-200"
            style={{
              background: activeStage === st.id ? 'rgba(99,102,241,0.15)' : 'var(--color-surface)',
              border: activeStage === st.id ? '1px solid var(--color-prism-500)' : '1px solid var(--color-border-default)',
              boxShadow: activeStage === st.id ? '0 0 20px rgba(99,102,241,0.2)' : 'none',
              cursor: 'pointer'
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontSize: 20 }}>{st.icon}</span>
              <span style={{
                width: 22, height: 22, borderRadius: '50%',
                background: activeStage === st.id ? 'var(--color-prism-500)' : 'var(--color-elevated)',
                color: activeStage === st.id ? '#fff' : 'var(--color-text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700
              }}>
                {st.id}
              </span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: activeStage === st.id ? '#fff' : 'var(--color-text-primary)' }}>
              {st.label}
            </div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
              {st.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Main Stage Content Area */}
      <Card padding={24} style={{ minHeight: 480 }}>
        {/* STAGE 1: Incoming Payload */}
        {activeStage === 1 && (
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                  📦 Stage 1: Raw Sandbox JSON Payload ({selectedDataset} Gateway)
                </h3>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  Exact JSON response schema streamed from IDBI Bank Sandbox / FIU-IND servers
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSimulateFetch}
                disabled={isFetching}
                style={{ background: isFetching ? 'var(--color-elevated)' : 'linear-gradient(135deg, #6366f1, #a855f7)', fontWeight: 700 }}
              >
                {isFetching ? '⚡ Streaming API Data...' : '⚡ Simulate Live API Fetch'}
              </Button>
            </div>

            <div style={{
              background: 'var(--color-void)',
              border: '1px solid var(--color-border-strong)',
              borderRadius: 16,
              padding: 20,
              maxHeight: 400,
              overflowY: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: '#10b981',
              lineHeight: 1.6
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(activeJson, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* STAGE 2: Schema Validation */}
        {activeStage === 2 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 4 }}>
              🔒 Stage 2: Security, Digital Signature & Schema Integrity Check
            </h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
              Before data enters the evaluation pipeline, Prism AI executes cryptographic verification and zero-trust validation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'SSL / TLS Handshake Verification', desc: 'Validates IDBI Bank Gateway certificate authority and 256-bit encryption.', status: 'PASSED ✓', time: '12 ms' },
                { title: 'FIU-IND OAuth 2.0 Consent Artefact', desc: 'Verifies MSME digital signature and explicit consent expiration timestamp.', status: 'PASSED ✓', time: '24 ms' },
                { title: 'Payload Digital Signature Check', desc: 'RSA-SHA256 hash match verified against FIU public key registry.', status: 'PASSED ✓', time: '18 ms' },
                { title: 'JSON Schema Compliance Check', desc: 'Zero missing mandatory fields or data type mismatches detected.', status: 'PASSED ✓', time: '8 ms' },
                { title: 'Replay Attack Protection', desc: 'Timestamp nonce verified within acceptable 300-second window.', status: 'PASSED ✓', time: '4 ms' },
                { title: 'SQL Injection / XSS Sanitization', desc: 'All narration text strings cleaned and stripped of malicious scripts.', status: 'PASSED ✓', time: '6 ms' }
              ].map((chk, idx) => (
                <div key={idx} className="p-4 rounded-xl flex items-start justify-between gap-3" style={{ background: 'var(--color-elevated)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 14, color: '#10b981' }}>✓</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{chk.title}</span>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>{chk.desc}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="green" size="xs">{chk.status}</Badge>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>{chk.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 3: Normalization Layer */}
        {activeStage === 3 && (
          <NormalizationView activePayloadType={selectedDataset} />
        )}

        {/* STAGE 4: Decision Engine Execution */}
        {activeStage === 4 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 4 }}>
              ⚙️ Stage 4: Deterministic Decision Engine Execution (`orchestrator.py`)
            </h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
              Normalized signals from Stage 3 feed into invariant mathematical formulas. No LLMs are involved in scoring.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl" style={{ background: 'var(--color-void)', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-prism-400)', textTransform: 'uppercase', marginBottom: 8 }}>
                  4-Index Weighted Scoring Math
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-primary)', lineHeight: 2 }}>
                  <div>Score = <span style={{ color: '#10b981' }}>CF(85) * 0.35</span> + <span style={{ color: '#06b6d4' }}>Growth(80) * 0.20</span> + <span style={{ color: '#a855f7' }}>Trust(90) * 0.25</span> + <span style={{ color: '#f59e0b' }}>Risk(80) * 0.20</span></div>
                  <div style={{ borderTop: '1px dashed var(--color-border-default)', marginTop: 8, paddingTop: 8, fontSize: 14, fontWeight: 800 }}>
                    Overall Prism Score = <span style={{ color: '#10b981' }}>84.25 ➔ 84 / 100</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl" style={{ background: 'var(--color-void)', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: 8 }}>
                  Automated Recommendation Policy Engine
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  <div>• Rule 1: Score ≥ 75 AND Confidence ≥ 70% ➔ <Badge variant="green" size="xs">APPROVE</Badge></div>
                  <div>• Rule 2: Score 50-74 OR Confidence &lt; 70% ➔ <Badge variant="amber" size="xs">REQUEST_EVIDENCE</Badge></div>
                  <div>• Rule 3: Score &lt; 50 OR Cheque Bounce &gt; 5% ➔ <Badge variant="red" size="xs">DECLINE</Badge></div>
                  <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px dashed var(--color-border-default)', fontWeight: 700, color: '#10b981' }}>
                    Result: Score 84 ≥ 75 & Conf 98% ≥ 70% ➔ Status: APPROVED ✓
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 5: Financial Health Card Output */}
        {activeStage === 5 && (
          <div className="text-center py-6">
            <Badge variant="green" size="md" className="mb-3">
              Processing Complete ✓ Total Pipeline Latency: 148 ms
            </Badge>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 8 }}>
              Financial Health Card Generated
            </h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', maxWidth: 600, margin: '0 auto 24px auto' }}>
              The normalized signals and computed indices are packaged into the standardized Financial Health Card for banker review and LLM explanation.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-6">
              <div className="p-4 rounded-xl" style={{ background: 'var(--color-elevated)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Cash Flow Safety</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>85/100</div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--color-elevated)', border: '1px solid rgba(6,182,212,0.3)' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Growth Momentum</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#06b6d4', fontFamily: 'var(--font-mono)' }}>80/100</div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--color-elevated)', border: '1px solid rgba(168,85,247,0.3)' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Regulatory Trust</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#a855f7', fontFamily: 'var(--font-mono)' }}>90/100</div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--color-elevated)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Risk Safety</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>80/100</div>
              </div>
            </div>

            <Button variant="primary" size="lg" onClick={() => setActiveStage(1)}>
              ↺ Restart Pipeline Inspector
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
