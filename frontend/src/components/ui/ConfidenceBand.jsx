import { CONFIDENCE } from '../../theme/tokens'

/**
 * ConfidenceBand — displays the data-completeness confidence level.
 * Shows a signal-strength bar icon alongside the label.
 */
export default function ConfidenceBand({ level = 'MEDIUM', completeness }) {
  const cfg = CONFIDENCE[level] || CONFIDENCE.MEDIUM

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px',
      background: `${cfg.color}10`,
      border: `1px solid ${cfg.color}30`,
      borderRadius: '10px',
    }}>
      {/* Signal bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
        {[1, 2, 3].map(b => (
          <div key={b} style={{
            width: 5,
            height: 5 + b * 4,
            borderRadius: '2px',
            background: b <= cfg.bars ? cfg.color : 'var(--color-border-strong)',
            boxShadow: b <= cfg.bars ? `0 0 4px ${cfg.color}` : 'none',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: cfg.color }}>
            {cfg.label}
          </span>
          {completeness !== undefined && (
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              {completeness}% data
            </span>
          )}
        </div>
        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
          {cfg.desc}
        </span>
      </div>
    </div>
  )
}
