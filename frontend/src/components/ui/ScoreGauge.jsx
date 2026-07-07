import { useEffect, useRef, useState } from 'react'
import { TIER } from '../../theme/tokens'

/**
 * ScoreGauge — animated SVG arc gauge for the Prism Score.
 *
 * Props:
 *   score  - number 0–100
 *   tier   - 'GREEN' | 'AMBER' | 'RED'
 *   size   - px diameter (default 180)
 */
export default function ScoreGauge({ score = 0, tier = 'AMBER', size = 180 }) {
  const [displayed, setDisplayed] = useState(0)
  const rafRef = useRef()
  const config = TIER[tier] || TIER.AMBER

  const strokeWidth = size * 0.056
  const radius = size / 2 - strokeWidth - 4
  const circumference = 2 * Math.PI * radius
  const arcLength = circumference * 0.75
  const startOffset = circumference * 0.125
  const dashOffset = arcLength - (arcLength * displayed) / 100

  // Count-up animation
  useEffect(() => {
    let start = null
    const duration = 1400
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(ease * score))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [score])

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(135deg)' }}
        aria-label={`Prism Score: ${score}`}
      >
        <defs>
          <filter id={`gauge-glow-${tier}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeDashoffset={-startOffset}
        />

        {/* Fill */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={config.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeDashoffset={-startOffset + dashOffset}
          filter={`url(#gauge-glow-${tier})`}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>

      {/* Centre label */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        paddingBottom: 10,
      }}>
        <span style={{
          fontSize: size * 0.22,
          fontWeight: 800,
          lineHeight: 1,
          color: config.color,
          fontFamily: 'var(--font-sans)',
          letterSpacing: '-0.03em',
          textShadow: `0 0 24px ${config.glow}`,
        }}>
          {displayed}
        </span>
        <span style={{
          fontSize: size * 0.075,
          color: 'var(--color-text-muted)',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginTop: 4,
        }}>
          Prism Score
        </span>
      </div>
    </div>
  )
}
