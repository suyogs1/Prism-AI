import { forwardRef } from 'react'
import { motion } from 'framer-motion'

/**
 * Button — design system button component.
 *
 * Variants: primary | secondary | ghost | danger
 * Sizes:    sm | md | lg
 */
const VARIANT_STYLES = {
  primary: {
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 0 20px rgba(99,102,241,0.3)',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border-strong)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    border: 'none',
  },
  danger: {
    background: 'rgba(239,68,68,0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239,68,68,0.25)',
  },
}

const SIZE_STYLES = {
  sm: { padding: '5px 12px', fontSize: '12px', borderRadius: '6px', gap: '5px' },
  md: { padding: '9px 18px', fontSize: '14px', borderRadius: '10px', gap: '6px' },
  lg: { padding: '13px 26px', fontSize: '16px', borderRadius: '14px', gap: '8px' },
}

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  onClick,
  type = 'button',
  className = '',
  style = {},
}, ref) => {
  const vs = VARIANT_STYLES[variant] || VARIANT_STYLES.primary
  const ss = SIZE_STYLES[size] || SIZE_STYLES.md

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ duration: 0.15 }}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
        transition: 'box-shadow 0.2s ease',
        ...vs,
        ...ss,
        ...style,
      }}
    >
      {loading ? <span className="animate-spin">⟳</span> : icon}
      {children}
    </motion.button>
  )
})

Button.displayName = 'Button'
export default Button
