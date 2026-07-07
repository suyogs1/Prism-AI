// Design tokens mirrored in JS for use in non-CSS contexts (charts, SVGs, etc.)
export const colors = {
  prism: {
    50:  '#eef2ff',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
  },
  accent: {
    400: '#c084fc',
    500: '#a855f7',
  },
  success: '#10b981',
  warning: '#f59e0b',
  danger:  '#ef4444',
  info:    '#06b6d4',

  surface:  '#0f1629',
  elevated: '#161d35',
  void:     '#070b18',
  base:     '#0a0f1e',

  text: {
    primary:   '#f0f4ff',
    secondary: '#94a3b8',
    muted:     '#475569',
  },
  border: {
    subtle:  'rgba(255,255,255,0.04)',
    default: 'rgba(255,255,255,0.08)',
    strong:  'rgba(255,255,255,0.14)',
  },
}

export const gradients = {
  primary: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  brand:   'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
  success: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
  warning: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
  danger:  'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
}

// Risk tier config — shared across components
export const TIER = {
  GREEN: { color: '#10b981', glow: 'rgba(16,185,129,0.3)',  label: 'Low Risk',      bg: 'rgba(16,185,129,0.08)'  },
  AMBER: { color: '#f59e0b', glow: 'rgba(245,158,11,0.3)', label: 'Moderate Risk', bg: 'rgba(245,158,11,0.08)'  },
  RED:   { color: '#ef4444', glow: 'rgba(239,68,68,0.3)',   label: 'High Risk',     bg: 'rgba(239,68,68,0.08)'   },
}

// Confidence config
export const CONFIDENCE = {
  HIGH:   { color: '#10b981', bars: 3, label: 'High Confidence',   desc: '≥75% data signals' },
  MEDIUM: { color: '#f59e0b', bars: 2, label: 'Medium Confidence', desc: '50–74% data signals' },
  LOW:    { color: '#ef4444', bars: 1, label: 'Low Confidence',     desc: '<50% data signals' },
}

// Sub-index metadata
export const INDEX_META = {
  gst:       { label: 'GST Compliance',     color: '#6366f1', weight: 0.30 },
  cashflow:  { label: 'Cash Flow',          color: '#10b981', weight: 0.30 },
  stability: { label: 'Business Stability', color: '#a855f7', weight: 0.20 },
  digital:   { label: 'Digital Footprint',  color: '#f59e0b', weight: 0.10 },
  repayment: { label: 'Repayment Proxy',    color: '#06b6d4', weight: 0.10 },
}
