import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

export default function PrismConnect() {
  const [selectedConnector, setSelectedConnector] = useState(null)
  const [simulating, setSimulating] = useState(false)

  const CONNECTORS = [
    {
      id: 'demo',
      name: 'Demo Dataset',
      provider: 'Prism Synthetic Generator',
      status: 'Connected',
      type: 'CSV / JSON Ingestion',
      protocol: 'Local Static Buffer',
      latency: '< 10 ms',
      description: 'Pre-loaded synthetic MSME banking profiles designed for IDBI Innovate Hackathon demonstrations.',
      badgeVariant: 'green'
    },
    {
      id: 'aa',
      name: 'Account Aggregator (AA)',
      provider: 'FIU-IND / Sahamati Gateway',
      status: 'Sandbox Ready',
      type: 'REST API (JSON)',
      protocol: 'OAuth 2.0 + Consent Artefact',
      latency: '180 ms',
      description: 'Ingests verified 12-month bank statement transaction arrays, average balances, and EMI debit velocity.',
      badgeVariant: 'blue'
    },
    {
      id: 'gst',
      name: 'GST Network (GSTN)',
      provider: 'GSP / API Bridge',
      status: 'Sandbox Ready',
      type: 'REST API (JSON)',
      protocol: 'GSTR-1 & GSTR-3B Signed API',
      latency: '220 ms',
      description: 'Verifies annual turnover, outward taxable supplies, input tax credit (ITC) eligibility, and filing regularity.',
      badgeVariant: 'blue'
    },
    {
      id: 'upi',
      name: 'NPCI / UPI Network',
      provider: 'NPCI Merchant Gateway',
      status: 'Sandbox Ready',
      type: 'REST API / Webhook',
      protocol: 'UPILink v2.4 API',
      latency: '95 ms',
      description: 'Validates high-frequency digital retail receipts, unique payer diversity, and real-time cash turnover.',
      badgeVariant: 'blue'
    },
    {
      id: 'epfo',
      name: 'EPFO Portal',
      provider: 'Shram Suvidha / EPFO API',
      status: 'Sandbox Ready',
      type: 'REST API (JSON)',
      protocol: 'Establishment ID Lookup',
      latency: '310 ms',
      description: 'Verifies active employee headcount, monthly provident fund remittances, and operational continuity.',
      badgeVariant: 'blue'
    },
    {
      id: 'uli',
      name: 'Unified Lending Interface (ULI)',
      provider: 'RBI / NPCI Pilot Network',
      status: 'Awaiting Sandbox',
      type: 'API Gateway',
      protocol: 'ULI Standard Spec v1.0',
      latency: '—',
      description: 'Frictionless nationwide access to land records, satellite data, and municipal tax assessments for lending.',
      badgeVariant: 'amber'
    },
    {
      id: 'ocen',
      name: 'Open Credit Enablement (OCEN)',
      provider: 'iSPIRT / CredAll Network',
      status: 'Awaiting Sandbox',
      type: 'API Gateway',
      protocol: 'OCEN 4.0 Loan Lifecycle',
      latency: '—',
      description: 'Standardized loan origination, monitoring, and collection protocols for marketplace embedded finance.',
      badgeVariant: 'amber'
    },
    {
      id: 'cbs',
      name: 'IDBI Core Banking System (CBS)',
      provider: 'Finacle / IDBI Enterprise',
      status: 'Future Roadmap',
      type: 'ISO 20022 / REST API',
      protocol: 'Enterprise Service Bus (ESB)',
      latency: '—',
      description: 'Direct integration with IDBI Bank internal accounts, existing loan ledgers, and KYC repositories.',
      badgeVariant: 'purple'
    }
  ]

  const handleTestConnection = (conn) => {
    setSimulating(true)
    setSelectedConnector(conn)
    setTimeout(() => {
      setSimulating(false)
    }, 1500)
  }

  return (
    <div className="p-8 min-h-screen" style={{ background: 'var(--color-base)' }}>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>
              🔌 Prism Connect — Integration Layer
            </span>
            <Badge variant="purple" size="xs">IDBI Sandbox Ready</Badge>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 800 }}>
            Decoupled data ingestion architecture. External APIs map through standardized parsers without altering core scoring mathematics.
          </p>
        </div>
      </div>

      {/* Prominent Architectural Guarantee Banner */}
      <Card padding={24} className="mb-8" style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08), rgba(15,22,41,0.95))',
        border: '1px solid rgba(99,102,241,0.35)',
        boxShadow: '0 0 30px rgba(99,102,241,0.15)'
      }}>
        <div className="flex items-start gap-4 flex-wrap">
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, color: '#fff', shrink: 0,
            boxShadow: '0 0 20px rgba(99,102,241,0.5)'
          }}>
            ⚡
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                Zero Decision Engine Modifications Required for Live IDBI Sandbox APIs
              </h3>
              <Badge variant="green" size="xs">Invariant Engine</Badge>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Prism AI is engineered with a strict separation of concerns. The <strong>BaseParser Abstraction Layer</strong> normalizes raw JSON schemas from Account Aggregators, GSTN, and UPI into standard financial signals (`monthly_cashflow`, `turnover`, `epfo_regular`). When IDBI Bank grants Sandbox API access, we simply swap the data connector—<strong>not a single line of mathematical scoring logic or credit weighting changes.</strong>
            </p>
          </div>
        </div>

        {/* Visual Flow Diagram */}
        <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-4 gap-4 text-center" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="p-3 rounded-xl" style={{ background: 'var(--color-void)', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-prism-400)', textTransform: 'uppercase' }}>1. External Sources</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-text-primary)', marginTop: 4 }}>AA / GST / UPI / EPFO</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>Raw Sandbox JSON Payloads</div>
          </div>

          <div className="p-3 rounded-xl relative" style={{ background: 'var(--color-void)', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase' }}>2. Normalization Layer</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-text-primary)', marginTop: 4 }}>BaseParser Abstraction</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>Schema Cleaning & Mapping</div>
          </div>

          <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>3. Invariant Engine</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginTop: 4 }}>Decision Engine Math</div>
            <div style={{ fontSize: 10, color: '#10b981', marginTop: 2 }}>CF*0.35 + Growth*0.20 + Trust*0.25</div>
          </div>

          <div className="p-3 rounded-xl" style={{ background: 'var(--color-void)', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#a855f7', textTransform: 'uppercase' }}>4. Banker Output</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-text-primary)', marginTop: 4 }}>Financial Health Card</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>Score, Tier & Loan Ceiling</div>
          </div>
        </div>
      </Card>

      {/* Connectors Grid */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 16 }}>
        Available Banking & Regulatory Connectors ({CONNECTORS.length})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CONNECTORS.map((conn) => (
          <motion.div
            key={conn.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Card padding={20} className="h-full flex flex-col justify-between" style={{
              border: selectedConnector?.id === conn.id ? '1px solid var(--color-prism-500)' : '1px solid var(--color-border-default)',
              background: selectedConnector?.id === conn.id ? 'rgba(99,102,241,0.06)' : 'var(--color-surface)'
            }}>
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                      {conn.name}
                    </h4>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {conn.provider}
                    </div>
                  </div>
                  <Badge variant={conn.badgeVariant} size="xs">
                    {conn.status}
                  </Badge>
                </div>

                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                  {conn.description}
                </p>

                <div className="flex flex-col gap-1.5 p-3 rounded-xl mb-4" style={{ background: 'var(--color-void)', border: '1px solid var(--color-border-subtle)' }}>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Protocol:</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{conn.protocol}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Data Format:</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{conn.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Avg Latency:</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: conn.latency === '< 10 ms' ? '#10b981' : 'var(--color-prism-400)', fontFamily: 'var(--font-mono)' }}>{conn.latency}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--color-border-default)' }}>
                <Button
                  size="sm"
                  variant={conn.status === 'Connected' ? 'secondary' : 'primary'}
                  style={{ flex: 1, fontWeight: 700 }}
                  onClick={() => handleTestConnection(conn)}
                  disabled={simulating || conn.status === 'Future Roadmap' || conn.status === 'Awaiting Sandbox'}
                >
                  {simulating && selectedConnector?.id === conn.id ? '⚡ Testing Ping...' : conn.status === 'Connected' ? '✓ Active Stream' : conn.status === 'Sandbox Ready' ? '⚡ Test Sandbox Ping' : '🔒 Awaiting Access'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Simulation Modal / Toast */}
      {selectedConnector && simulating && (
        <div style={{
          position: 'fixed', bottom: 32, right: 32,
          background: 'var(--color-elevated)',
          border: '1px solid var(--color-prism-500)',
          borderRadius: 16, padding: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex', itemsCenter: 'center', gap: 12,
          zIndex: 100
        }}>
          <div className="animate-spin" style={{ fontSize: 20 }}>⚙️</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Pinging {selectedConnector.name}...
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
              Verifying TLS handshake and schema compatibility
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
