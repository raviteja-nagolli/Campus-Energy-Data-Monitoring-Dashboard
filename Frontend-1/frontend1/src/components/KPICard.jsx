const colorConfig = {
  blue: { glow: '0 0 24px rgba(0,212,255,0.2)', border: 'rgba(0,212,255,0.25)', icon: 'rgba(0,212,255,0.12)', text: '#00d4ff', line: '#00d4ff' },
  cyan: { glow: '0 0 24px rgba(0,245,212,0.2)', border: 'rgba(0,245,212,0.25)', icon: 'rgba(0,245,212,0.12)', text: '#00f5d4', line: '#00f5d4' },
  green: { glow: '0 0 24px rgba(74,222,128,0.2)', border: 'rgba(74,222,128,0.25)', icon: 'rgba(74,222,128,0.12)', text: '#4ade80', line: '#4ade80' },
  purple: { glow: '0 0 24px rgba(168,85,247,0.2)', border: 'rgba(168,85,247,0.25)', icon: 'rgba(168,85,247,0.12)', text: '#a855f7', line: '#a855f7' },
  orange: { glow: '0 0 24px rgba(251,146,60,0.2)', border: 'rgba(251,146,60,0.25)', icon: 'rgba(251,146,60,0.12)', text: '#fb923c', line: '#fb923c' },
  red: { glow: '0 0 24px rgba(239,68,68,0.2)', border: 'rgba(239,68,68,0.25)', icon: 'rgba(239,68,68,0.12)', text: '#f87171', line: '#f87171' },
}

const TrendUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={12} height={12}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
)
const TrendDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={12} height={12}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
  </svg>
)

export default function KPICard({ title, value, unit, trend, trendValue, icon, color = 'blue', delay = 0 }) {
  const c = colorConfig[color] || colorConfig.blue
  const trendColor = trend === 'up' ? '#f87171' : trend === 'down' ? '#4ade80' : '#64748b'

  return (
    <div
      className="glass rounded-2xl p-5 transition-all duration-300 cursor-default animate-fade-up"
      style={{
        border: `1px solid ${c.border}`,
        boxShadow: c.glow,
        animationDelay: `${delay}ms`,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-xl" style={{ background: c.icon, color: c.text }}>
          {icon}
        </div>
        {trendValue && (
          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: trendColor }}>
            {trend === 'up' ? <TrendUp /> : trend === 'down' ? <TrendDown /> : <span>—</span>}
            {trendValue}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end gap-1 mt-1">
        <span className="text-2xl font-bold text-white tabular-nums">{value}</span>
        {unit && <span className="text-sm mb-0.5" style={{ color: '#64748b' }}>{unit}</span>}
      </div>
      <p className="text-xs mt-1 font-medium" style={{ color: '#94a3b8' }}>{title}</p>

      {/* Bottom line */}
      <div className="mt-3 h-px w-full rounded-full" style={{
        background: `linear-gradient(to right, transparent, ${c.line}, transparent)`,
        opacity: 0.4,
      }} />
    </div>
  )
}
