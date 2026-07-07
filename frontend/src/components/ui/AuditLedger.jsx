import { useState } from 'react'
import { motion } from 'framer-motion'
import useAuditStore from '../../store/auditStore'
import Card from './Card'
import Badge from './Badge'

export default function AuditLedger() {
  const { records } = useAuditStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('ALL')

  const filteredRecords = records.filter(rec => {
    const matchesSearch = rec.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = filterAction === 'ALL' || rec.action === filterAction
    return matchesSearch && matchesAction
  })

  const getActionBadge = (action) => {
    switch (action) {
      case 'APPROVE':
        return <Badge variant="green">APPROVED ✓</Badge>
      case 'DECLINE':
        return <Badge variant="red">DECLINED ✕</Badge>
      case 'REQUEST_EVIDENCE':
      case 'REQUEST':
        return <Badge variant="amber">EVIDENCE REQUESTED 📁</Badge>
      default:
        return <Badge variant="blue">{action}</Badge>
    }
  }

  return (
    <div className="p-8 min-h-screen" style={{ background: 'var(--color-base)' }}>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>
              🛡️ Regulatory Audit Ledger
            </span>
            <Badge variant="purple" size="xs">RBI Compliance Ready</Badge>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            Immutable chronological logging of all underwriter decisions, scoring parameters, and manual overrides.
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.25)',
        boxShadow: '0 0 20px rgba(99,102,241,0.15)'
      }}>
        <span style={{ fontSize: 20 }}>⚖️</span>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--color-text-primary)' }}>Regulatory Compliance Guarantee:</strong> Every human-in-the-loop credit decision is recorded with timestamp, underwriter identity, system score snapshot, and mandatory justification notes. This ledger satisfies RBI audit requirements for AI-assisted lending.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card padding={16} className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginRight: 4 }}>
              Filter Action:
            </span>
            {['ALL', 'APPROVE', 'REQUEST_EVIDENCE', 'DECLINE'].map(act => (
              <button
                key={act}
                onClick={() => setFilterAction(act)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: filterAction === act ? '1px solid var(--color-prism-500)' : '1px solid var(--color-border-default)',
                  background: filterAction === act ? 'rgba(99,102,241,0.15)' : 'var(--color-elevated)',
                  color: filterAction === act ? '#fff' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s'
                }}
              >
                {act === 'ALL' ? 'All Records' : act === 'REQUEST_EVIDENCE' ? 'Evidence Requested' : act}
              </button>
            ))}
          </div>

          <div style={{ width: 280 }}>
            <input
              type="text"
              placeholder="Search business, ID, or notes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--color-void)',
                border: '1px solid var(--color-border-strong)',
                borderRadius: 8,
                color: 'var(--color-text-primary)',
                fontSize: 12,
                outline: 'none'
              }}
            />
          </div>
        </div>
      </Card>

      {/* Table Card */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-elevated)', borderBottom: '1px solid var(--color-border-strong)' }}>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Log ID & Timestamp</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Applicant Entity</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Action Taken</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>System Score</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Underwriter</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', width: '35%' }}>Justification / Override Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec, idx) => (
                  <motion.tr
                    key={rec.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      borderBottom: idx === filteredRecords.length - 1 ? 'none' : '1px solid var(--color-border-default)',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-prism-400)', fontFamily: 'var(--font-mono)' }}>
                        {rec.id}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                        {rec.timestamp}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {rec.businessName}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                        {rec.applicationId}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {getActionBadge(rec.action)}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        fontSize: 14,
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        color: rec.score >= 75 ? '#10b981' : rec.score >= 50 ? '#f59e0b' : '#ef4444'
                      }}>
                        {rec.score || '—'}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginLeft: 4 }}>/100</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div className="flex items-center gap-2">
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 700, color: '#fff'
                        }}>
                          SS
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                          {rec.user}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        {rec.reason}
                      </p>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
                    No audit ledger records found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
