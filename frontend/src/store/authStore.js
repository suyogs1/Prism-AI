import { create } from 'zustand'

/**
 * authStore — Zustand store for user authentication state.
 *
 * In the MVP, this uses demo users with hardcoded roles.
 * A real JWT implementation will replace this in a later phase.
 */
const useAuthStore = create((set) => ({
  user: null,
  role: null, // 'banker' | 'msme'
  isAuthenticated: false,

  login: (userData) => set({
    user: userData,
    role: userData.role,
    isAuthenticated: true,
  }),

  logout: () => set({
    user: null,
    role: null,
    isAuthenticated: false,
  }),

  // Demo login helpers — no API call in scaffold phase
  loginAsbanker: () => set({
    user: { id: 'demo-banker-1', name: 'Arjun Mehta', email: 'arjun.mehta@idbi.co.in', role: 'banker' },
    role: 'banker',
    isAuthenticated: true,
  }),

  loginAsMSME: () => set({
    user: { id: 'demo-msme-1', name: 'Rajesh Sharma', email: 'rajesh@sharmatextiles.com', role: 'msme' },
    role: 'msme',
    isAuthenticated: true,
  }),
}))

export default useAuthStore
