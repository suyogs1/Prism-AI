import Card from './Card'
import Badge from './Badge'

export default function AIGuardrails() {
  return (
    <Card padding={18} style={{
      background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,22,41,0.95))',
      border: '1px solid rgba(99,102,241,0.25)',
      boxShadow: '0 0 20px rgba(99,102,241,0.08)',
      marginTop: 16
    }}>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 18 }}>🛡️</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-text-primary)' }}>
            Responsible AI Governance & Guardrails
          </span>
        </div>
        <Badge variant="purple" size="xs">IDBI Bank Sandbox Compliant</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-2.5 rounded-xl" style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border-subtle)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 14 }}>⚡</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-primary)' }}>100% Deterministic Math</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
            All credit scores, indices, and loan ceilings are calculated via immutable mathematical formulas (`orchestrator.py`). Zero LLM hallucination risk.
          </p>
        </div>

        <div className="p-2.5 rounded-xl" style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border-subtle)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 14 }}>✦</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-primary)' }}>Read-Only LLM Narrative</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
            Gemini AI strictly translates pre-computed engine JSON into human readable text. The AI has zero write access to scores or lending decisions.
          </p>
        </div>

        <div className="p-2.5 rounded-xl" style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border-subtle)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 14 }}>👤</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-primary)' }}>Human-in-the-Loop Authority</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
            The AI acts solely as an underwriting copilot. Final loan approval, rejection, or override authority remains strictly with IDBI Bank credit officers.
          </p>
        </div>

        <div className="p-2.5 rounded-xl" style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border-subtle)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 14 }}>⚖️</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-primary)' }}>Regulatory Audit Trail</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
            Every data ingestion, score deduction, and banker override is immutably logged in the Regulatory Audit Ledger for RBI compliance.
          </p>
        </div>
      </div>
    </Card>
  )
}
