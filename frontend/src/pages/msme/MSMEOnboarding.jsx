import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/ui/Navbar'

const STEPS = [
  { id: 1, label: 'Business Info',      icon: '🏭' },
  { id: 2, label: 'Financial Data',     icon: '📊' },
  { id: 3, label: 'Documents',          icon: '📄' },
  { id: 4, label: 'Review & Submit',    icon: '✅' },
]

const SECTORS = [
  'Manufacturing', 'Food & Beverages', 'IT Services', 'Agriculture & Allied',
  'Textile & Apparel', 'Metal Fabrication', 'Retail Trade', 'Transport & Logistics',
  'Healthcare', 'Education & Training', 'Construction', 'Other',
]

function StepIndicator({ currentStep }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
      {STEPS.map((step, i) => (
        <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            position: 'relative',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: currentStep === step.id
                ? 'var(--gradient-primary)'
                : currentStep > step.id
                  ? 'rgba(99,102,241,0.2)'
                  : 'var(--bg-elevated)',
              border: currentStep === step.id
                ? 'none'
                : currentStep > step.id
                  ? '2px solid #6366F1'
                  : '2px solid var(--border-default)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: currentStep > step.id ? '12px' : '16px',
              boxShadow: currentStep === step.id ? '0 0 20px rgba(99,102,241,0.5)' : 'none',
              transition: 'all 0.3s ease',
            }}>
              {currentStep > step.id ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : step.icon}
            </div>
            <span style={{
              fontSize: '10px', fontWeight: 600,
              color: currentStep >= step.id ? 'var(--primary-400)' : 'var(--text-muted)',
              whiteSpace: 'nowrap',
            }}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              width: 80, height: 2, marginBottom: 22, marginLeft: -2, marginRight: -2,
              background: currentStep > step.id ? 'var(--gradient-primary)' : 'var(--border-default)',
              transition: 'background 0.4s ease',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

function FormField({ label, type = 'text', placeholder, required, options, hint }) {
  if (type === 'select') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
        </label>
        <select
          className="input"
          style={{ cursor: 'pointer', appearance: 'none' }}
        >
          <option value="" style={{ background: '#0F1629' }}>{placeholder}</option>
          {options?.map(o => <option key={o} value={o} style={{ background: '#0F1629' }}>{o}</option>)}
        </select>
        {hint && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{hint}</span>}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <input type={type} className="input" placeholder={placeholder} />
      {hint && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  )
}

function UploadZone({ label, description, required }) {
  const [dragging, setDragging] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); setUploaded(true) }}
      onClick={() => setUploaded(!uploaded)}
      style={{
        padding: '20px',
        border: `2px dashed ${dragging ? '#6366F1' : uploaded ? '#10B981' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-lg)',
        background: dragging ? 'rgba(99,102,241,0.06)' : uploaded ? 'rgba(16,185,129,0.06)' : 'var(--bg-elevated)',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>
        {uploaded ? '✅' : '📤'}
      </div>
      <div style={{
        fontSize: 'var(--text-sm)', fontWeight: 600,
        color: uploaded ? '#10B981' : 'var(--text-primary)',
        marginBottom: 4,
      }}>
        {uploaded ? 'File Uploaded' : label}
        {required && !uploaded && <span style={{ color: '#EF4444' }}> *</span>}
      </div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
        {uploaded ? 'Click to remove' : description}
      </div>
    </div>
  )
}

function Step1() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FormField label="Business Name" placeholder="e.g. Sharma Textiles Pvt Ltd" required />
        <FormField label="Owner / Proprietor Name" placeholder="Full legal name" required />
        <FormField label="Business Type" type="select" placeholder="Select type" required
          options={['Sole Proprietorship', 'Partnership', 'Private Limited', 'LLP', 'OPC']} />
        <FormField label="Sector" type="select" placeholder="Select sector" required options={SECTORS} />
        <FormField label="Business PAN" placeholder="AAAPL1234C" required />
        <FormField label="GSTIN" placeholder="22AAAAA0000A1Z5" required />
        <FormField label="Udyam Registration Number" placeholder="UDYAM-XX-00-0000000" hint="Leave blank if not registered" />
        <FormField label="Years in Operation" type="number" placeholder="e.g. 4" required />
        <FormField label="City" placeholder="e.g. Surat" required />
        <FormField label="State" type="select" placeholder="Select state" required
          options={['Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Telangana', 'Kerala', 'Other']} />
      </div>
    </div>
  )
}

function Step2() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{
        padding: '14px 16px',
        background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6,
      }}>
        💡 These figures help the Prism Engine compute your Cash Flow Index. All values are kept confidential and only used for scoring.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FormField label="Avg Monthly GST Turnover (₹)" type="number" placeholder="e.g. 200000" required />
        <FormField label="Avg Monthly Bank Inflow (₹)" type="number" placeholder="e.g. 180000" required />
        <FormField label="Loan Requested (₹)" type="number" placeholder="e.g. 1200000" required />
        <FormField label="Loan Purpose" type="select" placeholder="Select purpose" required
          options={['Working Capital', 'Equipment Purchase', 'Business Expansion', 'Inventory Purchase', 'Infrastructure', 'Other']} />
        <FormField label="EMI Bounce Instances (last 12m)" type="number" placeholder="e.g. 0" required hint="Number of EMI bounces on any existing loans" />
        <FormField label="Existing Loan EMI (₹/month)" type="number" placeholder="e.g. 15000 or 0" />
        <FormField label="UPI Monthly Transaction Count" type="number" placeholder="Approx. e.g. 45" hint="Optional but improves your score" />
        <FormField label="Trade Credit from Suppliers" type="select" placeholder="Select range"
          options={['No credit', '< ₹1 Lakh', '₹1–5 Lakh', '₹5–10 Lakh', '> ₹10 Lakh']} />
      </div>
    </div>
  )
}

function Step3() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        padding: '14px 16px',
        background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6,
      }}>
        ✓ Documents are securely encrypted and only used for credit assessment. Marked <span style={{ color: '#EF4444' }}>*</span> are mandatory.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <UploadZone label="GST Returns (12 months)" description="GSTR-1 and GSTR-3B · PDF or JSON" required />
        <UploadZone label="Bank Statement (12 months)" description="PDF from your bank's netbanking" required />
        <UploadZone label="Udyam Certificate" description="Download from udyamregistration.gov.in" />
        <UploadZone label="ITR (Last 2 years)" description="Form 16 / ITR-3 / ITR-4 · PDF" />
        <UploadZone label="Business PAN Card" description="Clear scan · PDF or image" required />
        <UploadZone label="UPI Statement / Screenshot" description="PhonePe / GPay / Paytm · Optional" />
      </div>
    </div>
  )
}

function Step4({ onSubmit }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{
        padding: '20px',
        background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 'var(--radius-xl)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
          Ready to Submit
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Your application data is complete. Upon submission, the Prism Engine will compute your score within seconds and notify your assigned Relationship Manager.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          ['Business', 'Sharma Textiles Pvt Ltd'],
          ['Sector', 'Textile Manufacturing'],
          ['Loan Ask', '₹12,00,000'],
          ['Documents', '4 of 6 uploaded'],
        ].map(([k, v]) => (
          <div key={k} style={{
            padding: '12px 16px',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginTop: 3 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{
        padding: '14px',
        background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.6,
      }}>
        By submitting, you authorise IDBI Bank to compute a Prism Score using the data provided. A deterministic scoring engine processes your alternate financial data. The final lending decision is made by a human underwriter.
      </div>

      <button onClick={onSubmit} className="btn btn-primary btn-lg" style={{ alignSelf: 'stretch' }}>
        Submit Application & Compute Prism Score ✦
      </button>
    </div>
  )
}

export default function MSMEOnboarding() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const handleSubmit = () => {
    setTimeout(() => navigate('/msme'), 400)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar role="msme" />

      {/* BG orb */}
      <div style={{
        position: 'fixed', top: '-10%', right: '-5%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40, animation: 'fadeIn 0.4s ease both' }}>
          <h1 style={{
            fontSize: 'var(--text-3xl)', fontWeight: 800,
            letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 8,
          }}>
            Apply for MSME Loan
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Your Prism Score is computed in real-time using alternate financial data
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={step} />

        {/* Form card */}
        <div
          className="surface-card"
          style={{
            padding: '32px',
            animation: 'scaleIn 0.3s ease both',
            key: step,
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <h2 style={{
              fontSize: 'var(--text-xl)', fontWeight: 700,
              color: 'var(--text-primary)', marginBottom: 4,
            }}>
              {STEPS[step - 1].icon} {STEPS[step - 1].label}
            </h2>
            <div className="divider" style={{ marginTop: 16 }} />
          </div>

          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 onSubmit={handleSubmit} />}

          {/* Navigation */}
          {step < 4 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border-default)' }}>
              <button
                onClick={() => step > 1 && setStep(s => s - 1)}
                className="btn btn-secondary"
                style={{ opacity: step === 1 ? 0.4 : 1, cursor: step === 1 ? 'not-allowed' : 'pointer' }}
              >
                ← Back
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{
                    width: i + 1 === step ? 20 : 6, height: 6,
                    borderRadius: 3,
                    background: i + 1 <= step ? 'var(--primary-500)' : 'var(--border-default)',
                    transition: 'all 0.3s ease',
                  }} />
                ))}
              </div>
              <button onClick={() => setStep(s => s + 1)} className="btn btn-primary">
                Continue →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
