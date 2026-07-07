import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { label: 'Dashboard',     path: '/banker/dashboard',  icon: '◼' },
  { label: 'Applications',  path: '/banker/dashboard',  icon: '📋' },
  { label: '+ New Application', path: '/msme/application', icon: '➕' },
  { label: 'Prism Connect', path: '/banker/connect',    icon: '🔌' },
  { label: 'Payload Viewer',path: '/banker/payload',    icon: '⚡' },
  { label: 'Portfolio',     path: '/banker/portfolio',  icon: '📊' },
  { label: 'Policy Center', path: '/banker/policy',     icon: '⚙️' },
  { label: 'Audit Ledger',  path: '/banker/audit',      icon: '🛡️' },
  { label: 'Sandbox Roadmap',path: '/banker/sandbox',   icon: '🗺️' },
]

function PrismWordmark() {
  return (
    <div className="flex items-center gap-2 px-4 py-4 border-b" style={{ borderColor: 'var(--color-border-default)' }}>
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="sl" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#a855f7"/>
          </linearGradient>
        </defs>
        <polygon points="16,3 29,26 3,26" fill="none" stroke="url(#sl)" strokeWidth="2" strokeLinejoin="round"/>
        <polygon points="16,9 24,23 8,23" fill="url(#sl)" opacity="0.2"/>
        <line x1="16" y1="9" x2="12" y2="23" stroke="#10b981" strokeWidth="1.5"/>
        <line x1="16" y1="9" x2="20" y2="23" stroke="#f59e0b" strokeWidth="1.5"/>
      </svg>
      <div>
        <div className="font-bold text-sm gradient-text tracking-tight">Prism AI</div>
        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Banker Portal</div>
      </div>
    </div>
  )
}

function SidebarItem({ item }) {
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname === item.path || (item.path !== '/banker/dashboard' && location.pathname.startsWith(item.path))

  return (
    <button
      onClick={() => navigate(item.path)}
      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mx-2 text-sm font-medium transition-all duration-150"
      style={{
        background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
        color: active ? 'var(--color-prism-400)' : 'var(--color-text-secondary)',
        border: active ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
        width: 'calc(100% - 16px)',
      }}
    >
      <span className="text-base leading-none">{item.icon}</span>
      {item.label}
    </button>
  )
}

/**
 * BankerLayout — sidebar + top bar layout for banker routes.
 */
export default function BankerLayout() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-base)' }}>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col shrink-0"
        style={{
          width: 220,
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border-default)',
        }}
      >
        <PrismWordmark />

        {/* Nav */}
        <nav className="flex flex-col gap-1 py-4 flex-1">
          {NAV_ITEMS.map(item => <SidebarItem key={item.label} item={item} />)}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--color-border-default)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
            >
              SS
            </div>
            <div>
              <div className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>Suyog Sonawane</div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Relationship Manager</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/msme/dashboard')}
            className="w-full text-xs py-2 rounded-lg transition-all mb-2"
            style={{
              background: 'var(--color-elevated)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border-strong)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Switch to MSME Portal
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full text-xs py-2 rounded-lg transition-all"
            style={{
              background: 'var(--color-elevated)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-default)',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
