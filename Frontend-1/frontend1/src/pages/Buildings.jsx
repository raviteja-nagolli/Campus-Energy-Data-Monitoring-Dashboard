import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'

const COLORS = ['#00d4ff', '#00f5d4', '#a855f7', '#ff6b35', '#39ff14']

function getStatus(usage) {
  if (usage > 80) return { label: 'Critical', dot: 'bg-red-400', border: 'border-red-500/30 bg-red-500/5' }
  if (usage > 60) return { label: 'High', dot: 'bg-orange-400', border: 'border-orange-500/30 bg-orange-500/5' }
  if (usage > 40) return { label: 'Normal', dot: 'bg-green-400', border: 'border-green-500/30 bg-green-500/5' }
  return { label: 'Low', dot: 'bg-blue-400', border: 'border-blue-500/30 bg-blue-500/5' }
}

export default function Buildings() {
  const [energy, setEnergy] = useState([])

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

  // Latest per building
  const latestMap = {}
  ;(energy || []).forEach(item => {
    const bid = item.buildingId
    if (!latestMap[bid] || new Date(item.timeStamp) > new Date(latestMap[bid].timeStamp)) {
      latestMap[bid] = item
    }
  })
  const buildings = Object.values(latestMap)

  // History per building
  const historyMap = {}
  ;(energy || []).forEach(item => {
    const bid = item.buildingId
    if (!historyMap[bid]) historyMap[bid] = []
    historyMap[bid].push({ time: new Date(item.timeStamp).toLocaleTimeString(), value: Number(item.energyUsage) })
  })

  // Bar chart data
  const barData = buildings.map(b => ({
    name: `Building ${b.buildingId}`,
    usage: Number(b.energyUsage)
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-dark rounded-xl p-3 border border-[#00d4ff20] text-xs">
          <p className="text-white font-bold">{payload[0].payload.name}</p>
          <p className="text-[#00d4ff]">{Number(payload[0].value).toFixed(2)} kWh</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Buildings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Per-building energy monitoring and comparison</p>
      </div>

      {/* Overview chart */}
      <div className="glass rounded-2xl p-5 border border-[#00d4ff15] animate-fade-up">
        <h3 className="text-white font-semibold text-base mb-4">Current Usage Comparison</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00d4ff08" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="usage" radius={[8, 8, 0, 0]}>
              {barData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Building Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {buildings.map((b, i) => {
          const status = getStatus(b.energyUsage)
          const eff = Math.max(0, Math.min(100, 100 - (b.energyUsage - 20))).toFixed(0)
          const effColor = eff >= 70 ? '#39ff14' : eff >= 40 ? '#ff6b35' : '#ef4444'

          return (
            <div
              key={b.buildingId}
              className="glass rounded-2xl p-5 border border-[#00d4ff15] hover:border-[#00d4ff30] transition-all animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-[#00d4ff20]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" width="18" height="18"><rect x="3" y="9" width="13" height="12" rx="1"/><path d="M9 22V12h6v10"/><path d="M3 9l9-6 9 6"/></svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Building {b.buildingId}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      <span className="text-xs text-slate-500">{status.label}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${status.border}`}>
                  {status.label}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    Current Usage
                  </div>
                  <span className="text-white font-bold tabular-nums">{Number(b.energyUsage).toFixed(2)} kWh</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400 text-xs flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                      Efficiency
                    </span>
                    <span className="text-xs font-semibold tabular-nums" style={{ color: effColor }}>{eff}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${eff}%`, background: effColor, boxShadow: `0 0 8px ${effColor}40` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#00d4ff08]">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {new Date(b.timeStamp).toLocaleTimeString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                    Live
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {buildings.length === 0 && (
        <div className="glass rounded-2xl p-12 border border-[#00d4ff15] text-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" width="40" height="40" className="mx-auto mb-3"><rect x="3" y="9" width="13" height="12" rx="1"/><path d="M9 22V12h6v10"/><path d="M3 9l9-6 9 6"/></svg>
          <p className="text-slate-500">Waiting for building data...</p>
        </div>
      )}
    </div>
  )
}

