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
  // Clean landing page state for portal selection
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
        {/* Two Portal Options Grid */}
        <motion.div variants={FADE} className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4 mt-4">
          {/* Banker Dashboard Option */}
          <motion.div
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 24,
              padding: '32px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
              transition: 'border-color 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border-default)'}
          >
            {/* Ambient Corner Glow */}
            <div style={{
              position: 'absolute', top: -50, right: -50, width: 160, height: 160,
              background: 'radial-gradient(circle, rgba(99,102,241,0.22), transparent 70%)',
              borderRadius: '50%', pointerEvents: 'none'
            }}/>
            <div>
              <div className="flex justify-between items-center mb-6">
                <span style={{
                  fontSize: '11px', fontWeight: 800, padding: '4px 12px',
                  borderRadius: 9999, background: 'rgba(99,102,241,0.15)',
                  color: '#6366f1', border: '1px solid rgba(99,102,241,0.3)',
                  textTransform: 'uppercase', letterSpacing: '0.06em'
                }}>
                  💼 For Credit Managers & RMs
                </span>
                <span style={{ fontSize: '24px' }}>🏦</span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                Enter Banker Dashboard
              </h3>
              <div style={{ fontSize: 13, color: 'var(--color-prism-400)', fontWeight: 600, marginBottom: 16 }}>
                AI-Assisted Underwriting Studio
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
                Access the enterprise underwriting studio. Inspect deterministic 4-index score evaluations, review RBI-compliant audit ledgers, simulate credit policy thresholds, and make data-driven loan decisions.
              </p>
              {/* Feature Checklist */}
              <div className="flex flex-col gap-2.5 mb-8" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 18 }}>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: '#10b981' }}>✓</span> 360° Risk Radar & Financial Health Cards
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: '#10b981' }}>✓</span> Cryptographic Data Lineage & Provenance
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: '#10b981' }}>✓</span> Real-Time Credit Sizing & Policy Simulation
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                loginAsbanker()
                selectApplication('PRZ-2024-001')
                navigate('/banker/dashboard')
              }}
              className="w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                border: 'none',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
              }}
            >
              Enter Banker Dashboard →
            </button>
          </motion.div>
          {/* MSME Dashboard Option */}
          <motion.div
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 24,
              padding: '32px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
              transition: 'border-color 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#06b6d4'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border-default)'}
          >
            {/* Ambient Corner Glow */}
            <div style={{
              position: 'absolute', top: -50, right: -50, width: 160, height: 160,
              background: 'radial-gradient(circle, rgba(6,182,212,0.22), transparent 70%)',
              borderRadius: '50%', pointerEvents: 'none'
            }}/>
            <div>
              <div className="flex justify-between items-center mb-6">
                <span style={{
                  fontSize: '11px', fontWeight: 800, padding: '4px 12px',
                  borderRadius: 9999, background: 'rgba(6,182,212,0.15)',
                  color: '#06b6d4', border: '1px solid rgba(6,182,212,0.3)',
                  textTransform: 'uppercase', letterSpacing: '0.06em'
                }}>
                  🏭 For Business Owners & Borrowers
                </span>
                <span style={{ fontSize: '24px' }}>📈</span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                Enter MSME Dashboard
              </h3>
              <div style={{ fontSize: 13, color: '#06b6d4', fontWeight: 600, marginBottom: 16 }}>
                Self-Service Loan & Growth Portal
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
                Experience the transparent borrower journey. Check real-time application health, simulate supplementary document uploads to unlock higher funding ceilings, and read AI underwriting narratives.
              </p>
              {/* Feature Checklist */}
              <div className="flex flex-col gap-2.5 mb-8" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 18 }}>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: '#06b6d4' }}>✓</span> Real-Time Loan Eligibility & Status Tracking
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: '#06b6d4' }}>✓</span> Interactive Evidence Completion Checklist
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: '#06b6d4' }}>✓</span> Transparent AI Score Explainer & Insights
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                selectApplication('PRZ-2024-001')
                navigate('/msme/dashboard')
              }}
              className="w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                border: 'none',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(6,182,212,0.35)',
              }}
            >
              Enter MSME Dashboard →
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Footer Info */}
      <footer className="flex items-center justify-between px-10 mt-6 relative z-10" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 16 }}>
        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>© {new Date().getFullYear()} Prism AI · Built for IDBI Innovate Hackathon</span>
        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Architecture: Deterministic engine + LLM Explanation narrator</span>
      </footer>
    </div>
  )
}
