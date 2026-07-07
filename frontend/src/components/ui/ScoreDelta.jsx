import { motion, AnimatePresence } from 'framer-motion'
import Badge from './Badge'
import Button from './Button'

export default function ScoreDelta({ visible = false, oldScore = 68, newScore = 82, oldConfidence = 65, newConfidence = 80, docName = 'EPFO Summary', onClose }) {
  if (!visible) return null

  const scoreDiff = newScore - oldScore
  const confDiff = newConfidence - oldConfidence

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(7,11,24,0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 30, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid rgba(16,185,129,0.4)',
            borderRadius: 24,
            padding: 32,
            maxWidth: 500,
            width: '100%',
            boxShadow: '0 0 50px rgba(16,185,129,0.2), 0 20px 40px rgba(0,0,0,0.6)',
            textAlign: 'center',
            position: 'relative'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Confetti / Celebration Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              width: 72, height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36,
              margin: '0 auto 16px auto',
              boxShadow: '0 0 30px rgba(16,185,129,0.5)'
            }}
          >
            🎉
          </motion.div>

          <Badge variant="green" size="md" className="mb-2">
            IDBI Sandbox API Ingested ✓
          </Badge>

          <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', margin: '8px 0 4px 0' }}>
            Score & Confidence Upgraded!
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
            Successfully verified <strong>{docName}</strong> via live API connector. The deterministic Decision Engine has recalculated all risk and trust indices.
          </p>

          {/* Delta Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Score Delta */}
            <div style={{
              background: 'var(--color-elevated)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 16, padding: 16
            }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Overall Prism Score
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span style={{ fontSize: 18, color: 'var(--color-text-muted)', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>
                  {oldScore}
                </span>
                <span style={{ fontSize: 20 }}>➔</span>
                <span style={{ fontSize: 28, fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  {newScore}
                </span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', marginTop: 4 }}>
                {scoreDiff >= 0 ? `+${scoreDiff} Points` : `${scoreDiff} Points`}
              </div>
            </div>

            {/* Confidence Delta */}
            <div style={{
              background: 'var(--color-elevated)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 16, padding: 16
            }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Scoring Confidence
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span style={{ fontSize: 18, color: 'var(--color-text-muted)', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>
                  {oldConfidence}%
                </span>
                <span style={{ fontSize: 20 }}>➔</span>
                <span style={{ fontSize: 28, fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  {newConfidence}%
                </span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', marginTop: 4 }}>
                {confDiff >= 0 ? `+${confDiff}% Evidence` : `${confDiff}% Evidence`}
              </div>
            </div>
          </div>

          {/* Recommendation Change Banner */}
          <div style={{
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 12, padding: 12,
            marginBottom: 24, fontSize: 13, color: 'var(--color-text-primary)'
          }}>
            🌟 Recommendation Upgraded: <strong style={{ color: '#f59e0b' }}>REQUEST_EVIDENCE</strong> ➔ <strong style={{ color: '#10b981' }}>APPROVE</strong>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={onClose}
            style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', fontWeight: 800 }}
          >
            Apply New Score to Application ➔
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
