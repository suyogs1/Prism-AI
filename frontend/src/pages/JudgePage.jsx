import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScoreGauge from '../components/ui/ScoreGauge'
import Badge, { tierVariant, confidenceVariant } from '../components/ui/Badge'
import ConfidenceBand from '../components/ui/ConfidenceBand'
import Card from '../components/ui/Card'
import { DEMO_APPLICATIONS, PIPELINE_STATS } from '../data/mockData'

/**
 * JudgePage — /judge
 *
 * Special view for IDBI Innovate judges to see all demo MSMEs
 * side-by-side: one Green, one Amber, one Red.
 * Shows the full scoring system at a glance.
 */
function MiniScoreBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{value}</span>
      </div>
      <div style={{ height: 4, background: 'var(--color-elevated)', borderRadius: 9999 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{ height: '100%', background: color, borderRadius: 9999, boxShadow: `0 0 6px ${color}80` }}
        />
      </div>
    </div>
  )
}

const INDEX_COLORS = {
  gst: '#6366f1', cashflow: '#10b981', stability: '#a855f7', digital: '#f59e0b', repayment: '#06b6d4',
}

function ApplicationCard({ app, index }) {
  const navigate = useNavigate()
  const tierColors = { GREEN: '#10b981', AMBER: '#f59e0b', RED: '#ef4444' }
  const color = tierColors[app.riskTier]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
    >
      <Card hover glow={`${color}40`} padding={24}
            style={{ cursor: 'pointer', height: '100%' }}
            onClick={() => navigate(`/banker/application/${app.id}`)}>
        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 120, height: 120,
          background: `radial-gradient(circle, ${color}20, transparent)`,
          borderRadius: '50%', pointerEvents: 'none',
        }}/>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={tierVariant(app.riskTier)} dot>{app.riskTier}</Badge>
              <Badge variant={confidenceVariant(app.confidence)} size="xs">{app.confidence}</Badge>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 2 }}>
              {app.businessName}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
              {app.sector} · {app.location}
            </p>
          </div>
        </div>

        {/* Gauge */}
        <div className="flex justify-center mb-4">
          <ScoreGauge score={app.prismScore} tier={app.riskTier} size={140}/>
        </div>

        {/* Confidence */}
        <div className="mb-4">
          <ConfidenceBand level={app.confidence}/>
        </div>

        {/* Sub scores */}
        <div className="flex flex-col gap-2 mb-4">
          {Object.entries(app.subScores).map(([key, val]) => (
            <MiniScoreBar
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={val}
              color={INDEX_COLORS[key] || '#6366f1'}
            />
          ))}
        </div>

        {/* Signals */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: 'Avg Turnover', value: `₹${(app.signals.avgMonthlyTurnover/1000).toFixed(0)}K/mo` },
            { label: 'Filing Gaps',  value: app.signals.filingGaps },
            { label: 'Business Age', value: `${app.signals.businessAge}y` },
            { label: 'Bounce Rate',  value: `${(app.signals.bounceRate*100).toFixed(0)}%` },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--color-elevated)', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Loan */}
        <div style={{ borderTop: '1px solid var(--color-border-default)', paddingTop: 12 }}>
          <div className="flex justify-between">
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Requested</span>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
              ₹{(app.loanAmount/100000).toFixed(1)}L
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Engine Ceiling</span>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color }}>
              {app.recommendedLoan > 0 ? `₹${(app.recommendedLoan/100000).toFixed(1)}L` : '—'}
            </span>
          </div>
        </div>

        <div className="mt-3 text-center" style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          Click to open full Prism Report →
        </div>
      </Card>
    </motion.div>
  )
}

export default function JudgePage() {
  const navigate = useNavigate()
  // Show one of each tier
  const showcase = [
    DEMO_APPLICATIONS.find(a => a.riskTier === 'GREEN'),
    DEMO_APPLICATIONS.find(a => a.riskTier === 'AMBER'),
    DEMO_APPLICATIONS.find(a => a.riskTier === 'RED'),
  ].filter(Boolean)

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-base)' }}>
      {/* Top bar */}
      <div className="glass border-b px-8 py-4 flex items-center justify-between"
           style={{ borderColor: 'var(--color-border-default)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>
              🏆 Judge View
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 8px',
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 9999, color: 'var(--color-prism-400)', textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>IDBI Innovate 2024</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            Prism AI Demo — Three MSME profiles across all risk tiers. Click any card to see the full Prism Report.
          </p>
        </div>
        <button onClick={() => navigate('/')} style={{
          background: 'var(--color-elevated)', border: '1px solid var(--color-border-default)',
          borderRadius: 10, padding: '8px 16px', color: 'var(--color-text-secondary)',
          fontSize: 13, cursor: 'pointer',
        }}>
          ← Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Demo Applications', value: '3', icon: '📋', color: '#6366f1' },
            { label: 'Scoring Engine', value: 'Live', icon: '⚡', color: '#10b981' },
            { label: 'Data Indices', value: '5', icon: '📊', color: '#a855f7' },
            { label: 'LLM Explainer', value: 'Gemini', icon: '✦', color: '#f59e0b' },
          ].map(s => (
            <Card key={s.label} padding={16}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${s.color}15`, border: `1px solid ${s.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text-primary)' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{s.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Architecture note */}
        <div className="mb-6 p-4 rounded-xl" style={{
          background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
        }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>Core Principle:</strong>{' '}
            The Prism Engine is fully deterministic — it computes all scores, indices, and loan recommendations
            from alternate financial data without any LLM involvement. The LLM (Gemini) only narrates the engine's
            output in natural language. All lending decisions remain with the human underwriter.
          </p>
        </div>

        {/* Three cards */}
        <div className="grid grid-cols-3 gap-6">
          {showcase.map((app, i) => (
            <ApplicationCard key={app.id} app={app} index={i}/>
          ))}
        </div>
      </div>
    </div>
  )
}
