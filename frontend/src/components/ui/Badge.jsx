/**
 * Badge — status, tier, and label badges.
 *
 * Variants: green | amber | red | blue | purple | default
 */
const VARIANT = {
  green:   { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)',  color: '#10b981' },
  amber:   { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', color: '#f59e0b' },
  red:     { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',   color: '#ef4444' },
  blue:    { bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.2)',  color: '#818cf8' },
  purple:  { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)', color: '#c084fc' },
  cyan:    { bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.2)',   color: '#06b6d4' },
  default: { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.1)', color: '#94a3b8' },
}

/** Map risk tier to badge variant */
export const tierVariant = (tier) => {
  const map = { GREEN: 'green', AMBER: 'amber', RED: 'red' }
  return map[tier] || 'default'
}

/** Map confidence to badge variant */
export const confidenceVariant = (conf) => {
  const map = { HIGH: 'green', MEDIUM: 'amber', LOW: 'red' }
  return map[conf] || 'default'
}

export default function Badge({
  children,
  variant = 'default',
  dot = false,
  size = 'sm',
}) {
  const v = VARIANT[variant] || VARIANT.default
  const fontSize = size === 'xs' ? '10px' : '11px'
  const padding  = size === 'xs' ? '2px 7px' : '3px 10px'

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding,
      background: v.bg,
      border: `1px solid ${v.border}`,
      borderRadius: '9999px',
      fontSize,
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: v.color,
      whiteSpace: 'nowrap',
    }}>
      {dot && (
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: v.color, flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  )
}
