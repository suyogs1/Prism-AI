import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import PublicLayout   from './layouts/PublicLayout'
import BankerLayout   from './layouts/BankerLayout'
import MSMELayout     from './layouts/MSMELayout'

// Pages
import LandingPage        from './pages/LandingPage'
import JudgePage          from './pages/JudgePage'
import BankerDashboard    from './pages/banker/BankerDashboard'
import ApplicationDetail  from './pages/banker/ApplicationDetail'
import MSMEDashboard      from './pages/msme/MSMEDashboard'
import MSMEApplication    from './pages/msme/MSMEApplication'
import PrismConnect       from './pages/PrismConnect'
import PolicyCenter       from './pages/PolicyCenter'
import PortfolioDashboard from './pages/PortfolioDashboard'
import SandboxReadiness   from './pages/SandboxReadiness'
import PayloadViewer      from './pages/PayloadViewer'

// Components
import DemoConsole        from './components/ui/DemoConsole'
import AuditLedger        from './components/ui/AuditLedger'

export default function App() {

  return (
    <>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/"       element={<LandingPage />} />
          <Route path="/judge"  element={<JudgePage />} />
        </Route>

        {/* Banker portal */}
        <Route path="/banker" element={<BankerLayout />}>
          <Route index                      element={<BankerDashboard />} />
          <Route path="dashboard"           element={<BankerDashboard />} />
          <Route path="application/:id"     element={<ApplicationDetail />} />
          <Route path="connect"             element={<PrismConnect />} />
          <Route path="payload"             element={<PayloadViewer />} />
          <Route path="portfolio"           element={<PortfolioDashboard />} />
          <Route path="policy"              element={<PolicyCenter />} />
          <Route path="audit"               element={<AuditLedger />} />
          <Route path="sandbox"             element={<SandboxReadiness />} />
        </Route>

        {/* Convenience Redirects */}
        <Route path="/connect"   element={<Navigate to="/banker/connect" replace />} />
        <Route path="/payload"   element={<Navigate to="/banker/payload" replace />} />
        <Route path="/portfolio" element={<Navigate to="/banker/portfolio" replace />} />
        <Route path="/policy"    element={<Navigate to="/banker/policy" replace />} />
        <Route path="/audit"     element={<Navigate to="/banker/audit" replace />} />
        <Route path="/sandbox"   element={<Navigate to="/banker/sandbox" replace />} />

        {/* MSME portal */}
        <Route path="/msme" element={<MSMELayout />}>
          <Route index                element={<MSMEDashboard />} />
          <Route path="dashboard"     element={<MSMEDashboard />} />
          <Route path="application"   element={<MSMEApplication />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <DemoConsole />
    </>
  )
}
