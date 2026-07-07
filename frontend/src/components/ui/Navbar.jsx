import { useNavigate, useLocation } from 'react-router-dom'

function PrismLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="prism-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <polygon points="16,3 29,26 3,26" fill="none" stroke="url(#prism-grad)" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="16,9 24,23 8,23" fill="url(#prism-grad)" opacity="0.25" />
      <line x1="16" y1="9" x2="12" y2="23" stroke="#10B981" strokeWidth="1.5" opacity="0.8" />
      <line x1="16" y1="9" x2="20" y2="23" stroke="#F59E0B" strokeWidth="1.5" opacity="0.8" />
    </svg>
  )
}

export default function Navbar({ role = 'banker' }) {
  const navigate = useNavigate()
  const location = useLocation()

  const bankerLinks = [
    { label: 'Dashboard', path: '/banker/dashboard' },
    { label: '+ New Application', path: '/msme/application' },
    { label: 'Prism Connect', path: '/banker/connect' },
    { label: 'Payloads', path: '/banker/payload' },
    { label: 'Roadmap', path: '/banker/sandbox' },
  ]

  const msmeLinks = [
    { label: 'My Application', path: '/msme' },
    { label: '+ New Application', path: '/msme/application' },
  ]

  const links = role === 'banker' ? bankerLinks : msmeLinks
  const roleLabel = role === 'banker' ? 'Banker Portal' : 'MSME Portal'
  const roleBadgeColor = role === 'banker' ? '#6366F1' : '#10B981'

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,15,30,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-default)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '0 24px',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <PrismLogo size={28} />
          <div>
            <div style={{
              fontSize: 'var(--text-base)', fontWeight: 800,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}>
              Prism AI
            </div>
          </div>
        </button>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {links.map(link => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)', fontWeight: 500,
                color: location.pathname === link.path
                  ? 'var(--text-primary)'
                  : 'var(--text-secondary)',
                background: location.pathname === link.path
                  ? 'var(--bg-elevated)'
                  : 'transparent',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => {
                if (location.pathname !== link.path)
                  e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={e => {
                if (location.pathname !== link.path)
                  e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 12px',
            background: `${roleBadgeColor}15`,
            border: `1px solid ${roleBadgeColor}30`,
            borderRadius: 'var(--radius-full)',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: roleBadgeColor, boxShadow: `0 0 6px ${roleBadgeColor}` }} />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: roleBadgeColor }}>
              {roleLabel}
            </span>
          </div>
          <button
            onClick={() => navigate(role === 'banker' ? '/msme/dashboard' : '/banker/dashboard')}
            style={{
              background: 'var(--color-elevated)', border: '1px solid var(--color-border-strong)',
              borderRadius: 8, padding: '5px 11px', fontSize: 11, fontWeight: 700,
              color: 'var(--color-text-primary)', cursor: 'pointer',
              transition: 'border 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = roleBadgeColor}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border-strong)'}
          >
            Switch to {role === 'banker' ? 'MSME Portal' : 'Banker Portal'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary btn-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}
