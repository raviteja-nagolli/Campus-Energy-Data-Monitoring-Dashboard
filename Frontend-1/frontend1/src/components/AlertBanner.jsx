export default function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null
  const message = alerts
    .map(b => `Building ${b.buildingId} (${Number(b.energyUsage).toFixed(1)} kWh)`)
    .join(' · ')

  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 overflow-hidden glow-red"
      style={{
        background: 'rgba(239,68,68,0.08)',
        borderTop: '1px solid rgba(239,68,68,0.25)',
        borderBottom: '1px solid rgba(239,68,68,0.25)',
      }}>
      <div className="flex items-center gap-2 flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth={2} width={15} height={15}
          style={{ animation: 'pulse-live 1.5s ease-in-out infinite' }}>
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: '#f87171' }}>
          ⚡ High Consumption Alert
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-xs" style={{ color: 'rgba(252,165,165,0.75)' }}>
          {message} — Immediate action required. Check HVAC and industrial equipment.
        </div>
      </div>
    </div>
  )
}
