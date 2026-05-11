import { Link } from 'react-router-dom'

const navItems = [
  {
    path: '/', label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    )
  },
  {
    path: '/historical', label: 'Historical Data',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
        <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>
      </svg>
    )
  },
  {
    path: '/buildings', label: 'Buildings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
        <rect x="3" y="9" width="13" height="12" rx="1"/><path d="M9 22V12h6v10"/><path d="M3 9l9-6 9 6"/>
      </svg>
    )
  },
  {
    path: '/alerts', label: 'Alerts',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    )
  },
  {
    path: '/settings', label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    )
  },
]

export default function Sidebar({ currentPath, mobile, onClose }) {
  return (
    <div className="h-full flex flex-col glass-dark" style={{ borderRight: '1px solid rgba(0,212,255,0.1)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center glow-blue flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#00d4ff,#0062ff)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} width={18} height={18}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <div>
          <div className="font-bold text-white text-base leading-tight" style={{ letterSpacing: '0.04em' }}>EnergyOS</div>
          <div className="text-xs font-medium" style={{ color: '#00d4ff', opacity: 0.7 }}>Smart Campus Monitor</div>
        </div>
        {mobile && (
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-white transition-colors p-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: '#475569' }}>Navigation</p>
        {navItems.map(({ path, label, icon }) => {
          const isActive = currentPath === path || (path === '/historical' && currentPath === '/filter')
          return (
            <Link key={path} to={path} onClick={mobile ? onClose : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 no-underline"
              style={isActive ? {
                background: 'rgba(0,212,255,0.1)',
                color: '#00d4ff',
                border: '1px solid rgba(0,212,255,0.25)',
                boxShadow: '0 0 16px rgba(0,212,255,0.1)',
              } : {
                color: '#94a3b8',
                border: '1px solid transparent',
              }}
            >
              <span style={isActive ? { color: '#00d4ff' } : { color: '#64748b' }}>{icon}</span>
              {label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#00d4ff' }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer user card */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: 'rgba(0,212,255,0.05)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
            AD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">Admin</div>
            <div className="text-xs truncate" style={{ color: '#64748b' }}>admin@campus.edu</div>
          </div>
          <span className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse-live" style={{ background: '#4ade80' }} />
        </div>
      </div>
    </div>
  )
}
