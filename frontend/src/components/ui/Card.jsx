import { motion } from 'framer-motion'

/**
 * Card — surface card with optional hover and glow effects.
 *
 * Props:
 *   hover   - enable lift on hover
 *   glow    - CSS color string for border glow on hover
 *   padding - inner padding (default: 24)
 *   glass   - use glassmorphism style
 */
export default function Card({
  children,
  hover = false,
  glow,
  padding = 24,
  glass = false,
  className = '',
  style = {},
  onClick,
  animate = true,
}) {
  const base = {
    background:   glass ? 'rgba(15,22,41,0.75)' : 'var(--color-surface)',
    backdropFilter: glass ? 'blur(20px)' : undefined,
    border:       `1px solid var(--color-border-default)`,
    borderRadius: '20px',
    padding,
    position:     'relative',
    overflow:     'hidden',
    cursor:       onClick ? 'pointer' : 'default',
    ...style,
  }

  const hoverProps = hover ? {
    whileHover: {
      y: -3,
      boxShadow: glow
        ? `0 16px 48px rgba(0,0,0,0.5), 0 0 32px ${glow}`
        : '0 16px 48px rgba(0,0,0,0.5)',
      borderColor: glow || 'rgba(255,255,255,0.14)',
    },
    transition: { duration: 0.2 },
  } : {}

  if (!animate) {
    return (
      <div className={className} style={base} onClick={onClick}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      style={base}
      onClick={onClick}
      {...hoverProps}
    >
      {children}
    </motion.div>
  )
}
