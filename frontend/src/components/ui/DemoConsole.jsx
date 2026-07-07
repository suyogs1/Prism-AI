import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useApplicationStore from '../../store/applicationStore'

const PERSONAS = [
  { id: 'PRZ-2024-001', name: 'Healthy (Sharma)', color: '#10b981' },
  { id: 'PRZ-2024-002', name: 'Borderline (Priya)', color: '#f59e0b' },
  { id: 'PRZ-2024-003', name: 'High Risk (Apex)', color: '#ef4444' }
]

const DEMO_STEPS = [
  { step: 1, title: 'Landing Page', desc: 'Select Priya Foods (Borderline Card)' },
  { step: 2, title: 'Banker Pipeline', desc: 'Observe auto-highlight & open report' },
  { step: 3, title: 'Scoring Report', desc: 'Review requested status & missing documents' },
  { step: 4, title: 'Upload Simulation', desc: 'Simulate document uploads to upgrade score' },
  { step: 5, title: 'Policy Center', desc: 'Test adjusting index weights & policy rules' },
  { step: 6, title: 'Prism Connect', desc: 'Inspect live banking connectors (AA/GSTN)' },
  { step: 7, title: 'Payload Inspector', desc: 'Step inside 5-stage API data normalization' },
  { step: 8, title: 'Audit Ledger', desc: 'Review immutable WORM-compliant RBI logs' },
  { step: 9, title: 'Sandbox Roadmap', desc: 'Inspect IDBI transition & AWS architecture' },
  { step: 10, title: 'MSME View Swap', desc: 'Click navbar toggle to view MSME portal' }
]

export default function DemoConsole() {
  const navigate = useNavigate()
  const location = useLocation()
  const { fetchApplication } = useApplicationStore()

  const [expanded, setExpanded] = useState(true)
  const [presentationMode, setPresentationMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  // Track active step based on navigation route and actions
  useEffect(() => {
    const path = location.pathname
    if (path === '/') {
      setCurrentStep(1)
    } else if (path === '/banker/dashboard' || path === '/banker') {
      setCurrentStep(2)
    } else if (path.startsWith('/banker/application/')) {
      if (currentStep < 3) setCurrentStep(3)
    } else if (path === '/banker/policy') {
      setCurrentStep(5)
    } else if (path === '/banker/connect') {
      setCurrentStep(6)
    } else if (path === '/banker/payload') {
      setCurrentStep(7)
    } else if (path === '/banker/audit') {
      setCurrentStep(8)
    } else if (path === '/banker/sandbox') {
      setCurrentStep(9)
    } else if (path.startsWith('/msme/dashboard') || path === '/msme') {
      setCurrentStep(10)
    }
  }, [location.pathname])

  const handlePersonaSelect = async (id) => {
    // Reset state & navigate to that banker details view
    await fetchApplication(id)
    navigate(`/banker/application/${id}`)
    setCurrentStep(3)
  }

  const handleReset = async () => {
    localStorage.clear()
    // Reload state for current page or route to home
    navigate('/')
    setCurrentStep(1)
    window.location.reload()
  }

  const handleNextStep = () => {
    if (currentStep < DEMO_STEPS.length) {
      const next = currentStep + 1
      setCurrentStep(next)
      
      // Auto routing helpers
      if (next === 2) navigate('/banker/dashboard')
      if (next === 3) navigate('/banker/application/PRZ-2024-002')
      if (next === 5) navigate('/banker/policy')
      if (next === 6) navigate('/banker/connect')
      if (next === 7) navigate('/banker/payload')
      if (next === 8) navigate('/banker/audit')
      if (next === 9) navigate('/banker/sandbox')
      if (next === 10) navigate('/msme/dashboard')
    } else {
      handleReset()
    }
  }

  const togglePresentationMode = () => {
    const nextMode = !presentationMode
    setPresentationMode(nextMode)
    if (nextMode) {
      document.body.classList.add('presentation-mode')
    } else {
      document.body.classList.remove('presentation-mode')
    }
  }

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 1000,
      fontFamily: 'var(--font-sans)',
      textAlign: 'left'
    }}>
      <AnimatePresence>
        {expanded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            style={{
              width: 320, background: 'rgba(10, 15, 30, 0.92)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              borderRadius: 18, padding: 18,
              boxShadow: '0 10px 30px rgba(99, 102, 241, 0.25)',
              backdropFilter: 'blur(16px)',
              color: 'var(--color-text-primary)'
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <span className="font-extrabold text-xs tracking-wider" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ✦ PRISM DEMO WIDGET
              </span>
              <div className="flex gap-2">
                <button
                  onClick={togglePresentationMode}
                  title="Toggle Presentation Mode (Hides raw JSON & dev details)"
                  style={{
                    background: presentationMode ? '#a855f7' : 'var(--color-elevated)',
                    border: 'none', borderRadius: 6, fontSize: 10, padding: '2px 6px',
                    color: '#fff', cursor: 'pointer', fontWeight: 600
                  }}
                >
                  {presentationMode ? 'Presentation ON' : 'Dev Mode'}
                </button>
                <button
                  onClick={() => setExpanded(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: 13 }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Stepper Guide */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 10, marginBottom: 12 }}>
              <div className="flex justify-between items-center mb-1">
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Demo Step Guide</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#a855f7' }}>{currentStep} / {DEMO_STEPS.length}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>
                {DEMO_STEPS[currentStep - 1].title}
              </div>
              <p style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 2, margin: 0 }}>
                {DEMO_STEPS[currentStep - 1].desc}
              </p>
            </div>

            {/* Quick Switch Personas */}
            <div className="mb-3">
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Direct Persona Jump
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {PERSONAS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handlePersonaSelect(p.id)}
                    style={{
                      background: 'var(--color-elevated)',
                      border: `1px solid ${p.color}30`,
                      borderRadius: 8, padding: '5px 8px', fontSize: 10,
                      color: 'var(--color-text-secondary)', cursor: 'pointer',
                      flex: 1, fontWeight: 600
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = p.color
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = `${p.color}30`
                      e.currentTarget.style.color = 'var(--color-text-secondary)'
                    }}
                  >
                    {p.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={handleReset}
                style={{
                  background: 'var(--color-void)', border: '1px solid var(--color-border-strong)',
                  borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700,
                  color: 'var(--color-text-secondary)', cursor: 'pointer', flex: 1
                }}
              >
                Reset Demo
              </button>
              <button
                onClick={handleNextStep}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: 'none',
                  borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 700,
                  color: '#fff', cursor: 'pointer', flex: 1.5,
                  boxShadow: '0 0 10px rgba(99, 102, 241, 0.25)'
                }}
              >
                {currentStep === DEMO_STEPS.length ? 'Restart Walkthrough' : 'Next Step →'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setExpanded(true)}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              border: 'none', borderRadius: '50%', width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: '#fff', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
            }}
          >
            ✦
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
