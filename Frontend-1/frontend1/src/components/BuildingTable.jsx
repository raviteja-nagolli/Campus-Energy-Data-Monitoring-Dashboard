import { useState } from 'react'

function getStatus(usage) {
  if (usage > 80) return { label: 'Critical', color: 'text-red-400 bg-red-500/10 border-red-500/30' }
  if (usage > 60) return { label: 'High', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' }
  if (usage > 40) return { label: 'Normal', color: 'text-green-400 bg-green-500/10 border-green-500/30' }
  return { label: 'Low', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' }
}

function getEfficiency(usage) {
  const pct = Math.max(0, Math.min(100, 100 - (usage - 20)))
  return pct.toFixed(0)
}

const efficiencyBar = (pct) => {
  const color = pct >= 70 ? '#39ff14' : pct >= 40 ? '#ff6b35' : '#ef4444'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}60` }}
        />
      </div>
      <span className="text-xs text-slate-400 tabular-nums w-8">{pct}%</span>
    </div>
  )
}

export default function BuildingTable({ energy }) {
  const [sortField, setSortField] = useState('buildingId')
  const [sortDir, setSortDir] = useState('asc')

  // Get latest reading per building
  const latestMap = {}
  ;(energy || []).forEach(item => {
    const bid = item.buildingId
    if (!latestMap[bid] || new Date(item.timeStamp) > new Date(latestMap[bid].timeStamp)) {
      latestMap[bid] = item
    }
  })

  let rows = Object.values(latestMap)

  rows.sort((a, b) => {
    let av = sortField === 'buildingId' ? a.buildingId : sortField === 'energyUsage' ? a.energyUsage : a.timeStamp
    let bv = sortField === 'buildingId' ? b.buildingId : sortField === 'energyUsage' ? b.energyUsage : b.timeStamp
    return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
  })

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <svg viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" width="12" height="12"><polyline points="7 15 12 20 17 15"/><polyline points="7 9 12 4 17 9"/></svg>
    return sortDir === 'asc' 
      ? <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" width="12" height="12"><polyline points="18 15 12 9 6 15"/></svg>
      : <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" width="12" height="12"><polyline points="6 9 12 15 18 9"/></svg>
  }

  return (
    <div className="glass rounded-2xl border border-[#00d4ff15] overflow-hidden animate-fade-up" style={{ animationDelay: '600ms' }}>
      <div className="px-5 py-4 border-b border-[#00d4ff10] flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-base">Building Status</h3>
          <p className="text-slate-500 text-xs mt-0.5">Latest readings per building</p>
        </div>
        <span className="text-xs text-slate-500 bg-white/5 px-2.5 py-1 rounded-lg">
          {rows.length} buildings
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#00d4ff08]">
              {[
                { field: 'buildingId', label: 'Building' },
                { field: 'energyUsage', label: 'Usage (kWh)' },
                { field: null, label: 'Status' },
                { field: null, label: 'Efficiency' },
                { field: 'timeStamp', label: 'Last Updated' },
              ].map(({ field, label }) => (
                <th
                  key={label}
                  onClick={() => field && toggleSort(field)}
                  className={`text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${field ? 'cursor-pointer hover:text-slate-300 select-none' : ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    {label}
                    {field && <SortIcon field={field} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-600 text-sm">
                  Waiting for data...
                </td>
              </tr>
            ) : (
              rows.map((item, i) => {
                const status = getStatus(item.energyUsage)
                const eff = getEfficiency(item.energyUsage)
                return (
                  <tr
                    key={item.buildingId}
                    className="border-b border-[#00d4ff05] hover:bg-[#00d4ff05] transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#00d4ff15] flex items-center justify-center text-[#00d4ff] text-xs font-bold">
                          {item.buildingId}
                        </div>
                        <span className="text-white text-sm font-medium">Building {item.buildingId}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-white font-semibold tabular-nums">
                        {Number(item.energyUsage).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 min-w-32">
                      {efficiencyBar(Number(eff))}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {new Date(item.timeStamp).toLocaleTimeString()}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

