import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useApplicationStore from '../../store/applicationStore'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ScoreGauge from '../../components/ui/ScoreGauge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { evaluateProfile, generateFallbackExplanation } from '../../utils/decisionEngine'
import scoringService from '../../services/scoringService'

// Helper for friendly score coloring
const getHealthColor = (score) => {
  if (score >= 75) return '#10b981' // Green (Strong)
  if (score >= 50) return '#f59e0b' // Amber (Good Progress)
  return '#ef4444' // Red (Needs Action)
}

const DOC_METADATA = {
  "Bank Statement": {
    why: "Verifies your daily sales revenue and checks if you have regular cash inflows to cover business operations.",
    gain: "+40% Verification Confidence",
    impact: "Primary requirement to establish loan eligibility ceiling."
  },
  "GST Return": {
    why: "Confirms your statutory tax submissions, verifying your business registration compliance and actual billing trajectory.",
    gain: "+25% Verification Confidence",
    impact: "Unlocks up to ₹1,50,000 in eligible funding capacity."
  },
  "EPFO Summary": {
    why: "Confirms your active payroll size, employee registry, and salary compliance, demonstrating stable corporate operations.",
    gain: "+15% Verification Confidence",
    impact: "Verifies operational longevity and boosts overall credit score."
  },
  "UPI History": {
    why: "Verifies micro-transaction flows, customer volume, and cash-in-hand velocity from digital retail platforms.",
    gain: "+10% Verification Confidence",
    impact: "Unlocks additional credit buffer and short-term capital limits."
  }
}

const DOC_KEYS = {
  "Bank Statement": "bank_statements_present",
  "GST Return": "gst_present",
  "EPFO Summary": "epfo_present",
  "UPI History": "upi_present"
}

// Friendly metric subscore component
function FriendlyHealthCard({ label, score, description, color }) {
  return (
    <div style={{
      background: 'var(--color-elevated)',
      border: '1px solid var(--color-border-subtle)',
      borderRadius: 14,
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }} className="text-left">
      <div className="flex justify-between items-center">
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{label}</span>
        <span style={{
          fontSize: 13, fontWeight: 800, color, fontFamily: 'var(--font-mono)',
          background: `${color}10`, padding: '2px 8px', borderRadius: 6
        }}>{score}/100</span>
      </div>
      <div style={{ height: 4, background: 'var(--color-surface)', borderRadius: 9999 }}>
        <motion.div
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8 }}
          style={{ height: '100%', background: color, borderRadius: 9999 }}
        />
      </div>
      <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{description}</span>
    </div>
  )
}

// Timeline Step Component
function TimelineJourneyStep({ label, status, done, active, isLast }) {
  const badgeColor = done ? '#10b981' : active ? '#6366f1' : 'var(--color-text-muted)'
  return (
    <div className="flex-1 flex flex-col items-center relative text-center">
      {/* Horizontal connector line */}
      {!isLast && (
        <div style={{
          position: 'absolute', top: 12, left: '50%', right: '-50%', height: 2,
          background: done ? 'linear-gradient(90deg, #10b981, #6366f1)' : 'var(--color-border-subtle)',
          zIndex: 1
        }}/>
      )}
      
      {/* Step Dot */}
      <div style={{
        width: 26, height: 26, borderRadius: '50%',
        background: done ? 'linear-gradient(135deg, #10b981, #06b6d4)' : active ? 'rgba(99,102,241,0.15)' : 'var(--color-elevated)',
        border: active ? '2px solid #6366f1' : done ? 'none' : '2px solid var(--color-border-default)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, color: '#fff', fontWeight: 'bold', zIndex: 2,
        boxShadow: active ? '0 0 14px rgba(99,102,241,0.35)' : 'none'
      }}>
        {done ? '✓' : '●'}
      </div>
      
      <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', marginTop: 8, display: 'block' }}>
        {label}
      </span>
      <span style={{ fontSize: 10, color: badgeColor, fontWeight: 600, marginTop: 2, display: 'block' }}>
        {status}
      </span>
    </div>
  )
}

function AIExplainerPanel({ text, isLoading }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { if (!isLoading) setVisible(true) }, [isLoading])

  return (
    <Card padding={24} style={{
      background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(168,85,247,0.04) 100%)',
      border: '1px solid rgba(99,102,241,0.15)',
    }}>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2 text-left">
        <div className="flex items-center gap-3">
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, boxShadow: '0 0 16px rgba(99,102,241,0.4)',
          }}>✦</div>
          <div>
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

export default function MSMEDashboard() {
  const navigate = useNavigate()
  
  // Connect to the applications store, defaulting to Sharma Textiles PRZ-2024-001
  const { selectedApplication, fetchApplication, loading } = useApplicationStore()

  const [profileState, setProfileState] = useState(null)
  const [decisionState, setDecisionState] = useState(null)
  const [uploadingDoc, setUploadingDoc] = useState(null)
  const [explanationText, setExplanationText] = useState('')
  const [explainerLoading, setExplainerLoading] = useState(true)

  useEffect(() => {
    fetchApplication('PRZ-2024-001')
  }, [])

  useEffect(() => {
    if (selectedApplication && selectedApplication.profile) {
      setProfileState(selectedApplication.profile)
      setDecisionState(selectedApplication.decision)
    }
  }, [selectedApplication])

  useEffect(() => {
    if (profileState) {
      const res = evaluateProfile(profileState)
      setDecisionState(res)
    }
  }, [profileState])

  // Fetch friendly explanation from backend explain router
  useEffect(() => {
    async function loadExplanation() {
      setExplainerLoading(true)
      try {
        const res = await scoringService.getExplanation('PRZ-2024-001')
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
    if (selectedApplication) {
      loadExplanation()
    }
  }, [selectedApplication])

  // Recalculate explanation client-side on document updates
  useEffect(() => {
    if (decisionState && selectedApplication) {
      const fallback = generateFallbackExplanation(decisionState, selectedApplication.businessName)
      setExplanationText(fallback)
    }
  }, [decisionState])

  const handleUpload = (docName) => {
    const key = DOC_KEYS[docName]
    if (!key || uploadingDoc) return

    setUploadingDoc(docName)

    // Simulate secure document upload
    setTimeout(() => {
      setProfileState(prev => ({
        ...prev,
        [key]: true
      }))
      setUploadingDoc(null)
    }, 1200)
  }

  if (loading || !selectedApplication || !decisionState || !profileState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--color-base)' }}>
        <LoadingSpinner size={32} />
        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Loading your dashboard...</span>
      </div>
    )
  }

  const app = selectedApplication
  const decision = decisionState
  const healthColor = getHealthColor(decision.overall_score)

  // Non-technical status wording
  const getHealthStatusText = (score) => {
    if (score >= 75) return 'Excellent Health'
    if (score >= 50) return 'Healthy Progress'
    return 'Action Requested'
  }

  const getReadinessDesc = (score) => {
    if (score >= 75) return 'Eligible for immediate financing. Your relationship manager is processing your final terms.'
    if (score >= 50) return 'Almost there! Providing supplementary records will verify pending parameters and unlock your ceiling.'
    return 'Action needed. Submit the requested documents below to establish your business reliability metrics.'
  }

  // Friendly strengths list generator
  const strengths = []
  if (profileState.business_age >= 3) {
    strengths.push({ title: "✓ Established Business History", desc: `Active operations for over ${profileState.business_age} years shows longevity.` })
  }
  if (profileState.gst_regular) {
    strengths.push({ title: "✓ Regular tax compliance", desc: "No delayed filings, showing excellent statutory reliability." })
  }
  if (decision.financial_health_card.cash_flow >= 70) {
    strengths.push({ title: "✓ Healthy Cash Flow Surplus", desc: "Your operational receipts consistently exceed monthly liabilities." })
  }
  if (profileState.bounce_rate === 0) {
    strengths.push({ title: "✓ Perfect Transaction Record", desc: "Zero cheque or transaction bounces logged in recent banking summaries." })
  }

  // Friendly improvements list generator
  const improvements = []
  if (decision.missing_evidence.length > 0) {
    improvements.push({ title: "Provide missing documents", desc: `Uploading ${decision.missing_evidence.join(', ')} helps verify your revenue.` })
  }
  if (profileState.customer_concentration > 40) {
    improvements.push({ title: "Diversify client base", desc: "Reducing concentration from single buyers boosts stability." })
  }
  if (profileState.supplier_dependency > 50) {
    improvements.push({ title: "Expand supplier relations", desc: "Sourcing supplies from multiple vendors avoids dependencies." })
  }
  if (decision.missing_evidence.length === 0) {
    improvements.push({ title: "Maintain current balance sheets", desc: "Maintain your healthy receipt surplus to preserve your score." })
  }

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--color-base)' }}>
      {/* Ambient background light orb */}
      <div style={{
        position: 'fixed', top: '-10%', left: '10%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 75%)',
        pointerEvents: 'none',
      }}/>

      <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
        
        {/* 1. WELCOME CARD (Premium gradient backdrop) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card padding={24} style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(6,182,212,0.04) 100%)',
            border: '1px solid var(--color-border-subtle)',
            position: 'relative', overflow: 'hidden'
          }}>
            <div className="flex justify-between items-start flex-wrap gap-4 text-left">
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  MSME Growth Portal
                </span>
                <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-text-primary)', marginTop: 4 }}>
                  Welcome back, {app.ownerName || 'Business Partner'}!
                </h1>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                  Here is a clear, friendly breakdown of your application health for <strong>{app.businessName}</strong>.
                </p>
                <div className="flex gap-4 mt-3 flex-wrap" style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  <span>🏭 Sector: <strong>{app.sector}</strong></span>
                  <span>📅 Longevity: <strong>{profileState.business_age} Years</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={decision.overall_score >= 75 ? 'green' : 'amber'}>
                  Status: {decision.overall_score >= 75 ? 'Ready' : 'Pending Documents'}
                </Badge>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/msme/application')}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    border: 'none', borderRadius: 10, padding: '8px 16px',
                    color: '#fff', fontWeight: 600, fontSize: 12,
                    cursor: 'pointer', boxShadow: '0 0 16px rgba(99,102,241,0.3)',
                  }}
                >
                  + New Application
                </motion.button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 6. TIMELINE JOURNEY */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-8"
        >
          <Card padding={24}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 20, textAlign: 'left' }}>
              Your Application Journey
            </h3>
            <div className="flex items-center justify-between flex-wrap gap-y-4">
              <TimelineJourneyStep label="Form Submitted" status="Completed" done={true} />
              <TimelineJourneyStep label="Documents Reviewed" status="Completed" done={true} />
              <TimelineJourneyStep label="Financial Assessment" status="Completed" done={true} />
              <TimelineJourneyStep
                label="Action Required"
                status={decision.missing_evidence.length > 0 ? "Pending Uploads" : "Verified ✓"}
                done={decision.missing_evidence.length === 0}
                active={decision.missing_evidence.length > 0}
              />
              <TimelineJourneyStep
                label="Ready for Approval"
                status={decision.overall_score >= 75 ? "Approved" : "Awaited"}
                done={false}
                active={decision.overall_score >= 75}
                isLast={true}
              />
            </div>
          </Card>
        </motion.div>

        {/* Main Dashboard Layout Grid */}
        <div className="grid gap-5" style={{ gridTemplateColumns: '300px 1fr' }}>
          
          {/* Left Column — Financial Health Card */}
          <div className="flex flex-col gap-5">
            
            {/* 2. FINANCIAL HEALTH CARD */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card padding={24} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  Business Health score
                </span>
                
                {/* Score Gauge */}
                <ScoreGauge score={decision.overall_score} tier={decision.overall_score >= 75 ? 'GREEN' : decision.overall_score >= 50 ? 'AMBER' : 'RED'} size={170}/>
                
                <div style={{ width: '100%' }}>
                  <div className="flex justify-between items-center mb-1">
                    <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Verification Confidence</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: healthColor, fontFamily: 'var(--font-mono)' }}>{decision.confidence}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--color-surface)', borderRadius: 9999 }}>
                    <motion.div
                      animate={{ width: `${decision.confidence}%` }}
                      transition={{ duration: 0.6 }}
                      style={{ height: '100%', background: healthColor, borderRadius: 9999 }}
                    />
                  </div>
                </div>

                <div style={{
                  padding: '12px', background: `${healthColor}08`, border: `1px solid ${healthColor}20`,
                  borderRadius: 10, width: '100%', textAlign: 'center'
                }}>
                  <div style={{ fontSize: 12, color: healthColor, fontWeight: 700, marginBottom: 4 }}>
                    {getHealthStatusText(decision.overall_score)}
                  </div>
                  <p style={{ fontSize: 10, color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: 0 }}>
                    {getReadinessDesc(decision.overall_score)}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Funding Limit Card (Simple phrasing) */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <Card padding={20}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 12, textAlign: 'left' }}>
                  Eligible Loan Ceiling
                </h3>
                <div style={{ padding: 12, background: 'var(--color-elevated)', borderRadius: 10, textAlign: 'left' }}>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Estimated Eligible Limit</span>
                  <div style={{ fontSize: 22, fontWeight: 800, color: healthColor, fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                    ₹{(decision.recommended_loan_amount || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 10, lineHeight: 1.5, textAlign: 'left', margin: 0 }}>
                  This limit is dynamically computed based on your verified tax statements and bank receipts. Completing missing documents will unlock higher financing capacities.
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Right Column — Details, Actions & Strengths */}
          <div className="flex flex-col gap-5">
            
            {/* 5. IMPROVE ELIGIBILITY PANEL (Missing documents detail cards) */}
            {decision.missing_evidence.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Card padding={24} style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(168,85,247,0.04) 100%)',
                  border: '1px solid rgba(99,102,241,0.2)'
                }}>
                  <div className="flex items-center gap-3 mb-4 text-left">
                    <span className="text-xl">📈</span>
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>Improve Your Loan Eligibility</h3>
                      <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                        Providing these records boosts verification confidence, immediately raising your health scores and unlocking larger credit limits.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {decision.missing_evidence.map(doc => {
                      const meta = DOC_METADATA[doc] || { why: "Helps verify details.", gain: "+10%", impact: "Improves scores." }
                      const isUploading = uploadingDoc === doc
                      return (
                        <div key={doc} className="p-4 rounded-xl flex items-start justify-between flex-wrap gap-4 text-left transition-all"
                             style={{
                               background: 'var(--color-elevated)',
                               border: isUploading ? '1px solid #a855f7' : '1px solid var(--color-border-subtle)',
                               boxShadow: isUploading ? '0 0 12px rgba(168,85,247,0.15)' : 'none',
                             }}>
                          <div style={{ flex: 1, minWidth: 260 }} className="flex flex-col gap-1.5">
                            <span style={{ fontSize: 13, color: 'var(--color-text-primary)', fontWeight: 700 }}>
                              {doc} <span style={{ color: '#a855f7', fontSize: 10, fontWeight: 700, marginLeft: 4 }}>({meta.gain})</span>
                            </span>
                            <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                              <strong>Why it matters:</strong> {meta.why}
                            </p>
                            <p style={{ fontSize: 11, color: '#10b981', lineHeight: 1.5, margin: 0 }}>
                              <strong>Eligibility Impact:</strong> {meta.impact}
                            </p>
                            {isUploading && (
                              <div style={{ width: '80%', height: 3, background: 'var(--color-surface)', borderRadius: 9999, overflow: 'hidden', marginTop: 8 }}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: '100%' }}
                                  transition={{ duration: 1.1, ease: 'linear' }}
                                  style={{ height: '100%', background: '#a855f7' }}
                                />
                              </div>
                            )}
                          </div>
                          <div>
                            <button
                              onClick={() => !isUploading && handleUpload(doc)}
                              style={{
                                background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: 'none',
                                borderRadius: 8, padding: '6px 14px', color: '#fff', fontSize: 11, fontWeight: 700,
                                cursor: isUploading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 0 12px rgba(99,102,241,0.25)'
                              }}
                            >
                              {isUploading ? 'Uploading...' : 'Simulate Upload'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Friendly Non-Technical health indicators (weights removed) */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="grid grid-cols-2 gap-4">
                <FriendlyHealthCard
                  label="Cash Flow"
                  score={decision.financial_health_card.cash_flow}
                  color={getHealthColor(decision.financial_health_card.cash_flow)}
                  description="Your daily liquid surplus and cash balance coverage relative to your monthly operating expenses."
                />
                <FriendlyHealthCard
                  label="Growth"
                  score={decision.financial_health_card.growth}
                  color={getHealthColor(decision.financial_health_card.growth)}
                  description="Month-over-month sales trends and business expansion pace reflected in your turnover."
                />
                <FriendlyHealthCard
                  label="Business Reliability"
                  score={decision.financial_health_card.trust}
                  color={getHealthColor(decision.financial_health_card.trust)}
                  description="Reflects the age of your incorporation and the regularity of your regulatory GST filings."
                />
                <FriendlyHealthCard
                  label="Business Stability"
                  score={decision.financial_health_card.risk}
                  color={getHealthColor(decision.financial_health_card.risk)}
                  description="Measures diversification (no customer concentration) and safety (absence of payment bounces)."
                />
              </div>
            </motion.div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-2 gap-5 text-left">
              
              {/* 3. YOUR STRENGTHS */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card padding={20}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 12 }}>
                    🌟 Your Key Strengths
                  </h3>
                  <div className="flex flex-col gap-3">
                    {strengths.map((s, idx) => (
                      <div key={idx}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>{s.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* 4. AREAS TO IMPROVE */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card padding={20}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 12 }}>
                    💡 Areas to Improve
                  </h3>
                  <div className="flex flex-col gap-3">
                    {improvements.map((imp, idx) => (
                      <div key={idx}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>{imp.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{imp.desc}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* 7. AI BUSINESS SUMMARY (Prism Assistant) */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <AIExplainerPanel text={explanationText} isLoading={explainerLoading} />
            </motion.div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
