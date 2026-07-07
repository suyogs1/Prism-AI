import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import useApplicationStore from '../../store/applicationStore'
import Card from '../../components/ui/Card'
import Badge, { tierVariant } from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { PIPELINE_STATS, MONTHLY_DATA, SECTOR_DISTRIBUTION } from '../../data/mockData'
import { colors } from '../../theme/tokens'




const STATUS_CONFIG = {
  PENDING_REVIEW:  { label: 'Pending Review', variant: 'amber' },
  UNDER_REVIEW:    { label: 'Under Review',   variant: 'blue'  },
  ADDITIONAL_DOCS: { label: 'Docs Required',  variant: 'red'   },
  APPROVED:        { label: 'Approved',        variant: 'green' },
}

const TIER_COLORS = { GREEN: '#10b981', AMBER: '#f59e0b', RED: '#ef4444' }

function StatCard({ label, value, sub, icon, color, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card hover padding={20} style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 90, height: 90,
          background: `radial-gradient(circle, ${color}20, transparent)`,
          borderRadius: '50%', pointerEvents: 'none',
        }}/>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${color}15`, border: `1px solid ${color}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, marginBottom: 12,
        }}>
          {icon}
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
      </Card>
    </motion.div>
  )
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--color-elevated)', border: '1px solid var(--color-border-strong)',
      borderRadius: 10, padding: '10px 14px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    }}>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  )
}

export default function BankerDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { applications, fetchApplications, loading } = useApplicationStore()

  useEffect(() => {
    fetchApplications()
  }, [])

  const highlightId = location.state?.highlightId
  const highlightApp = applications.find(a => a.id === highlightId)

  const stats = [
    { label: 'Total Applications', value: PIPELINE_STATS.totalApplications, icon: '📋', color: colors.prism[500], sub: '+5 this week', delay: 0 },
    { label: 'Pending Review',     value: PIPELINE_STATS.pendingReview,     icon: '⏳', color: colors.warning,   sub: 'Action required', delay: 0.05 },
    { label: 'Approved This Month',value: PIPELINE_STATS.approvedThisMonth, icon: '✅', color: colors.success,   sub: '67% approval rate', delay: 0.1 },
    { label: 'Avg Prism Score',    value: PIPELINE_STATS.avgPrismScore,     icon: '📊', color: colors.accent[500], sub: 'Portfolio median', delay: 0.15 },
    { label: 'Total Loan Value',   value: `₹${(PIPELINE_STATS.totalLoanValue/10000000).toFixed(1)}Cr`, icon: '💰', color: colors.info, sub: 'Recommended pipeline', delay: 0.2 },
    { label: 'Avg Processing',     value: `${PIPELINE_STATS.avgProcessingDays}d`, icon: '⚡', color: colors.warning, sub: 'Days to decision', delay: 0.25 },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-base)' }}>
      <div className="p-8">
        {highlightApp && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.06) 100%)',
              border: '1px solid rgba(99,102,241,0.25)',
              boxShadow: '0 0 20px rgba(99,102,241,0.15)',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">✦</span>
              <div className="text-left">
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Demo Walkthrough Active
                </span>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  Evaluating <strong style={{ color: '#fff' }}>{highlightApp.businessName}</strong>. Click the highlighted row in the table below to view the deterministic sub-indices and Gemini's natural-language credit narrative.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/banker/application/${highlightApp.id}`)}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                border: 'none', borderRadius: 8, padding: '6px 14px',
                color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                whiteSpace: 'nowrap', marginLeft: 16,
              }}
            >
              Open Report →
            </button>
          </motion.div>
        )}

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-8">
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-text-primary)', marginBottom: 4 }}>
              Credit Pipeline
            </h1>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · IDBI Bank, Mumbai Branch
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/msme/application')}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              border: 'none', borderRadius: 12, padding: '10px 20px',
              color: '#fff', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.3)',
            }}
          >
            + New Application
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-6 gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
          {stats.map(s => <StatCard key={s.label} {...s}/>)}
        </div>

        {/* Charts row */}
        <div className="grid gap-5 mb-6" style={{ gridTemplateColumns: '1fr 260px' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card padding={24}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                Application Trend
              </h2>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 16 }}>Applications vs approvals — last 6 months</p>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={MONTHLY_DATA}>
                  <defs>
                    <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTooltip/>}/>
                  <Area type="monotone" dataKey="applications" name="Applications" stroke="#6366f1" fill="url(#ga)" strokeWidth={2}/>
                  <Area type="monotone" dataKey="approved"     name="Approved"     stroke="#10b981" fill="url(#gb)" strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <Card padding={20}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>Sector Mix</h2>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 12 }}>Active pipeline</p>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={SECTOR_DISTRIBUTION} cx="50%" cy="50%" innerRadius={38} outerRadius={55} paddingAngle={3} dataKey="value">
                    {SECTOR_DISTRIBUTION.map((e, i) => <Cell key={i} fill={e.color}/>)}
                  </Pie>
                  <Tooltip content={<ChartTooltip/>}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 mt-2">
                {SECTOR_DISTRIBUTION.map(s => (
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }}/>
                      <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{s.name}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{s.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Applications table */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card padding={0} style={{ overflow: 'hidden' }}>
            <div className="flex items-center justify-between px-6 py-4"
                 style={{ borderBottom: '1px solid var(--color-border-default)' }}>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>Applications</h2>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Click any row to open the full Prism Report</p>
              </div>
              <div className="flex gap-2">
                {['All', 'Pending', 'Green', 'Amber', 'Red'].map(f => (
                  <button key={f} style={{
                    background: 'var(--color-elevated)', border: '1px solid var(--color-border-default)',
                    borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 500,
                    color: 'var(--color-text-secondary)', cursor: 'pointer',
                  }}>{f}</button>
                ))}
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--color-void)' }}>
                    {['Business', 'Sector', 'Prism Score', 'Loan Ask', 'Status', ''].map(h => (
                      <th key={h} style={{
                        padding: '11px 20px', textAlign: 'left',
                        fontSize: 10, fontWeight: 700,
                        color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em',
                        borderBottom: '1px solid var(--color-border-default)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                           <LoadingSpinner size={24} />
                           <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Loading pipeline...</span>
                        </div>
                      </td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                        No applications found in pipeline.
                      </td>
                    </tr>
                  ) : applications.map((app, i) => {
                    const sc = STATUS_CONFIG[app.status] || { label: app.status, variant: 'default' }
                    const tc = TIER_COLORS[app.riskTier]
                    return (
                      <motion.tr
                        key={app.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 + i * 0.04 }}
                        onClick={() => navigate(`/banker/application/${app.id}`)}
                        style={{
                          cursor: 'pointer',
                          borderBottom: '1px solid var(--color-border-subtle)',
                          transition: 'background 0.12s ease',
                          background: app.id === highlightId ? 'rgba(99,102,241,0.08)' : 'transparent',
                          boxShadow: app.id === highlightId ? 'inset 4px 0 0 #6366f1' : 'none',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = app.id === highlightId ? 'rgba(99,102,241,0.12)' : 'var(--color-elevated)'}
                        onMouseLeave={e => e.currentTarget.style.background = app.id === highlightId ? 'rgba(99,102,241,0.08)' : 'transparent'}
                      >
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{app.businessName}</div>
                          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>{app.ownerName} · {app.location}</div>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{app.sector}</span>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <div className="flex items-center gap-2">
                            <div style={{
                              width: 34, height: 34, borderRadius: '50%',
                              background: `${tc}12`, border: `2px solid ${tc}35`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 11, fontWeight: 800, color: tc, fontFamily: 'var(--font-mono)',
                            }}>{app.prismScore}</div>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: tc }}>{app.riskTier}</div>
                              <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{app.confidence}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
                            ₹{(app.loanAmount/100000).toFixed(1)}L
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <Badge variant={sc.variant} dot>{sc.label}</Badge>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
