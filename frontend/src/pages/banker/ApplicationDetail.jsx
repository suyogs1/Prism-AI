import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import useApplicationStore from '../../store/applicationStore'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ScoreGauge from '../../components/ui/ScoreGauge'
import ConfidenceBand from '../../components/ui/ConfidenceBand'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { evaluateProfile, generateFallbackExplanation } from '../../utils/decisionEngine'
import scoringService from '../../services/scoringService'
import DataLineage from '../../components/ui/DataLineage'
import ScoreTrace from '../../components/ui/ScoreTrace'
import ConfidenceGap from '../../components/ui/ConfidenceGap'
import ScoreDelta from '../../components/ui/ScoreDelta'
import AIGuardrails from '../../components/ui/AIGuardrails'
import useAuditStore from '../../store/auditStore'

// Helper for color coding scores
const getScoreColor = (score) => {
  if (score >= 75) return '#10b981' // Success (Green)
  if (score >= 50) return '#f59e0b' // Warning (Amber)
  return '#ef4444' // Danger (Red)
}

const DOC_KEYS = {
  "Bank Statement": "bank_statements_present",
  "GST Return": "gst_present",
  "EPFO Summary": "epfo_present",
  "UPI History": "upi_present"
}

const DOC_CONFIDENCE_GAINS = {
  "Bank Statement": "+40%",
  "GST Return": "+25%",
  "EPFO Summary": "+15%",
  "UPI History": "+10%"
}

// Risk Flag metadata for descriptions and potential impact
const RISK_METADATA = {
  "Customer Concentration": {
    severity: "MEDIUM",
    color: "#f59e0b",
    desc: "More than 40% of sales are concentrated in a single buyer group.",
    impact: "Exposes company to sudden cash flow shock if the primary client defaults or cancels contracts."
  },
  "Supplier Dependency": {
    severity: "MEDIUM",
    color: "#f59e0b",
    desc: "Over 50% of supply volume depends on a single supplier.",
    impact: "High risk of production delays or supply cost shocks if vendor undergoes insolvency."
  },
  "Cheque Bounce Rate": {
    severity: "HIGH",
    color: "#ef4444",
    desc: "Payment bounces detected in bank statement logs exceed the safe 5% threshold.",
    impact: "Critical liquidity shortage. Immediate leading indicator of future credit default."
  },
  "High Leverage": {
    severity: "HIGH",
    color: "#ef4444",
    desc: "Total outstanding credit balance exceeds 50% of annual turnover.",
    impact: "Debt servicing consumes operating surplus, reducing room to repay new funding limits."
  }
}

// Subscore radial gauge
function SubScoreRadialCard({ label, score, weight, description }) {
  const color = getScoreColor(score)
  const size = 80
  const strokeWidth = 5
  const radius = (size / 2) - strokeWidth
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="group relative flex items-center gap-4 p-4 rounded-xl text-left" style={{
      background: 'var(--color-elevated)',
      border: '1px solid var(--color-border-subtle)',
    }}>
      {/* Radial SVG Arc */}
      <div className="relative" style={{ width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.04)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-black" style={{ color }}>
          {score}
        </div>
      </div>

      {/* Meta Content */}
      <div className="flex-1">
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', display: 'block' }}>{label}</span>
        <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2, display: 'block' }}>
          Weight: {Math.round(weight * 100)}%
        </span>
      </div>

      {/* CSS Hover Tooltip */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 scale-95 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(10,15,30,0.95)] p-3 text-xs text-white opacity-0 shadow-2xl transition-all group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 backdrop-blur-md">
        <div className="font-bold mb-1" style={{ color }}>{label} Index</div>
        <div className="text-[11px] text-gray-300 leading-normal">{description}</div>
      </div>
    </div>
  )
}

// Summary Mini Card
function SummaryMiniCard({ label, value, icon, color = 'var(--color-text-secondary)' }) {
  return (
    <div style={{
      background: 'var(--color-elevated)',
      border: '1px solid var(--color-border-subtle)',
      borderRadius: 12,
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flex: 1,
      minWidth: 140
    }} className="text-left">
      <span className="text-lg" style={{ color }}>{icon}</span>
      <div>
        <span style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', marginTop: 2, display: 'block' }}>{value}</span>
      </div>
    </div>
  )
}

// Confidence Row
function ConfidenceRow({ label, score, max, color, present }) {
  const percent = Math.round((score / max) * 100)
  return (
    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border-subtle)' }}>
      <div style={{ flex: 1 }} className="text-left">
        <div className="flex justify-between items-center mb-1">
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>{label}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{score} pts / {max} max</span>
        </div>
        <div style={{ height: 4, background: 'var(--color-surface)', borderRadius: 9999 }}>
          <motion.div
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6 }}
            style={{ height: '100%', background: color, borderRadius: 9999 }}
          />
        </div>
      </div>
      <div style={{ width: 100, textAlign: 'right' }} className="pl-3">
        <Badge variant={present ? 'green' : 'amber'}>
          {present ? 'Verified' : 'Missing'}
        </Badge>
      </div>
    </div>
  )
}

// AI Explainer Panel
function AIExplainerPanel({ text, isLoading }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { if (!isLoading) setVisible(true) }, [isLoading])

  return (
    <Card padding={24} style={{
      background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(168,85,247,0.04) 100%)',
      border: '1px solid rgba(99,102,241,0.15)',
    }}>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, boxShadow: '0 0 16px rgba(99,102,241,0.4)',
          }}>✦</div>
          <div className="text-left">
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>Prism Underwriting Narrative</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
              Generated explanation of Decision Engine parameters
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[85, 95, 70, 45].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: 12, width: `${w}%` }}/>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
          transition={{ duration: 0.5 }}
          className="text-left flex flex-col gap-3"
          style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}
        >
          {(text || '').split('\n').map((line, i) => {
            if (line.startsWith('###')) {
              return (
                <h4 key={i} style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-text-primary)', marginTop: 12, marginBottom: 4 }}>
                  {line.replace('###', '').trim()}
                </h4>
              )
            }
            if (line.startsWith('-')) {
              return (
                <div key={i} style={{ paddingLeft: 12, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#6366f1' }}>•</span>
                  {line.substring(1).trim()}
                </div>
              )
            }
            if (line.trim() === '') return <div key={i} style={{ height: 4 }} />
            return <p key={i} style={{ margin: 0 }}>{line}</p>
          })}
        </motion.div>
      )}

      <div className="flex items-start gap-2 mt-5 pt-4" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
        <span style={{ fontSize: 10, color: 'var(--color-text-muted)', lineHeight: 1.5, textAlign: 'left' }}>
          🔒 This report narrates computed engine parameters only. The AI model is strictly forbidden from altering scores, performing calculations, or overriding credit decisions.
        </span>
      </div>
    </Card>
  )
}

export default function ApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const { selectedApplication, fetchApplication, loading } = useApplicationStore()

  // Client-side simulation state
  const [profileState, setProfileState] = useState(null)
  const [decisionState, setDecisionState] = useState(null)
  const [uploadingDoc, setUploadingDoc] = useState(null)
  const [jsonCollapsed, setJsonCollapsed] = useState(true)
  const [actionModal, setActionModal] = useState(null)
  const [presentationMode, setPresentationMode] = useState(false)
  const [deltaInfo, setDeltaInfo] = useState(null)
  const { addRecord } = useAuditStore()

  useEffect(() => {
    const checkClass = () => {
      setPresentationMode(document.body.classList.contains('presentation-mode'))
    }
    checkClass()
    const obs = new MutationObserver(checkClass)
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])


  useEffect(() => {
    fetchApplication(id)
  }, [id])

  // Synchronise profile & decision when application loads from backend
  useEffect(() => {
    if (selectedApplication && selectedApplication.profile) {
      setProfileState(selectedApplication.profile)
      setDecisionState(selectedApplication.decision)
    }
  }, [selectedApplication])

  // Re-run the Decision Engine on the client when profile state changes
  useEffect(() => {
    if (profileState) {
      const updatedDecision = evaluateProfile(profileState)
      setDecisionState(updatedDecision)
    }
  }, [profileState])

  const [explanationText, setExplanationText] = useState('')
  const [explainerLoading, setExplainerLoading] = useState(true)

  // Fetch explanation from API on mount/app change
  useEffect(() => {
    async function loadExplanation() {
      setExplainerLoading(true)
      try {
        const res = await scoringService.getExplanation(id)
        setExplanationText(res.explanation)
      } catch (err) {
        if (decisionState) {
          const fallback = generateFallbackExplanation(decisionState, selectedApplication.businessName)
          setExplanationText(fallback)
        }
      } finally {
        setExplainerLoading(false)
      }
    }
    if (id && selectedApplication) {
      loadExplanation()
    }
  }, [id, selectedApplication])

  // Regenerate explanation client-side when decisionState changes during simulation
  useEffect(() => {
    if (decisionState && selectedApplication) {
      const updatedExplanation = generateFallbackExplanation(decisionState, selectedApplication.businessName)
      setExplanationText(updatedExplanation)
    }
  }, [decisionState])

  const handleSimulateUpload = (docName) => {
    const key = DOC_KEYS[docName]
    if (!key || uploadingDoc) return

    setUploadingDoc(docName)
    const prevScore = decisionState.overall_score
    const prevConf = decisionState.confidence

    // Simulate Secure Upload + Engine recalculation (1.2s delay)
    setTimeout(() => {
      setProfileState(prev => {
        const nextProfile = { ...prev, [key]: true }
        const nextDecision = evaluateProfile(nextProfile)
        setDeltaInfo({
          visible: true,
          oldScore: prevScore,
          newScore: nextDecision.overall_score,
          oldConfidence: prevConf,
          newConfidence: nextDecision.confidence,
          docName
        })
        return nextProfile
      })
      setUploadingDoc(null)
    }, 1200)
  }

  if (loading || !selectedApplication || !decisionState || !profileState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--color-base)' }}>
        <LoadingSpinner size={32} />
        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Evaluating profile via Decision Engine...</span>
      </div>
    )
  }

  const app = selectedApplication
  const decision = decisionState // Consume interactive simulation decision
  const tierColor = getScoreColor(decision.overall_score)

  // Status mapping
  const statusLabels = {
    "APPROVE": { label: "Approved", variant: "green" },
    "REQUEST_EVIDENCE": { label: "Request Evidence", variant: "amber" },
    "REVIEW": { label: "Review Required", variant: "blue" },
    "DECLINE": { label: "Decline", variant: "red" }
  }
  const statCfg = statusLabels[decision.recommendation] || { label: decision.recommendation, variant: "default" }

  const radarData = [
    { name: 'Cash Flow', value: decision.financial_health_card.cash_flow },
    { name: 'Growth', value: decision.financial_health_card.growth },
    { name: 'Trust', value: decision.financial_health_card.trust },
    { name: 'Risk Safety', value: decision.financial_health_card.risk }
  ]

  // Compute MSME Category dynamically
  const turnover = profileState.turnover || 0
  const msmeCategory = turnover < 50000000 ? "Micro Enterprise" : turnover < 500000000 ? "Small Enterprise" : "Medium Enterprise"

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--color-base)' }}>
      {deltaInfo && deltaInfo.visible && (
        <ScoreDelta
          oldScore={deltaInfo.oldScore}
          newScore={deltaInfo.newScore}
          oldConfidence={deltaInfo.oldConfidence}
          newConfidence={deltaInfo.newConfidence}
          docName={deltaInfo.docName}
          onClose={() => setDeltaInfo(null)}
        />
      )}
      
      {/* CONFETTI/ACTION MODAL POPUP */}
      <AnimatePresence>
        {actionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(5, 7, 15, 0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
              backdropFilter: 'blur(8px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              style={{
                width: 420, padding: 32, background: 'var(--color-surface)',
                border: '1px solid var(--color-border-strong)', borderRadius: 20,
                boxShadow: '0 0 40px rgba(0,0,0,0.5)', textAlign: 'center'
              }}
            >
              <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>
                {actionModal === 'APPROVE' ? '🎉' : actionModal === 'REQUEST' ? '📁' : '⛔'}
              </span>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {actionModal === 'APPROVE' ? 'Credit Application Approved' : actionModal === 'REQUEST' ? 'Evidence Requested' : 'Application Declined'}
              </h2>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8, lineHeight: 1.6 }}>
                {actionModal === 'APPROVE' && ` Sharma Textiles has been approved for a funding ceiling of ₹${(decision.recommended_loan_amount || 0).toLocaleString('en-IN')}. Relaying details to core loan operations.`}
                {actionModal === 'REQUEST' && 'Supplementary document checklist sent to client relationship portal. Application status set to Pending Evidence.'}
                {actionModal === 'DECLINE' && 'Application declined. Underwriting parameters stored in record base.'}
              </p>
              <button
                onClick={() => setActionModal(null)}
                style={{
                  marginTop: 24, width: '100%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: 'none',
                  borderRadius: 10, padding: '10px 16px', color: '#fff', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', boxShadow: '0 0 16px rgba(99,102,241,0.3)'
                }}
              >
                Close View
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-8">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-6">
          <button onClick={() => navigate('/banker/dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--color-text-muted)' }}>
            Pipeline
          </button>
          <span style={{ color: 'var(--color-text-muted)' }}>›</span>
          <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{app.businessName}</span>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>#{app.id}</span>
        </motion.div>

        {/* Header Card */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card padding={28} style={{
            border: `1px solid ${tierColor}25`,
            marginBottom: 24, position: 'relative', overflow: 'hidden',
          }}>
            {/* Ambient background glow */}
            <div style={{
              position: 'absolute', top: -50, right: -50,
              width: 200, height: 200,
              background: `radial-gradient(circle, ${tierColor}15, transparent)`,
              pointerEvents: 'none',
            }}/>
            
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={statCfg.variant} dot>{statCfg.label}</Badge>
                  <Badge variant={decision.confidence >= 70 ? "green" : decision.confidence >= 40 ? "amber" : "red"}>
                    {decision.confidence}% Confidence
                  </Badge>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{app.id}</span>
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-text-primary)', marginBottom: 6 }}>
                  {app.businessName}
                </h1>
                <div className="flex gap-4 flex-wrap">
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>👤 {app.ownerName || 'MSME Owner'}</span>
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>🏭 {app.sector}</span>
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>📍 {app.location}</span>
                </div>
              </div>
              
              {/* Final Decision Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setActionModal('DECLINE')
                    addRecord({
                      applicationId: app.id,
                      businessName: app.businessName,
                      action: 'DECLINE',
                      reason: 'Underwriter assessment decision',
                      previousStatus: app.status,
                      newStatus: 'DECLINE',
                      score: decision.overall_score
                    })
                  }}
                  style={{
                    background: 'var(--color-elevated)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 10, padding: '9px 18px', color: '#ef4444',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >Decline</button>
                <button
                  onClick={() => {
                    setActionModal('REQUEST')
                    addRecord({
                      applicationId: app.id,
                      businessName: app.businessName,
                      action: 'REQUEST_EVIDENCE',
                      reason: 'Supplementary document checklist requested',
                      previousStatus: app.status,
                      newStatus: 'REQUEST_EVIDENCE',
                      score: decision.overall_score
                    })
                  }}
                  style={{
                    background: 'var(--color-elevated)', border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: 10, padding: '9px 18px', color: '#f59e0b',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >Request Evidence</button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setActionModal('APPROVE')
                    addRecord({
                      applicationId: app.id,
                      businessName: app.businessName,
                      action: 'APPROVE',
                      reason: 'Approved for recommended loan ceiling',
                      previousStatus: app.status,
                      newStatus: 'APPROVE',
                      score: decision.overall_score
                    })
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    border: 'none', borderRadius: 10, padding: '9px 18px',
                    color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(16,185,129,0.3)',
                  }}
                >Approve</motion.button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 1. APPLICANT SUMMARY PREMIUM METADATA CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex flex-wrap gap-4 mb-6"
        >
          <SummaryMiniCard label="Business Sector" value={app.sector} icon="🏭" />
          <SummaryMiniCard label="Business Age" value={`${profileState.business_age} Years`} icon="📅" />
          <SummaryMiniCard label="Annual Turnover" value={`₹${(profileState.turnover / 10000000).toFixed(2)} Cr`} icon="📊" />
          <SummaryMiniCard label="Existing Debts" value={`₹${(profileState.existing_loans_balance || 0).toLocaleString('en-IN')}`} icon="💰" />
          <SummaryMiniCard label="MSME Classification" value={msmeCategory} icon="🏢" color="#6366f1" />
          <SummaryMiniCard label="Udyam Status" value="Verified ✓" icon="🛡" color="#10b981" />
        </motion.div>

        {/* Main Body Grid */}
        <div className="grid gap-5" style={{ gridTemplateColumns: '320px 1fr' }}>
          
          {/* Left Column - Financial Health Score & Sizing */}
          <div className="flex flex-col gap-5">
            {/* Financial Health Score card */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card padding={24} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  Financial Health Card
                </div>
                {/* Circular Score Gauge */}
                <ScoreGauge score={decision.overall_score} tier={decision.overall_score >= 75 ? 'GREEN' : decision.overall_score >= 50 ? 'AMBER' : 'RED'} size={180}/>
                
                {/* Confidence Bar */}
                <div style={{ width: '100%', marginTop: 8 }}>
                  <ConfidenceBand level={decision.confidence >= 70 ? 'HIGH' : decision.confidence >= 40 ? 'MEDIUM' : 'LOW'} completeness={decision.confidence}/>
                </div>

                <div style={{ width: '100%', marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <DataLineage metricName="Overall Profile Score" lastUpdated="Just now" />
                  <ScoreTrace scoreName="Prism 4-Index Evaluation" totalScore={decision.overall_score} />
                </div>
              </Card>
            </motion.div>

            {/* Loan Sizing Recommended Amount */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <Card padding={22}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>Loan Sizing Sizing</h3>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 16 }}>Computed deterministically · Not an approval</p>
                
                <div className="flex flex-col gap-4">
                  <div style={{ padding: 12, background: 'var(--color-elevated)', borderRadius: 10 }}>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Requested Loan</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      ₹{(app.loanAmount || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                  
                  <div style={{ padding: 12, background: `${tierColor}10`, border: `1px solid ${tierColor}25`, borderRadius: 10 }}>
                    <div style={{ fontSize: 10, color: tierColor, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 4 }}>Prism Recommended Ceiling</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: tierColor, fontFamily: 'var(--font-mono)' }}>
                      ₹{(decision.recommended_loan_amount || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* 3. CONFIDENCE BREAKDOWN WITH VERIFIED INDICATORS */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card padding={22}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>Confidence Breakdown</h3>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 16 }}>Evidence source verification metrics</p>
                
                <div className="flex flex-col gap-3">
                  <ConfidenceRow label="Account Aggregator (AA) statements" score={decision.confidence_breakdown.aa || 0} max={40} color="#06b6d4" present={profileState.bank_statements_present} />
                  <ConfidenceRow label="GST Returns compliance" score={decision.confidence_breakdown.gst || 0} max={25} color="#6366f1" present={profileState.gst_present} />
                  <ConfidenceRow label="EPFO filings history" score={decision.confidence_breakdown.epfo || 0} max={15} color="#a855f7" present={profileState.epfo_present} />
                  <ConfidenceRow label="UPI transaction history" score={decision.confidence_breakdown.upi || 0} max={10} color="#f59e0b" present={profileState.upi_present} />
                  <ConfidenceRow label="Relationship history signals" score={decision.confidence_breakdown.relationship || 0} max={10} color="#10b981" present={profileState.relationship_present} />
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Sub-scores & Alert flags */}
          <div className="flex flex-col gap-5">
            
            {/* 5. EVIDENCE COMPLETION ENGINE PANEL */}
            {app.decision.recommendation === "REQUEST_EVIDENCE" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                {decision.missing_evidence.length > 0 ? (
                  <Card padding={24} style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.06) 100%)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    boxShadow: '0 0 24px rgba(99,102,241,0.2)',
                  }}>
                    <div className="flex items-center gap-3 mb-4 text-left">
                      <span className="text-xl">📁</span>
                      <div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>Evidence Completion Panel</h3>
                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                          This application is flagged as <strong>Request Evidence</strong>. Review estimated gains and upload supplementary data to raise confidence.
                        </p>
                      </div>
                    </div>

                    <ConfidenceGap currentConfidence={decision.confidence} missingEvidence={decision.missing_evidence} onSimulateUpload={handleSimulateUpload} />
                  </Card>
                ) : (
                  <Card padding={24} style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.06) 100%)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    boxShadow: '0 0 24px rgba(16,185,129,0.15)',
                  }}>
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-xl">🎉</span>
                      <div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>Evidence Checklist Completed</h3>
                        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                          All missing evidence has been verified. Scoring confidence has reached <strong>{decision.confidence}%</strong>, and the decision is upgraded to <strong>{statCfg.label}</strong> with recommended loan ceiling unlocked!
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>
            )}

            {/* 2. FOUR SUB-SCORES - RADIAL CIRCULAR INDICATORS */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="grid grid-cols-2 gap-4">
                <SubScoreRadialCard
                  label="Cash Flow"
                  score={decision.financial_health_card.cash_flow}
                  weight={0.35}
                  description="Evaluates cash inflow surplus ratios, DSCR coverage proxy, and monthly operational balances relative to standard operational outgoings."
                />
                <SubScoreRadialCard
                  label="Growth"
                  score={decision.financial_health_card.growth}
                  weight={0.20}
                  description="Measures year-over-year revenue scaling trajectory, digital banking transaction velocity, and overall turnover trends."
                />
                <SubScoreRadialCard
                  label="Trust Index"
                  score={decision.financial_health_card.trust}
                  weight={0.25}
                  description="Reflects the business operational age, regulatory filing regularity (GST/EPFO), and relationship history longevity."
                />
                <SubScoreRadialCard
                  label="Risk Safety"
                  score={decision.financial_health_card.risk}
                  weight={0.20}
                  description="Deducts penalty points for suppliers or buyers concentration dependencies, cheque bounces, and high leverage."
                />
              </div>
            </motion.div>

            {/* Radar chart + Alert Flags Row */}
            <div className="grid grid-cols-2 gap-5">
              {/* Radar chart visualization */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card padding={22}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 14 }}>Score Radar</h3>
                  <div className="flex justify-center items-center h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.06)"/>
                        <PolarAngleAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10 }}/>
                        <Radar dataKey="value" stroke={tierColor} fill={tierColor} fillOpacity={0.15} strokeWidth={2}/>
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>

              {/* 4. RISK FLAGS WITH SEVERITY & IMPACT */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex flex-col gap-4">
                <Card padding={20} style={{ flex: 1 }} className="text-left">
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 12 }}>
                    🚨 Detected Risk Flags ({decision.risk_flags.length})
                  </h3>
                  {decision.risk_flags.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {decision.risk_flags.map(f => {
                        const meta = RISK_METADATA[f] || { severity: "MEDIUM", color: "#f59e0b", desc: "Flagged by scoring engine parameters.", impact: "May affect repayments." }
                        return (
                          <div key={f} style={{
                            padding: '12px', background: 'var(--color-void)',
                            border: `1px solid var(--color-border-default)`, borderRadius: 10,
                          }}>
                            <div className="flex justify-between items-center mb-1">
                              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--color-text-primary)' }}>{f}</span>
                              <span style={{
                                fontSize: 9, fontWeight: 900, color: meta.color,
                                background: `${meta.color}10`, padding: '2px 6px', borderRadius: 4,
                                border: `1px solid ${meta.color}20`
                              }}>{meta.severity}</span>
                            </div>
                            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', lineHeight: 1.4, margin: 0 }}>
                              <strong>Trigger:</strong> {meta.desc}
                            </p>
                            <p style={{ fontSize: 10, color: 'rgba(239,68,68,0.7)', lineHeight: 1.4, marginTop: 4, marginBottom: 0 }}>
                              <strong>Potential Impact:</strong> {meta.impact}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                      ✓ Safe profile. No risk flags triggered by decision engine rules.
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>

            {/* 7. AI Explanation Panel */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="mb-4">
              <AIExplainerPanel text={explanationText} isLoading={explainerLoading}/>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.29 }} className="mb-4">
              <AIGuardrails />
            </motion.div>

            {/* 6. COLLAPSIBLE DECISION JSON PANEL */}
            {!presentationMode && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.29 }}>
                <Card padding={16} style={{ border: '1px solid var(--color-border-strong)' }}>
                  <button
                    onClick={() => setJsonCollapsed(!jsonCollapsed)}
                    className="flex items-center justify-between w-full font-bold text-left"
                    style={{ cursor: 'pointer', fontSize: 13, background: 'none', border: 'none', color: 'var(--color-text-primary)' }}
                  >
                    <span className="flex items-center gap-2">⚙ Collapsible Decision Engine JSON Output</span>
                    <span>{jsonCollapsed ? '▼' : '▲'}</span>
                  </button>
                  {!jsonCollapsed && (
                    <motion.pre
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{
                        marginTop: 12,
                        padding: 12,
                        background: 'var(--color-void)',
                        borderRadius: 8,
                        fontSize: 10,
                        overflowX: 'auto',
                        fontFamily: 'var(--font-mono)',
                        color: '#10b981',
                      }}
                    >
                      {JSON.stringify(decision, null, 2)}
                    </motion.pre>
                  )}
                </Card>
              </motion.div>
            )}

            {/* Underwriter notes */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card padding={22}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 12 }}>
                  Underwriter Assessment Notes
                </h3>
                <textarea
                  placeholder="Record your observations regarding cash flow stability or missing evidence here..."
                  style={{
                    width: '100%', minHeight: 90,
                    background: 'var(--color-elevated)', border: '1px solid var(--color-border-default)',
                    borderRadius: 10, color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-sans)', fontSize: 13, padding: '10px 14px',
                    outline: 'none', resize: 'vertical', lineHeight: 1.6,
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-border-default)'}
                />
                <div className="flex justify-end mt-2">
                  <button style={{
                    background: 'var(--color-elevated)', border: '1px solid var(--color-border-strong)',
                    borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600,
                    color: 'var(--color-text-secondary)', cursor: 'pointer',
                  }}>Save Assessment Notes</button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
