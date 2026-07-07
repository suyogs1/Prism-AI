/**
 * Realistic Synthetic Banking Payloads for IDBI Bank Sandbox Integration
 *
 * Demonstrates the exact JSON structures received from external regulatory
 * gateways (FIU-IND, GSTN, NPCI, EPFO) before normalization by BaseParser.
 */

export const AA_PAYLOAD = {
  header: {
    fiuId: "FIU-IDBI-SBX-9982",
    consentId: "CN-20240114-88412",
    timestamp: "2024-01-14T10:14:22Z",
    status: "DELIVERED",
    digitalSignature: "RSA-SHA256: 3a98f1c2...8b1e4c"
  },
  accountSummary: {
    accountNumber: "XXXXXXXX4829",
    accountType: "CURRENT",
    bankName: "IDBI Bank Ltd",
    branch: "Nariman Point, Mumbai",
    currency: "INR",
    currentBalance: 845000.00,
    averageMonthlyBalance: 790000.00
  },
  transactions: [
    { txnId: "TXN001", date: "2024-01-12", type: "CREDIT", amount: 450000.00, narration: "NEFT-RECEIPT-TATA MOTORS LTD-INV882", balance: 845000.00 },
    { txnId: "TXN002", date: "2024-01-10", type: "DEBIT", amount: 125000.00, narration: "ACH-DEBIT-HDFC LIFE EMI-LOAN991", balance: 395000.00 },
    { txnId: "TXN003", date: "2024-01-05", type: "CREDIT", amount: 310000.00, narration: "RTGS-RECEIPT-RELIANCE RETAIL-INV881", balance: 520000.00 },
    { txnId: "TXN004", date: "2024-01-02", type: "DEBIT", amount: 85000.00, narration: "NEFT-DEBIT-SHREE STEEL SUPPLIERS", balance: 210000.00 }
  ],
  analyticsSummary: {
    inflowVelocityMonthly: 1240000.00,
    outflowVelocityMonthly: 890000.00,
    emiBounceCount12M: 0,
    salaryRemittanceCount: 45
  }
}

export const GST_PAYLOAD = {
  header: {
    gstin: "27AABCS1429B1Z5",
    legalName: "SHARMA TEXTILES PRIVATE LIMITED",
    tradeName: "Sharma Textiles",
    returnPeriod: "122023",
    filingStatus: "FILED",
    filingDate: "2024-01-11T14:20:00Z",
    arn: "AA2701240018291"
  },
  gstr3bSummary: {
    outwardTaxableSupplies: {
      totalTurnover: 14500000.00,
      igst: 1305000.00,
      cgst: 652500.00,
      sgst: 652500.00
    },
    inwardSuppliesITC: {
      itcAvailable: 980000.00,
      itcClaimed: 950000.00,
      itcReversed: 30000.00
    },
    taxPaidCash: 1660000.00,
    taxPaidITC: 950000.00
  },
  complianceHistory: {
    returnsFiled12M: 12,
    delayedFilings12M: 0,
    averageFilingDelayDays: 0,
    turnoverGrowthYoY: 18.5
  }
}

export const UPI_PAYLOAD = {
  header: {
    merchantVpa: "sharmatextiles@idbi",
    merchantId: "MID-IDBI-774102",
    network: "NPCI UPI 2.4",
    aggregationPeriod: "2023-12-01 TO 2023-12-31"
  },
  volumeAnalytics: {
    totalTransactions: 3420,
    totalVolumeINR: 2850000.00,
    averageTicketSize: 833.33,
    uniquePayersCount: 1420
  },
  velocityMetrics: {
    peakHourVolumePercentage: 35.4,
    weekendVolumePercentage: 28.1,
    digitalReceiptRatio: 0.65,
    refundRatePercentage: 0.4
  },
  settlementAccount: "XXXXXXXX4829"
}

export const EPFO_PAYLOAD = {
  header: {
    establishmentId: "MH/BAN/0048291/000",
    establishmentName: "SHRAMA TEXTILES PRIVATE LIMITED",
    status: "ACTIVE",
    coverageDate: "2018-04-01"
  },
  headcountSummary: {
    activeContributingMembers: 45,
    excludedEmployees: 3,
    newJoinees3M: 6,
    exits3M: 2
  },
  remittanceHistory: [
    { wageMonth: "Nov-2023", depositDate: "2023-12-14", totalWagesINR: 950000.00, totalContributionINR: 228000.00, workers: 45, status: "REGULAR" },
    { wageMonth: "Oct-2023", depositDate: "2023-11-13", totalWagesINR: 920000.00, totalContributionINR: 220800.00, workers: 44, status: "REGULAR" },
    { wageMonth: "Sep-2023", depositDate: "2023-10-14", totalWagesINR: 900000.00, totalContributionINR: 216000.00, workers: 43, status: "REGULAR" }
  ],
  complianceScore: {
    filingRegularityPercentage: 100,
    defaultNoticeCount3Y: 0
  }
}

const sandboxPayloads = {
  AA: AA_PAYLOAD,
  GST: GST_PAYLOAD,
  UPI: UPI_PAYLOAD,
  EPFO: EPFO_PAYLOAD
}

export default sandboxPayloads
