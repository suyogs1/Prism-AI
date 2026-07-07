import { Outlet } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'

/**
 * MSMELayout — topbar layout for MSME applicant routes.
 * Reuses the global shared Navbar to prevent code duplication and visual inconsistencies.
 */
export default function MSMELayout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-base)' }}>
      {/* Shared Nav */}
      <Navbar role="msme" />

      {/* Content */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}
