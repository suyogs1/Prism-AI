import { create } from 'zustand'
import applicationService from '../services/applicationService'

/**
 * applicationStore — Zustand store for the application pipeline state.
 *
 * Fetches applications dynamically from the FastAPI backend.
 * Features a robust client-side fallback catching mechanism to ensure
 * the frontend demo is completely autonomous if the backend is down.
 */
const useApplicationStore = create((set, get) => ({
  applications: [],
  selectedApplication: null,
  loading: false,
  error: null,

  setApplications: (apps) => set({ applications: apps }),

  selectApplication: (id) => {
    const app = get().applications.find(a => a.id === id) || null
    set({ selectedApplication: app })
  },

  clearSelection: () => set({ selectedApplication: null }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchApplications: async () => {
    set({ loading: true, error: null })
    try {
      const response = await applicationService.list()
      const list = response.data || response
      set({ applications: list, loading: false })
    } catch (err) {
      console.warn("Backend API failed. Falling back to local mock data for demo robustness.", err)
      
      // Dynamic fallback imports to avoid circular dependencies
      const { DEMO_APPLICATIONS } = await import('../data/mockData')
      const { evaluateProfile } = await import('../utils/decisionEngine')
      
      const evaluatedList = DEMO_APPLICATIONS.map(app => {
        // Reconstruct the profile structure dynamically
        const profile = {
          id: app.id,
          businessName: app.businessName,
          ownerName: app.ownerName,
          sector: app.sector,
          location: app.location,
          monthly_revenue: app.signals.avgMonthlyTurnover,
          monthly_expenses: app.signals.avgMonthlyTurnover * 0.6,
          average_bank_balance: app.riskTier === 'AMBER' ? app.signals.avgMonthlyTurnover * 3.7 : app.signals.avgMonthlyTurnover * 1.5,
          existing_loans_monthly_emi: app.riskTier === 'RED' ? 40000 : 15000,
          revenue_growth_percentage: 12.0,
          business_age: app.signals.businessAge,
          epfo_regular: true,
          gst_regular: app.signals.filingGaps === 0,
          customer_concentration: app.riskTier === 'RED' ? 55.0 : 15.0,
          supplier_dependency: 20.0,
          bounce_rate: app.signals.bounceRate * 100,
          existing_loans_balance: app.riskTier === 'RED' ? 300000 : 100000,
          turnover: app.signals.avgMonthlyTurnover * 12,
          bank_statements_present: app.confidence === 'HIGH' || app.confidence === 'MEDIUM',
          gst_present: app.riskTier !== 'RED',
          epfo_present: app.riskTier === 'GREEN',
          upi_present: app.riskTier === 'GREEN',
          relationship_present: app.riskTier !== 'AMBER',
          requested_loan_amount: app.loanAmount
        }
        const decision = evaluateProfile(profile)
        return {
          ...app,
          profile,
          decision
        }
      })
      set({ applications: evaluatedList, loading: false })
    }
  },

  fetchApplication: async (id) => {
    set({ loading: true, error: null })
    try {
      const app = await applicationService.get(id)
      set({ selectedApplication: app, loading: false })
      return app
    } catch (err) {
      console.warn("Backend API failed. Falling back to local mock data for application detail.", err)
      
      const { DEMO_APPLICATIONS } = await import('../data/mockData')
      const { evaluateProfile } = await import('../utils/decisionEngine')
      
      const rawApp = DEMO_APPLICATIONS.find(a => a.id === id) || DEMO_APPLICATIONS[0]
      const profile = {
        id: rawApp.id,
        businessName: rawApp.businessName,
        ownerName: rawApp.ownerName,
        sector: rawApp.sector,
        location: rawApp.location,
        monthly_revenue: rawApp.signals.avgMonthlyTurnover,
        monthly_expenses: rawApp.signals.avgMonthlyTurnover * 0.6,
        average_bank_balance: rawApp.riskTier === 'AMBER' ? rawApp.signals.avgMonthlyTurnover * 3.7 : rawApp.signals.avgMonthlyTurnover * 1.5,
        existing_loans_monthly_emi: rawApp.riskTier === 'RED' ? 40000 : 15000,
        revenue_growth_percentage: 12.0,
        business_age: rawApp.signals.businessAge,
        epfo_regular: true,
        gst_regular: rawApp.signals.filingGaps === 0,
        customer_concentration: rawApp.riskTier === 'RED' ? 55.0 : 15.0,
        supplier_dependency: 20.0,
        bounce_rate: rawApp.signals.bounceRate * 100,
        existing_loans_balance: rawApp.riskTier === 'RED' ? 300000 : 100000,
        turnover: rawApp.signals.avgMonthlyTurnover * 12,
        bank_statements_present: rawApp.confidence === 'HIGH' || rawApp.confidence === 'MEDIUM',
        gst_present: rawApp.riskTier !== 'RED',
        epfo_present: rawApp.riskTier === 'GREEN',
        upi_present: rawApp.riskTier === 'GREEN',
        relationship_present: rawApp.riskTier !== 'AMBER',
        requested_loan_amount: rawApp.loanAmount
      }
      const decision = evaluateProfile(profile)
      const fallbackApp = {
        ...rawApp,
        profile,
        decision
      }
      set({ selectedApplication: fallbackApp, loading: false })
      return fallbackApp
    }
  },
}))

export default useApplicationStore
