/* Mock data for demo */
export const DEMO_APPLICATIONS = [
  {
    id: 'PRZ-2024-001',
    businessName: 'Sharma Textiles Pvt Ltd',
    ownerName: 'Rajesh Sharma',
    sector: 'Textile Manufacturing',
    location: 'Surat, Gujarat',
    loanAmount: 1200000,
    prismScore: 74,
    riskTier: 'GREEN',
    confidence: 'HIGH',
    status: 'PENDING_REVIEW',
    submittedAt: '2024-01-15T09:30:00Z',
    subScores: {
      gst: 81,
      cashflow: 72,
      stability: 78,
      digital: 58,
      repayment: 76,
    },
    signals: {
      avgMonthlyTurnover: 220000,
      filingGaps: 0,
      businessAge: 4.5,
      bounceRate: 0.02,
      udyamRegistered: true,
    },
    recommendedLoan: 1050000,
    missingData: [],
    explanation: `Sharma Textiles demonstrates strong GST compliance with consistent monthly filings and a turnover growth rate of 18% over the past 12 months. The filing regularity index of 81 reflects zero filing gaps across the assessment period.

Custom cash flow metrics, EPFO filings, and digital history are fully present and verified.
`,
  },
  {
    id: 'PRZ-2024-002',
    businessName: 'Priya Foods & Catering',
    ownerName: 'Priya Nair',
    sector: 'Food & Beverages',
    location: 'Kochi, Kerala',
    loanAmount: 500000,
    prismScore: 58,
    riskTier: 'AMBER',
    confidence: 'MEDIUM',
    status: 'UNDER_REVIEW',
    submittedAt: '2024-01-14T14:15:00Z',
    subScores: {
      gst: 62,
      cashflow: 54,
      stability: 65,
      digital: 48,
      repayment: 61,
    },
    signals: {
      avgMonthlyTurnover: 95000,
      filingGaps: 2,
      businessAge: 2.1,
      bounceRate: 0.08,
      udyamRegistered: true,
    },
    recommendedLoan: 380000,
    missingData: ['epfo_summary', 'upi_history'],
    explanation: `Priya Foods shows moderate GST compliance with 2 filing gaps recorded in the assessment period, resulting in a GST index of 62. Monthly turnover averages ₹95,000 with moderate seasonal variance tied to catering event cycles.

Cash flow analysis indicates an 8% EMI bounce rate over 12 months, which elevates repayment risk marginally. Business age of 2.1 years places the entity in the early-growth category within the food services sector.

The deterministic engine has computed a confidence band of MEDIUM due to absence of ITR and UPI transaction data. The recommended loan ceiling of ₹3.8 lakhs reflects conservative capacity sizing pending supplementary data submission.`,
  },
  {
    id: 'PRZ-2024-003',
    businessName: 'MetalWorks Fabrication',
    ownerName: 'Suresh Kumar',
    sector: 'Metal Fabrication',
    location: 'Pune, Maharashtra',
    loanAmount: 2500000,
    prismScore: 41,
    riskTier: 'RED',
    confidence: 'LOW',
    status: 'ADDITIONAL_DOCS',
    submittedAt: '2024-01-13T11:00:00Z',
    subScores: {
      gst: 38,
      cashflow: 44,
      stability: 52,
      digital: 30,
      repayment: 40,
    },
    signals: {
      avgMonthlyTurnover: 380000,
      filingGaps: 5,
      businessAge: 1.8,
      bounceRate: 0.18,
      udyamRegistered: false,
    },
    recommendedLoan: 0,
    missingData: ['bank_statement', 'gst_returns', 'epfo_summary', 'upi_history'],
    explanation: `MetalWorks Fabrication presents significant data gaps that limit scoring confidence to the LOW band. GST compliance shows 5 filing gaps across the assessment period, generating a GST index of 38. The absence of Udyam registration is noted.

Cash flow data is incomplete — bank statement coverage of only 4 months has been provided against the required 12-month baseline. The available data indicates an 18% EMI bounce rate, which falls in the elevated-risk zone per the scoring framework.

The deterministic engine has flagged this application as requiring supplementary documentation before a loan recommendation can be computed. Submission of 12-month bank statements, ITR, and trade references would materially improve scoring confidence.`,
  },
  {
    id: 'PRZ-2024-004',
    businessName: 'TechBridge Solutions',
    ownerName: 'Ananya Singh',
    sector: 'IT Services',
    location: 'Bengaluru, Karnataka',
    loanAmount: 800000,
    prismScore: 82,
    riskTier: 'GREEN',
    confidence: 'HIGH',
    status: 'APPROVED',
    submittedAt: '2024-01-12T09:00:00Z',
    subScores: {
      gst: 88,
      cashflow: 80,
      stability: 76,
      digital: 85,
      repayment: 82,
    },
    signals: {
      avgMonthlyTurnover: 175000,
      filingGaps: 0,
      businessAge: 3.2,
      bounceRate: 0.01,
      udyamRegistered: true,
    },
    recommendedLoan: 750000,
    missingData: [],
    explanation: `TechBridge Solutions presents a strong overall profile with complete data coverage across all scoring dimensions. GST compliance is excellent with zero filing gaps and a 22% turnover growth trend over 12 months.

Digital footprint index of 85 reflects active payment gateway usage, registered domain presence, and consistent online transaction volumes — a differentiating factor for IT services entities. Cash inflow stability is high with a minimal 1% bounce rate.

All five scoring indices return above-threshold values. The deterministic engine has computed a recommended loan amount of ₹7.5 lakhs based on a 4x monthly cash inflow multiple, adjusted upward by the HIGH confidence multiplier.`,
  },
  {
    id: 'PRZ-2024-005',
    businessName: 'Green Harvest Agro',
    ownerName: 'Mohan Reddy',
    sector: 'Agriculture & Allied',
    location: 'Hyderabad, Telangana',
    loanAmount: 650000,
    prismScore: 63,
    riskTier: 'AMBER',
    confidence: 'MEDIUM',
    status: 'PENDING_REVIEW',
    submittedAt: '2024-01-11T16:45:00Z',
    subScores: {
      gst: 60,
      cashflow: 66,
      stability: 70,
      digital: 42,
      repayment: 68,
    },
    signals: {
      avgMonthlyTurnover: 140000,
      filingGaps: 1,
      businessAge: 5.0,
      bounceRate: 0.05,
      udyamRegistered: true,
    },
    recommendedLoan: 520000,
    missingData: ['upi_history'],
    explanation: `Green Harvest Agro demonstrates solid business stability with 5 years of operational history and active Udyam registration. The GST index of 60 reflects 1 filing gap, consistent with seasonal agricultural activity patterns in the sector.

Cash flow index of 66 reflects strong average monthly inflows of ₹1.4 lakhs with a low 5% bounce rate. Seasonal variance is noted but within acceptable parameters for the agriculture sector under the scoring framework.

The digital footprint index of 42 is the primary score limiter, reflecting limited online presence. The engine has computed a recommended loan of ₹5.2 lakhs. Submission of UPI transaction history would improve confidence from MEDIUM to HIGH.`,
  },
  {
    id: 'PRZ-2024-006',
    businessName: 'Nova Logistics & Packaging',
    ownerName: 'Vikram Mehta',
    sector: 'Transport & Logistics',
    location: 'Indore, Madhya Pradesh',
    loanAmount: 1500000,
    prismScore: 78,
    riskTier: 'GREEN',
    confidence: 'HIGH',
    status: 'APPROVED',
    submittedAt: '2024-01-10T14:20:00Z',
    subScores: {
      gst: 84,
      cashflow: 79,
      stability: 75,
      digital: 70,
      repayment: 82,
    },
    signals: {
      avgMonthlyTurnover: 620000,
      filingGaps: 0,
      businessAge: 4.1,
      bounceRate: 0.015,
      udyamRegistered: true,
    },
    recommendedLoan: 1400000,
    missingData: ['upi_history'],
    explanation: `Nova Logistics demonstrates strong financial fundamentals across all key indices. Cash flow stability is supported by consistent monthly turnover averaging ₹6.2 lakhs with low EMI bounce incidence.

GST filing regularity is pristine over the assessment window. The deterministic engine computed an approved funding ceiling of ₹14 lakhs based on debt service capacity and business age multipliers.`,
  },
  {
    id: 'PRZ-2024-007',
    businessName: 'Aura Healthcare & Diagnostics',
    ownerName: 'Dr. Sneha Patel',
    sector: 'Healthcare Services',
    location: 'Ahmedabad, Gujarat',
    loanAmount: 1000000,
    prismScore: 68,
    riskTier: 'AMBER',
    confidence: 'MEDIUM',
    status: 'UNDER_REVIEW',
    submittedAt: '2024-01-09T11:15:00Z',
    subScores: {
      gst: 55,
      cashflow: 74,
      stability: 72,
      digital: 68,
      repayment: 71,
    },
    signals: {
      avgMonthlyTurnover: 510000,
      filingGaps: 1,
      businessAge: 2.8,
      bounceRate: 0.02,
      udyamRegistered: true,
    },
    recommendedLoan: 850000,
    missingData: ['gst_returns'],
    explanation: `Aura Healthcare exhibits healthy operational cash flows averaging ₹5.1 lakhs monthly. However, scoring confidence is constrained by missing verified GST return records for the trailing two quarters.

The credit decision engine has classified the profile as requiring supplementary verification before finalizing the approved credit line.`,
  },
];

export const PIPELINE_STATS = {
  totalApplications: 47,
  pendingReview: 12,
  approvedThisMonth: 8,
  avgPrismScore: 64,
  totalLoanValue: 28500000,
  avgProcessingDays: 2.4,
};

export const MONTHLY_DATA = [
  { month: 'Aug', applications: 8,  approved: 5,  avgScore: 61 },
  { month: 'Sep', applications: 11, approved: 7,  avgScore: 63 },
  { month: 'Oct', applications: 9,  approved: 6,  avgScore: 65 },
  { month: 'Nov', applications: 14, approved: 9,  avgScore: 62 },
  { month: 'Dec', applications: 12, approved: 8,  avgScore: 67 },
  { month: 'Jan', applications: 15, approved: 10, avgScore: 64 },
];

export const SECTOR_DISTRIBUTION = [
  { name: 'Manufacturing', value: 32, color: '#6366F1' },
  { name: 'Food & Beverage', value: 24, color: '#A855F7' },
  { name: 'IT Services', value: 18, color: '#10B981' },
  { name: 'Agriculture', value: 14, color: '#F59E0B' },
  { name: 'Others', value: 12, color: '#475569' },
];

export const MSME_DEMO = {
  businessName: 'Sharma Textiles Pvt Ltd',
  ownerName: 'Rajesh Sharma',
  applicationId: 'PRZ-2024-001',
  status: 'PENDING_REVIEW',
  prismScore: 74,
  riskTier: 'GREEN',
  confidence: 'HIGH',
  recommendedLoan: 1050000,
  requestedLoan: 1200000,
  completeness: 82,
  documents: [
    { name: 'GST Returns (12 months)', status: 'verified', uploadedAt: '2024-01-15' },
    { name: 'Bank Statement (12 months)', status: 'verified', uploadedAt: '2024-01-15' },
    { name: 'Udyam Certificate', status: 'verified', uploadedAt: '2024-01-15' },
    { name: 'ITR (2 years)', status: 'pending', uploadedAt: null },
    { name: 'UPI Transaction History', status: 'missing', uploadedAt: null },
  ],
  timeline: [
    { event: 'Application Submitted', date: '15 Jan 2024', done: true },
    { event: 'Document Verification', date: '15 Jan 2024', done: true },
    { event: 'Prism Score Computed', date: '15 Jan 2024', done: true },
    { event: 'Underwriter Review', date: 'In Progress', done: false, active: true },
    { event: 'Final Decision', date: 'Awaited', done: false },
  ],
};
