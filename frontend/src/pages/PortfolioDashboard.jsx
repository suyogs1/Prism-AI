import { motion } from 'framer-motion'
import { PIPELINE_STATS, MONTHLY_DATA, SECTOR_DISTRIBUTION, DEMO_APPLICATIONS } from '../data/mockData'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

export default function PortfolioDashboard() {
  const navigate = useNavigate()

  const RISK_DISTRIBUTION = [
    { name: 'Low Risk (Score ≥ 75)', value: 21, color: '#10b981' },
    { name: 'Medium Risk (50-74)', value: 18, color: '#f59e0b' },
    { name: 'High Risk (Score < 50)', value: 8, color: '#ef4444' }
  ]

  const EVIDENCE_FREQUENCY = [
    { doc: 'Bank Statements (AA)', count: 18 },
    { doc: 'GST Returns (GSTR-3B)', count: 14 },
    { doc: 'EPFO Summary', count: 9 },
    { doc: 'UPI History Logs', count: 6 }
  ]

  return (
    <div className="p-8 min-h-screen" style={{ background: 'var(--color-base)' }}>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>
              📊 Enterprise Portfolio Dashboard
            </span>
            <Badge variant="purple" size="xs">CRO Executive View</Badge>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            Macro-level risk analytics, sector concentration monitoring, and processing velocity across all MSME applications.
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card padding={18} style={{ background: 'var(--color-surface)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total Applications</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)', marginTop: 6 }}>
            {PIPELINE_STATS.total}
          </div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>+12% vs last month</div>
        </Card>

        <Card padding={18} style={{ background: 'var(--color-surface)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Auto-Approved</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)', marginTop: 6 }}>
            {PIPELINE_STATS.approved} <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>({((PIPELINE_STATS.approved / PIPELINE_STATS.total) * 100).toFixed(0)}%)</span>
          </div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>Zero human touch</div>
        </Card>

        <Card padding={18} style={{ background: 'var(--color-surface)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Avg Portfolio Confidence</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-prism-400)', fontFamily: 'var(--font-mono)', marginTop: 6 }}>
            82%
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>High data density</div>
        </Card>

        <Card padding={18} style={{ background: 'var(--color-surface)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Total Potential Lending</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#06b6d4', fontFamily: 'var(--font-mono)', marginTop: 6 }}>
            ₹2.85 Cr
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>Across approved pipeline</div>
        </Card>

        <Card padding={18} style={{ background: 'var(--color-surface)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Avg Processing Time</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#a855f7', fontFamily: 'var(--font-mono)', marginTop: 6 }}>
            2.4 Days
          </div>
          <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>65% faster than legacy</div>
        </Card>
      </div>

      {/* Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chart 1: Risk Distribution */}
        <Card padding={24}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 16 }}>
            1. Portfolio Risk Tier Distribution
          </h3>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RISK_DISTRIBUTION}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                >
                  {RISK_DISTRIBUTION.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: 12, color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Most Requested Evidence */}
        <Card padding={24}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 16 }}>
            2. Most Requested Supplementary Evidence
          </h3>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EVIDENCE_FREQUENCY} layout="vertical" margin={{ left: 40, right: 20 }}>
                <XAxis type="number" stroke="var(--color-text-muted)" />
                <YAxis dataKey="doc" type="category" stroke="var(--color-text-secondary)" width={140} style={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: 12, color: '#fff' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chart 3: Monthly Application Trend */}
        <Card padding={24}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 16 }}>
            3. Monthly Applications vs Approvals Trend
          </h3>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_DATA}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAppr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="var(--color-text-muted)" style={{ fontSize: 11 }} />
                <YAxis stroke="var(--color-text-muted)" style={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: 12, color: '#fff' }} />
                <Area type="monotone" dataKey="applications" stroke="#6366f1" fillOpacity={1} fill="url(#colorApps)" name="Total Applications" />
                <Area type="monotone" dataKey="approved" stroke="#10b981" fillOpacity={1} fill="url(#colorAppr)" name="Approved Loans" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Sector Distribution */}
        <Card padding={24}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 16 }}>
            4. Sector Concentration Breakdown
          </h3>
          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SECTOR_DISTRIBUTION}>
                <XAxis dataKey="name" stroke="var(--color-text-muted)" style={{ fontSize: 11 }} />
                <YAxis stroke="var(--color-text-muted)" style={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', borderRadius: 12, color: '#fff' }} />
                <Bar dataKey="value" fill="#a855f7" radius={[8, 8, 0, 0]} name="Share %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* High-Priority Review Table */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border-default)', background: 'var(--color-elevated)' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
              🚨 High-Priority Review Queue
            </h3>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
              Applications requiring immediate underwriter attention or manual override
            </div>
          </div>
          <Badge variant="amber" size="sm">Action Required</Badge>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-strong)' }}>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>ID & Business</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Sector</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Requested Loan</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Prism Score</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '14px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_APPLICATIONS.slice(0, 5).map((app, idx) => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--color-border-default)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{app.businessName}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{app.id}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: 12, color: 'var(--color-text-secondary)' }}>{app.sector}</td>
                  <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                    ₹{((app.loanAmount || app.requestedLoanAmount || app.requested_loan_amount || 0) / 100000).toFixed(2)} Lakhs
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      fontSize: 15, fontWeight: 800, fontFamily: 'var(--font-mono)',
                      color: (app.prismScore || app.overallScore || app.score || 0) >= 75 ? '#10b981' : (app.prismScore || app.overallScore || app.score || 0) >= 50 ? '#f59e0b' : '#ef4444'
                    }}>
                      {app.prismScore || app.overallScore || app.score || '—'}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginLeft: 4 }}>/100</span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <Badge variant={app.status === 'APPROVED' ? 'green' : app.status === 'PENDING_REVIEW' ? 'blue' : 'amber'} size="xs">
                      {app.status}
                    </Badge>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/banker/application/${app.id}`)}>
                      Inspect Case ➔
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
