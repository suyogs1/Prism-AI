import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const STEPS = [
  { id: 1, label: 'Business Info',   icon: '🏭', description: 'Tell us about your business' },
  { id: 2, label: 'Financial Data',  icon: '📊', description: 'Key financial indicators' },
  { id: 3, label: 'Documents',       icon: '📄', description: 'Upload supporting documents' },
  { id: 4, label: 'Review & Submit', icon: '✅', description: 'Confirm and submit application' },
]

const SECTORS = [
  'Manufacturing', 'Food & Beverages', 'IT Services', 'Agriculture & Allied',
  'Textile & Apparel', 'Metal Fabrication', 'Retail Trade', 'Transport & Logistics',
  'Healthcare', 'Education & Training', 'Construction', 'Other',
]

const STATES = [
  'Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi NCR',
  'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Telangana', 'Kerala', 'Other',
]

function Field({ label, type = 'text', placeholder, required, options, hint, col = 1 }) {
  return (
    <div style={{ gridColumn: col > 1 ? `span ${col}` : undefined }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {options ? (
        <select
          style={{
            width: '100%', background: 'var(--color-elevated)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 10, color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-sans)', fontSize: 13, padding: '9px 14px',
            outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="">{placeholder}</option>
          {options.map(o => <option key={o} value={o} style={{ background: '#0f1629' }}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          style={{
            width: '100%', background: 'var(--color-elevated)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 10, color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-sans)', fontSize: 13, padding: '9px 14px',
            outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-border-default)'}
        />
      )}
      {hint && <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

function UploadZone({ label, description, required }) {
  const [state, setState] = useState('idle') // idle | hover | done

  return (
    <div
      onDragOver={e => { e.preventDefault(); setState('hover') }}
      onDragLeave={() => setState('idle')}
      onDrop={e => { e.preventDefault(); setState('done') }}
      onClick={() => setState(s => s === 'done' ? 'idle' : 'done')}
      style={{
        padding: '18px',
        border: `2px dashed ${state === 'hover' ? '#6366f1' : state === 'done' ? '#10b981' : 'var(--color-border-default)'}`,
        borderRadius: 12,
        background: state === 'hover' ? 'rgba(99,102,241,0.06)' : state === 'done' ? 'rgba(16,185,129,0.06)' : 'var(--color-elevated)',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ fontSize: 26, marginBottom: 6 }}>{state === 'done' ? '✅' : '📤'}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: state === 'done' ? '#10b981' : 'var(--color-text-primary)', marginBottom: 3 }}>
        {state === 'done' ? 'Uploaded' : label}
        {required && state !== 'done' && <span style={{ color: '#ef4444' }}> *</span>}
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
        {state === 'done' ? 'Click to remove' : description}
      </div>
    </div>
  )
}

const STEP_CONTENT = {
  1: (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Business Name"          placeholder="e.g. Sharma Textiles Pvt Ltd"   required />
      <Field label="Owner / Proprietor"     placeholder="Full legal name"                 required />
      <Field label="Business Type"          placeholder="Select type" options={['Sole Proprietorship','Partnership','Private Limited','LLP','OPC']} required />
      <Field label="Sector"                 placeholder="Select sector" options={SECTORS} required />
      <Field label="Business PAN"           placeholder="AAAPL1234C"                      required />
      <Field label="GSTIN"                  placeholder="22AAAAA0000A1Z5"                 required />
      <Field label="Udyam Registration No." placeholder="UDYAM-XX-00-0000000"             hint="Leave blank if not registered" />
      <Field label="Years in Operation"     type="number" placeholder="e.g. 4"            required />
      <Field label="City"                   placeholder="e.g. Surat"                      required />
      <Field label="State"                  placeholder="Select state" options={STATES}   required />
    </div>
  ),
  2: (
    <div className="flex flex-col gap-4">
      <div style={{
        padding: '12px 14px',
        background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 10, fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7,
      }}>
        💡 These figures are used by the Prism Engine to compute your Cash Flow and GST indices.
        All values are kept confidential.
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Avg Monthly GST Turnover (₹)" type="number" placeholder="e.g. 200000" required />
        <Field label="Avg Monthly Bank Inflow (₹)"  type="number" placeholder="e.g. 180000" required />
        <Field label="Loan Amount Requested (₹)"     type="number" placeholder="e.g. 1200000" required />
        <Field label="Loan Purpose" placeholder="Select purpose" options={['Working Capital','Equipment Purchase','Business Expansion','Inventory','Infrastructure','Other']} required />
        <Field label="EMI Bounces (last 12 months)" type="number" placeholder="0" required hint="Number of EMI bounces on existing loans" />
        <Field label="Existing Monthly EMI (₹)"     type="number" placeholder="e.g. 15000 or 0" />
        <Field label="UPI Monthly Transactions"      type="number" placeholder="Approx. count" hint="Optional — improves your Prism Score" />
        <Field label="Supplier Trade Credit" placeholder="Select range" options={['None','< ₹1 Lakh','₹1–5 Lakh','₹5–10 Lakh','> ₹10 Lakh']} />
      </div>
    </div>
  ),
  3: (
    <div className="flex flex-col gap-4">
      <div style={{
        padding: '12px 14px',
        background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 10, fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.7,
      }}>
        🔒 All documents are encrypted and used solely for credit scoring.
        Fields marked <span style={{ color: '#ef4444' }}>*</span> are mandatory.
      </div>
      <div className="grid grid-cols-2 gap-3">
        <UploadZone label="GST Returns (12 months)"    description="GSTR-1 and GSTR-3B · PDF or JSON" required />
        <UploadZone label="Bank Statement (12 months)" description="PDF from your bank netbanking"     required />
        <UploadZone label="Udyam Certificate"          description="Download from udyamregistration.gov.in" />
        <UploadZone label="ITR (Last 2 years)"         description="ITR-3 / ITR-4 · PDF" />
        <UploadZone label="Business PAN Card"          description="Clear scan · PDF or image"         required />
        <UploadZone label="UPI Statement"              description="PhonePe / GPay / Paytm · Optional" />
      </div>
    </div>
  ),
  4: (
    <div className="flex flex-col gap-5">
      <div style={{
        padding: '24px', textAlign: 'center',
        background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 16,
      }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 8 }}>Ready to Submit</h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          Your application data is complete. The Prism Engine will compute your score within seconds.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          ['Business', 'Sharma Textiles Pvt Ltd'],
          ['Sector', 'Textile Manufacturing'],
          ['Loan Ask', '₹12,00,000'],
          ['Documents', '4 of 6 uploaded'],
        ].map(([k, v]) => (
          <div key={k} style={{
            padding: '12px 16px', background: 'var(--color-elevated)',
            border: '1px solid var(--color-border-default)', borderRadius: 10,
          }}>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginTop: 3 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{
        padding: '12px 14px', borderRadius: 10,
        background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)',
        fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.7,
      }}>
        By submitting, you authorise IDBI Bank to compute a Prism Score using the data provided.
        A deterministic scoring engine processes your data. The final lending decision is made by a human underwriter.
      </div>
    </div>
  ),
}

export default function MSMEApplication() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const handleSubmit = () => {
    setTimeout(() => navigate('/msme/dashboard'), 300)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-base)' }}>
      {/* BG orb */}
      <div style={{
        position: 'fixed', top: '-5%', right: '-5%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-text-primary)', marginBottom: 6 }}>
            Apply for MSME Loan
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
            Your Prism Score is computed in real-time using alternate financial data
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: step === s.id ? 'linear-gradient(135deg,#6366f1,#a855f7)'
                             : step > s.id  ? 'rgba(99,102,241,0.15)'
                             : 'var(--color-elevated)',
                  border: step === s.id ? 'none'
                         : step > s.id  ? '2px solid #6366f1'
                         : '2px solid var(--color-border-default)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: step === s.id ? '0 0 20px rgba(99,102,241,0.5)' : 'none',
                  transition: 'all 0.3s ease', fontSize: step > s.id ? '14px' : '18px',
                }}>
                  {step > s.id ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  ) : s.icon}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap',
                  color: step >= s.id ? 'var(--color-prism-400)' : 'var(--color-text-muted)',
                }}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  width: 72, height: 2, marginBottom: 18, marginLeft: -2, marginRight: -2,
                  background: step > s.id ? 'linear-gradient(90deg, #6366f1, #a855f7)' : 'var(--color-border-default)',
                  transition: 'background 0.4s ease',
                }}/>
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Card padding={32}>
              <div className="mb-6">
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {STEPS[step-1].icon} {STEPS[step-1].label}
                </h2>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {STEPS[step-1].description}
                </p>
                <div style={{ height: 1, background: 'var(--color-border-default)', marginTop: 16 }}/>
              </div>

              {STEP_CONTENT[step]}

              {/* Navigation */}
              {step < 4 ? (
                <div className="flex items-center justify-between mt-8 pt-5"
                     style={{ borderTop: '1px solid var(--color-border-default)' }}>
                  <button
                    onClick={() => step > 1 && setStep(s => s - 1)}
                    style={{
                      background: 'var(--color-elevated)', border: '1px solid var(--color-border-strong)',
                      borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 600,
                      color: step === 1 ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                      cursor: step === 1 ? 'not-allowed' : 'pointer',
                      opacity: step === 1 ? 0.4 : 1,
                    }}
                  >← Back</button>

                  <div className="flex gap-1.5">
                    {STEPS.map((_, i) => (
                      <div key={i} style={{
                        height: 5, borderRadius: 9999,
                        width: i + 1 === step ? 20 : 5,
                        background: i + 1 <= step ? '#6366f1' : 'var(--color-border-default)',
                        transition: 'all 0.3s ease',
                      }}/>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setStep(s => s + 1)}
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: 'none',
                      borderRadius: 10, padding: '9px 20px', color: '#fff',
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      boxShadow: '0 0 16px rgba(99,102,241,0.3)',
                    }}
                  >Continue →</motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  style={{
                    width: '100%', marginTop: 24,
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: 'none',
                    borderRadius: 14, padding: '14px 28px', color: '#fff',
                    fontSize: 15, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 0 24px rgba(99,102,241,0.35)',
                  }}
                >
                  Submit Application &amp; Compute Prism Score ✦
                </motion.button>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
