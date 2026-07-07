import { motion } from 'framer-motion'
import Card from './Card'
import Badge from './Badge'

export default function NormalizationView({ activePayloadType = 'AA' }) {
  const MAPPINGS = {
    AA: [
      {
        rawField: 'AA.accountSummary.currentBalance',
        rawVal: '₹8,45,000.00',
        parserMethod: 'BankStatementParser.extract_liquidity()',
        normalizedSignal: 'average_bank_balance',
        normVal: '₹7,90,000',
        targetIndex: 'Cash Flow Safety Index (35%)'
      },
      {
        rawField: 'AA.analyticsSummary.inflowVelocityMonthly',
        rawVal: '₹12,40,000.00',
        parserMethod: 'BankStatementParser.compute_inflows()',
        normalizedSignal: 'monthly_revenue',
        normVal: '₹12,40,000',
        targetIndex: 'Cash Flow Safety Index (35%)'
      },
      {
        rawField: 'AA.analyticsSummary.emiBounceCount12M',
        rawVal: '0 Bounces',
        parserMethod: 'BankStatementParser.verify_repayment()',
        normalizedSignal: 'bounce_rate',
        normVal: '0.0%',
        targetIndex: 'Risk Safety Score (20%)'
      }
    ],
    GST: [
      {
        rawField: 'GST.gstr3bSummary.outwardTaxableSupplies.totalTurnover',
        rawVal: '₹1,45,00,000.00',
        parserMethod: 'GSTParser.extract_annual_turnover()',
        normalizedSignal: 'annual_turnover',
        normVal: '₹1,45,00,000',
        targetIndex: 'Growth Momentum Index (20%)'
      },
      {
        rawField: 'GST.complianceHistory.turnoverGrowthYoY',
        rawVal: '18.5%',
        parserMethod: 'GSTParser.compute_growth_rate()',
        normalizedSignal: 'revenue_growth_percentage',
        normVal: '18.5%',
        targetIndex: 'Growth Momentum Index (20%)'
      },
      {
        rawField: 'GST.complianceHistory.returnsFiled12M',
        rawVal: '12 / 12 Months',
        parserMethod: 'GSTParser.verify_compliance()',
        normalizedSignal: 'gst_regular',
        normVal: 'true (Verified)',
        targetIndex: 'Regulatory Trust Index (25%)'
      }
    ],
    UPI: [
      {
        rawField: 'UPI.volumeAnalytics.totalVolumeINR',
        rawVal: '₹28,50,000.00',
        parserMethod: 'UPIParser.extract_retail_velocity()',
        normalizedSignal: 'digital_turnover_share',
        normVal: '65.0%',
        targetIndex: 'Cash Flow Safety Index (35%)'
      },
      {
        rawField: 'UPI.volumeAnalytics.uniquePayersCount',
        rawVal: '1,420 Payers',
        parserMethod: 'UPIParser.assess_concentration()',
        normalizedSignal: 'customer_concentration_flag',
        normVal: 'false (Low Risk)',
        targetIndex: 'Risk Safety Score (20%)'
      }
    ],
    EPFO: [
      {
        rawField: 'EPFO.headcountSummary.activeContributingMembers',
        rawVal: '45 Employees',
        parserMethod: 'EPFOParser.verify_headcount()',
        normalizedSignal: 'employee_count',
        normVal: '45 Active',
        targetIndex: 'Regulatory Trust Index (25%)'
      },
      {
        rawField: 'EPFO.complianceScore.filingRegularityPercentage',
        rawVal: '100%',
        parserMethod: 'EPFOParser.verify_remittances()',
        normalizedSignal: 'epfo_regular',
        normVal: 'true (100% Regular)',
        targetIndex: 'Regulatory Trust Index (25%)'
      }
    ]
  }

  const activeRows = MAPPINGS[activePayloadType] || MAPPINGS.AA

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
          🔄 BaseParser Abstraction Layer — Schema Normalization Flow
        </span>
        <Badge variant="blue" size="xs">Invariant Engine Bridge</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activeRows.map((row, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card padding={16} style={{ background: 'var(--color-void)', border: '1px solid var(--color-border-subtle)' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Column 1: Raw Sandbox Field */}
                <div className="p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>1. Raw Sandbox API Field</span>
                    <span style={{ fontSize: 10 }}>📦</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                    {row.rawField}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#ef4444', marginTop: 4 }}>
                    {row.rawVal}
                  </div>
                </div>

                {/* Column 2: BaseParser Transformation */}
                <div className="p-3 rounded-xl text-center relative" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase', marginBottom: 2 }}>2. BaseParser Transformation</div>
                  <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>
                    {row.parserMethod}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4 }}>
                    Validates schema, strips noise & normalizes unit
                  </div>
                </div>

                {/* Column 3: Normalized Engine Signal */}
                <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>3. Normalized Engine Signal</span>
                    <Badge variant="green" size="xs">Ready</Badge>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                    {row.normalizedSignal}: <span style={{ color: '#10b981' }}>{row.normVal}</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4 }}>
                    Feeds into ➔ <strong style={{ color: 'var(--color-text-secondary)' }}>{row.targetIndex}</strong>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="p-3 rounded-xl text-center" style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border-subtle)', marginTop: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
          🔒 Because of this decoupling, when IDBI Bank updates an API schema or adds a new FIU connector, <strong>we only modify the BaseParser method.</strong> The Decision Engine math remains 100% frozen and untouched.
        </span>
      </div>
    </div>
  )
}
