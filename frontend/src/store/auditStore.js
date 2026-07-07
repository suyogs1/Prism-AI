import { create } from 'zustand'
const getTodayTimeStr = (timeStr) => `${new Date().toISOString().split('T')[0]} ${timeStr}`;
const INITIAL_RECORDS = [
  {
    id: 'AUD-2024-001',
    applicationId: 'PRZ-2024-001',
    businessName: 'Sharma Textiles Pvt. Ltd.',
    action: 'APPROVE',
    user: 'Suyog Sonawane (RM)',
    reason: 'Strong cash flow safety score and verified Udyam registration. All compliance checks passed.',
    previousStatus: 'PENDING_REVIEW',
    newStatus: 'APPROVED',
    timestamp: getTodayTimeStr('10:15 AM'),
    score: 84
  },
  {
    id: 'AUD-2024-002',
    applicationId: 'PRZ-2024-003',
    businessName: 'MetalWorks Engineering',
    action: 'DECLINE',
    user: 'Suyog Sonawane (RM)',
    reason: 'High cheque bounce rate exceeding 5% threshold and negative operating surplus.',
    previousStatus: 'PENDING_REVIEW',
    newStatus: 'DECLINED',
    timestamp: getTodayTimeStr('11:30 AM'),
    score: 42
  },
  {
    id: 'AUD-2024-003',
    applicationId: 'PRZ-2024-002',
    businessName: 'Priya Foods & Beverages',
    action: 'REQUEST_EVIDENCE',
    user: 'Suyog Sonawane (RM)',
    reason: 'Missing EPFO filing history and UPI transaction logs. Requested supplementary data to raise confidence above 70%.',
    previousStatus: 'PENDING_REVIEW',
    newStatus: 'EVIDENCE_REQUESTED',
    timestamp: getTodayTimeStr('09:45 AM'),
    score: 68
  }
]
const useAuditStore = create((set) => ({
  records: INITIAL_RECORDS,
  addRecord: (record) => set((state) => ({
    records: [
      {
        id: `AUD-2024-${String(state.records.length + 1).padStart(3, '0')}`,
        timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        user: 'Suyog Sonawane (RM)',
        ...record
      },
      ...state.records
    ]
  })),
  clearRecords: () => set({ records: INITIAL_RECORDS })
}))
export default useAuditStore
