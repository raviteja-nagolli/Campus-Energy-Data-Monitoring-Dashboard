import { useState, useEffect } from 'react'

export default function Header({ onMenuToggle }) {
  const [time, setTime] = useState(new Date())
  const [notifOpen, setNotifOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Spin the refresh icon occasionally
  useEffect(() => {
    const t = setInterval(() => {
      setRefreshing(true)
      setTimeout(() => setRefreshing(false), 900)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const formatted = time.toLocaleString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  return (
    <header className="flex-shrink-0 flex items-center justify-between gap-4 px-4 md:px-6 py-3 glass-dark"
      style={{ borderBottom: '1px solid rgba(0,212,255,0.08)', position: 'relative', zIndex: 10 }}>

      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={20} height={20}>
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div>
          <h2 className="text-white font-semibold text-base md:text-lg leading-tight">Energy Monitoring</h2>
          <p className="text-xs hidden sm:block" style={{ color: '#64748b' }}>{formatted}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Live badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse-live" style={{ background: '#4ade80' }} />
          <span className="text-xs font-bold" style={{ color: '#4ade80' }}>LIVE</span>
        </div>

        {/* Refresh icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff44" strokeWidth={2} width={14} height={14}
          className="hidden md:block"
          style={{ transform: refreshing ? 'rotate(360deg)' : 'rotate(0deg)', transition: 'transform 0.9s linear' }}>
          <polyline points="23 4 23 10 17 10"/>
          <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
        </svg>

        {/* Notification bell */}
        <div className="relative">
          <button onClick={() => setNotifOpen(o => !o)}
            className="relative p-2 rounded-xl glass hover:border-opacity-50 transition-all">
            <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth={2} width={18} height={18}>
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-72 glass-dark rounded-xl shadow-2xl p-3 z-50"
              style={{ border: '1px solid rgba(0,212,255,0.2)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748b' }}>Notifications</p>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <p className="text-xs font-semibold" style={{ color: '#f87171' }}>High Energy Alert</p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Building exceeded 80 kWh threshold</p>
                </div>
                <div className="p-2.5 rounded-lg" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
                  <p className="text-xs font-semibold" style={{ color: '#00d4ff' }}>System</p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Data auto-refreshing every 5s</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer select-none"
          style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
          AD
        </div>
      </div>
    </header>
  )
}
