import { useEffect, useState } from 'react'

export default function Alerts() {
  const [energy, setEnergy] = useState([])
  const [filter, setFilter] = useState('all') // all | critical | resolved

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8080/energydata')
        const data = await res.json()
        setEnergy(Array.isArray(data) ? data : [])
      } catch (err) { console.error(err) }
    }
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  // Generate alerts from energy data
  const alerts = (energy || [])
    .filter(item => item.energyUsage > 60)
    .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
    .slice(0, 30)
    .map((item, i) => ({
      id: i,
      buildingId: item.buildingId,
      usage: item.energyUsage,
      time: item.timeStamp,
      severity: item.energyUsage > 80 ? 'critical' : 'warning',
      resolved: item.energyUsage <= 70,
    }))

  const filtered = filter === 'all' ? alerts
    : filter === 'critical' ? alerts.filter(a => a.severity === 'critical')
    : alerts.filter(a => a.resolved)

  const criticalCount = alerts.filter(a => a.severity === 'critical').length
  const warningCount = alerts.filter(a => a.severity === 'warning').length

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Alerts</h1>
          <p className="text-slate-500 text-sm mt-0.5">Energy consumption alerts and notifications</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> {criticalCount} Critical
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> {warningCount} Warning
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl w-fit border border-[#00d4ff10]">
        {[
          { key: 'all', label: 'All Alerts' },
          { key: 'critical', label: 'Critical' },
          { key: 'resolved', label: 'Resolved' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === tab.key
                ? 'bg-[#00d4ff15] text-[#00d4ff] border border-[#00d4ff30]'
                : 'text-slate-500 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 border border-[#00d4ff15] text-center animate-fade-up">
            <svg viewBox="0 0 24 24" fill="none" stroke="#4ade8040" strokeWidth="2" width="40" height="40" className="mx-auto mb-3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <p className="text-slate-500">No alerts to display</p>
          </div>
        ) : (
          filtered.map((alert, i) => (
            <div
              key={alert.id}
              className={`glass rounded-2xl p-4 border transition-all hover:border-opacity-50 animate-fade-up ${
                alert.severity === 'critical'
                  ? 'border-red-500/30 hover:bg-red-500/5'
                  : 'border-orange-500/20 hover:bg-orange-500/5'
              }`}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 mt-0.5 p-2 rounded-xl ${
                  alert.severity === 'critical' ? 'bg-red-500/15 text-red-400' : 'bg-orange-500/15 text-orange-400'
                }`}>
                  {alert.severity === 'critical' 
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-white font-semibold text-sm">
                      Building {alert.buildingId} — {alert.severity === 'critical' ? 'Critical' : 'Warning'} Alert
                    </h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                      alert.severity === 'critical'
                        ? 'text-red-400 bg-red-500/10 border-red-500/30'
                        : 'text-orange-400 bg-orange-500/10 border-orange-500/30'
                    }`}>
                      {Number(alert.usage).toFixed(1)} kWh
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    Energy consumption {alert.severity === 'critical' ? 'exceeded 80 kWh threshold' : 'exceeded 60 kWh warning level'}.
                    {alert.severity === 'critical' ? ' Immediate action required — check HVAC and industrial equipment.' : ' Monitor closely.'}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {new Date(alert.time).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      <span className="text-slate-600">Building {alert.buildingId}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
