import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../store/authStore'
import useApplicationStore from '../store/applicationStore'

function PrismMark({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="lp-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#a855f7"/>
        </linearGradient>
      </defs>
      <polygon points="16,2 30,27 2,27" fill="none" stroke="url(#lp-g)" strokeWidth="2.5" strokeLinejoin="round"/>
      <polygon points="16,8 25,24 7,24" fill="url(#lp-g)" opacity="0.25"/>
      <line x1="16" y1="8" x2="11" y2="24" stroke="#10b981" strokeWidth="2" opacity="0.95"/>
      <line x1="16" y1="8" x2="21" y2="24" stroke="#f59e0b" strokeWidth="2" opacity="0.95"/>
      <line x1="16" y1="8" x2="16" y2="24" stroke="#06b6d4" strokeWidth="1.5" opacity="0.7"/>
    </svg>
  )
}

const FADE = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const STAGGER = { show: { transition: { staggerChildren: 0.12 } } }

export default function LandingPage() {
  const navigate = useNavigate()
  const { loginAsbanker } = useAuthStore()
  const { selectApplication } = useApplicationStore()

  const demoApplicants = [
    {
      id: 'PRZ-2024-001',
      businessName: 'Sharma Textiles Pvt Ltd',
      industry: 'Textile Manufacturing',
      yearsInBusiness: 4.5,
      annualTurnover: '₹26.4 Lakhs',
      description: 'A leading regional manufacturer of cotton apparel with highly stable cash flows and zero GST filing delays.',
      riskTier: 'GREEN',
      color: '#10b981',
      glow: 'rgba(16,185,129,0.25)',
      badge: 'Healthy MSME'
    },
    {
      id: 'PRZ-2024-002',
      businessName: 'Priya Foods & Catering',
      industry: 'Food & Beverages',
      yearsInBusiness: 2.1,
      annualTurnover: '₹11.4 Lakhs',
      description: 'A fast-growing catering service facing minor seasonal cash flow dips and GSTR-3B filing delays.',
      riskTier: 'AMBER',
      color: '#f59e0b',
      glow: 'rgba(245,158,11,0.25)',
      badge: 'Borderline MSME'
    },
    {
      id: 'PRZ-2024-003',
      businessName: 'MetalWorks Fabrication',
      industry: 'Metal Fabrication',
      yearsInBusiness: 1.8,
      annualTurnover: '₹45.6 Lakhs',
      description: 'An early-stage heavy welding enterprise with significant GST filing gaps and high cheque bounce rates.',
      riskTier: 'RED',
      color: '#ef4444',
      glow: 'rgba(239,68,68,0.25)',
      badge: 'High Risk MSME'
    }
  ]

  const handleLaunchDemo = (appId) => {
    // 1. Log in as banker automatically
    loginAsbanker()
    // 2. Select applicant in store
    selectApplication(appId)
    // 3. Open Banker Dashboard with highlighted applicant
    navigate('/banker/dashboard', { state: { highlightId: appId } })
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between py-6" style={{ background: 'var(--color-base)' }}>
      {/* Background radial glow */}
      <div className="animate-orb pointer-events-none" style={{
        position: 'fixed', top: '-15%', left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 500,
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)',
      }}/>
      <div className="pointer-events-none" style={{
        position: 'fixed', bottom: '-15%', right: '-5%',
        width: 450, height: 450,
        background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
        animation: 'orb-drift 20s ease-in-out infinite reverse',
      }}/>

      {/* Top Header */}
      <nav className="flex items-center justify-between px-10 mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <PrismMark size={32}/>
          <div>
            <span className="font-extrabold text-base gradient-text tracking-tight block">Prism AI</span>
            <span className="text-[10px]" style={{ color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>IDBI Innovate Hackathon</span>
          </div>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 700, padding: '4px 12px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border-default)',
          borderRadius: 9999, color: 'var(--color-text-secondary)',
        }}>
          💡 DEMO MODE (No Auth Required)
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        variants={STAGGER} initial="hidden" animate="show"
        className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto relative z-10"
      >
        <motion.div variants={FADE} className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
               style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: 'var(--color-prism-400)' }}>
            ✦ Interactive Underwriting Showcase
          </div>
        </motion.div>

        <motion.h1 variants={FADE}
          className="font-black mb-4 tracking-tight leading-none"
          style={{ fontSize: 'clamp(2rem, 5.5vw, 3.8rem)' }}
        >
          Evaluate <span className="gradient-text">New-to-Credit</span> MSMEs
          <br />
          with Unrivaled Explainability
        </motion.h1>

        {/* Problem solved explainer */}
        <motion.p variants={FADE}
          className="max-w-2xl mb-12 text-sm leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Traditional credit scoring excludes viable businesses due to lack of standard credit history.
          <strong> Prism AI</strong> analyzes alternate financial data—GST compliance, bank cash flows, and digital footprints—using a
          <span style={{ color: 'var(--color-prism-400)' }}> 100% deterministic scoring engine</span>.
          An advanced LLM then translates these metrics into natural-language reports for credit managers.
        </motion.p>

        {/* Showcase Grid */}
        <motion.div variants={FADE} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
          {demoApplicants.map((app, index) => (
            <motion.div
              key={app.id}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                background: 'var(--color-surface)',
                border: `1px solid var(--color-border-default)`,
                borderRadius: 20,
                padding: '24px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'between',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = app.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border-default)'}
            >
              {/* Corner Glow */}
              <div style={{
                position: 'absolute', top: -40, right: -40, width: 100, height: 100,
                background: `radial-gradient(circle, ${app.glow}, transparent)`,
                borderRadius: '50%', pointerEvents: 'none'
              }}/>

              <div>
                {/* Risk Badge */}
                <div className="flex justify-between items-center mb-4">
                  <span style={{
                    fontSize: '10px', fontWeight: 800, padding: '2px 8px',
                    borderRadius: 9999, background: `${app.color}15`,
                    color: app.color, border: `1px solid ${app.color}25`,
                    textTransform: 'uppercase', letterSpacing: '0.04em'
                  }}>
                    {app.badge}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {app.id}
                  </span>
                </div>

                {/* Company & Sector */}
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 2 }}>
                  {app.businessName}
                </h3>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 12 }}>
                  {app.industry}
                </div>

                {/* Description */}
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6, minHeight: 60, marginBottom: 16 }}>
                  {app.description}
                </p>

                {/* Metadata details */}
                <div className="grid grid-cols-2 gap-2 mb-6" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 12 }}>
                  <div>
                    <div style={{ fontSize: '9px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Turnover</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{app.annualTurnover}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '9px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Business Age</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{app.yearsInBusiness} Yrs</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleLaunchDemo(app.id)}
                className="w-full text-center py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
                style={{
                  background: 'var(--color-elevated)',
                  border: '1px solid var(--color-border-strong)',
                  color: 'var(--color-text-primary)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={e => {
                  e.target.style.background = app.color
                  e.target.style.color = '#000'
                  e.target.style.borderColor = app.color
                  e.target.style.boxShadow = `0 0 16px ${app.glow}`
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'var(--color-elevated)'
                  e.target.style.color = 'var(--color-text-primary)'
                  e.target.style.borderColor = 'var(--color-border-strong)'
                  e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)'
                }}
              >
                Launch Demo →
              </button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Footer Info */}
      <footer className="flex items-center justify-between px-10 mt-6 relative z-10" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 16 }}>
        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>© 2024 Prism AI · Built for IDBI Innovate Hackathon</span>
        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Architecture: Deterministic engine + LLM Explanation narrator</span>
      </footer>
    </div>
  )
}
