import { useEffect, useState } from 'react'

const INDEX_META = {
  gst:       { label: 'GST Compliance',      color: '#6366F1', weight: '30%' },
  cashflow:  { label: 'Cash Flow',           color: '#10B981', weight: '30%' },
  stability: { label: 'Business Stability',  color: '#A855F7', weight: '20%' },
  digital:   { label: 'Digital Footprint',   color: '#F59E0B', weight: '10%' },
  repayment: { label: 'Repayment Proxy',     color: '#06B6D4', weight: '10%' },
}

function SubScoreBar({ label, score, color, weight, delay }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 150 + delay)
    return () => clearTimeout(t)
  }, [score, delay])

  const tier = score >= 70 ? 'good' : score >= 50 ? 'mid' : 'low'
  const tierColor = tier === 'good' ? '#10B981' : tier === 'mid' ? '#F59E0B' : '#EF4444'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: color, boxShadow: `0 0 6px ${color}`,
            flexShrink: 0,
          }} />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {label}
          </span>
          <span style={{
            fontSize: 'var(--text-xs)', color: 'var(--text-muted)',
            background: 'var(--bg-elevated)', padding: '1px 6px',
            borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)',
          }}>
            {weight}
          </span>
        </div>
        <span style={{
          fontSize: 'var(--text-sm)', fontWeight: 700,
          color: tierColor, fontFamily: 'var(--font-mono)',
        }}>
          {score}
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 8px ${color}55`,
          }}
        />
      </div>
    </div>
  )
}

export default function ScoreBreakdown({ subScores = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {Object.entries(INDEX_META).map(([key, meta], i) => (
        <SubScoreBar
          key={key}
          label={meta.label}
          score={subScores[key] ?? 0}
          color={meta.color}
          weight={meta.weight}
          delay={i * 80}
        />
      ))}
    </div>
  )
}
