import { motion } from 'framer-motion'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'

export default function SandboxReadiness() {
  const navigate = useNavigate()

  const PHASES = [
    {
      step: '01',
      title: 'Hackathon Demo MVP',
      status: 'Completed ✓',
      badgeVariant: 'green',
      period: 'IDBI Innovate Phase 1',
      description: 'Fully functional frontend & deterministic Python Decision Engine validated on synthetic MSME banking datasets.',
      techStack: ['React 18 / Vite', 'FastAPI / Python', 'Gemini 1.5 Pro (Explainer)', 'SQLite Local Cache'],
      deliverables: ['7 Interactive Demo Profiles', '100% Deterministic Math', 'Glassmorphism UI System', 'Client-Side Simulators']
    },
    {
      step: '02',
      title: 'IDBI Sandbox API Integration',
      status: 'Ready for Deployment ⚡',
      badgeVariant: 'purple',
      period: 'Sandbox Shortlist Phase',
      description: 'Swapping static synthetic generators for live REST API connectors to Account Aggregators, GSTN, and UPI networks.',
      techStack: ['FIU-IND OAuth Connectors', 'GSTR-3B Signed Bridge', 'Amazon Bedrock (Llama 3)', 'PostgreSQL Aurora'],
      deliverables: ['BaseParser Ingestion Layer', 'Payload Normalization View', 'Live Confidence Gap Analysis', 'Zero Math Changes Required']
    },
    {
      step: '03',
      title: 'AWS Cloud Scaling & Security',
      status: 'Architected 🏗️',
      badgeVariant: 'blue',
      period: 'Pre-Production Staging',
      description: 'Enterprise containerization, Zero-Trust network security, and automated OCR ingestion for non-digital MSME records.',
      techStack: ['ECS Fargate Containers', 'AWS Textract Document AI', 'AWS WAF + KMS Encryption', 'CloudWatch Audit Trails'],
      deliverables: ['Multi-AZ High Availability', 'SOC2 / ISO 27001 Alignment', 'Encrypted Document Vault', 'Sub-200ms Decision Latency']
    },
    {
      step: '04',
      title: 'Enterprise Production Deployment',
      status: 'Roadmap 🗺️',
      badgeVariant: 'amber',
      period: 'Commercial Rollout',
      description: 'Direct integration into IDBI Bank Core Banking Systems (Finacle) and automated regulatory compliance reporting.',
      techStack: ['ISO 20022 CBS Bus', 'RBI Regulatory Reporting API', 'Real-Time Fraud Guardrails', 'Multi-Branch RBAC'],
      deliverables: ['Automated RBI Audit Mirroring', 'Branch Officer Mobile Copilot', 'Dynamic Loan Pricing Engine', 'Pan-India MSME Reach']
    }
  ]

  return (
    <div className="p-8 min-h-screen" style={{ background: 'var(--color-base)' }}>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>
              🗺️ Prism AI — Sandbox Readiness & Transition Roadmap
            </span>
            <Badge variant="purple" size="md">IDBI Innovate Hackathon</Badge>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 850, lineHeight: 1.6 }}>
            A structured, risk-free transition path from hackathon prototype to production-grade AI underwriting in IDBI Bank's secure Sandbox environment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={() => navigate('/banker/connect')}>
            🔌 Explore Prism Connect ➔
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/banker/payload')}>
            ⚡ View Payload Pipeline ➔
          </Button>
        </div>
      </div>

      {/* Stepper Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {PHASES.map((ph, idx) => (
          <motion.div
            key={ph.step}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="h-full"
          >
            <Card padding={22} className="h-full flex flex-col justify-between relative" style={{
              border: ph.status.includes('Ready') ? '1px solid var(--color-prism-500)' : '1px solid var(--color-border-default)',
              background: ph.status.includes('Ready') ? 'rgba(99,102,241,0.08)' : 'var(--color-surface)',
              boxShadow: ph.status.includes('Ready') ? '0 0 30px rgba(99,102,241,0.15)' : 'none'
            }}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-prism-400)' }}>
                    {ph.step}
                  </span>
                  <Badge variant={ph.badgeVariant} size="xs">
                    {ph.status}
                  </Badge>
                </div>

                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                  {ph.period}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 10 }}>
                  {ph.title}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                  {ph.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="mb-4">
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                    Core Technologies:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ph.techStack.map((tech, i) => (
                      <span key={i} style={{
                        fontSize: 10, fontWeight: 600, color: 'var(--color-text-primary)',
                        background: 'var(--color-void)', padding: '4px 8px', borderRadius: 6,
                        border: '1px solid var(--color-border-subtle)', fontFamily: 'var(--font-mono)'
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border-default)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Key Deliverables:
                </div>
                <div className="flex flex-col gap-1.5">
                  {ph.deliverables.map((del, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span style={{ fontSize: 11, color: '#10b981' }}>✓</span>
                      <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Transition Comparison Grid */}
      <Card padding={24}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 16 }}>
          🔍 Architectural Evolution Comparison Grid
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-elevated)', borderBottom: '1px solid var(--color-border-strong)' }}>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Architectural Layer</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>Phase 1: Hackathon MVP</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-prism-400)', textTransform: 'uppercase' }}>Phase 2: IDBI Sandbox (Shortlist)</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase' }}>Phase 3: AWS Cloud Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                { layer: 'Data Ingestion Source', mvp: 'Static Synthetic JSON / CSV', sandbox: 'Live Account Aggregator & GSTN APIs', cloud: 'Automated OCR + ISO 20022 CBS Bus' },
                { layer: 'Normalization Engine', mvp: 'Client-Side JavaScript Simulators', sandbox: 'FastAPI BaseParser Abstraction Layer', cloud: 'Distributed Lambda Ingestion Pipeline' },
                { layer: 'Decision Engine Math', mvp: '100% Deterministic (orchestrator.py)', sandbox: '100% Deterministic (Zero Math Change)', cloud: '100% Deterministic + Dynamic Pricing' },
                { layer: 'LLM Explainer Copilot', mvp: 'Google Gemini 1.5 Pro (Read-Only)', sandbox: 'Amazon Bedrock / Llama 3 (Read-Only)', cloud: 'Fine-Tuned Banking Narrator on AWS' },
                { layer: 'Database & Storage', mvp: 'SQLite In-Memory / Local Cache', sandbox: 'PostgreSQL Aurora Relational DB', cloud: 'Aurora Serverless + Amazon S3 Vault' },
                { layer: 'Security & Compliance', mvp: 'Standard HTTPS / JWT Auth', sandbox: 'OAuth 2.0 Consent Artefacts + WAF', cloud: 'Zero-Trust IAM + KMS Encryption + CloudTrail' }
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: idx === 5 ? 'none' : '1px solid var(--color-border-default)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                  <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{row.layer}</td>
                  <td style={{ padding: '16px 20px', fontSize: 12, color: 'var(--color-text-secondary)' }}>{row.mvp}</td>
                  <td style={{ padding: '16px 20px', fontSize: 12, fontWeight: 600, color: 'var(--color-prism-400)', background: 'rgba(99,102,241,0.04)' }}>{row.sandbox}</td>
                  <td style={{ padding: '16px 20px', fontSize: 12, color: 'var(--color-text-secondary)' }}>{row.cloud}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
