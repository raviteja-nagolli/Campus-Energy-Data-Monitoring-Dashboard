import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'

export default function HistoricalData() {
  const [energy, setEnergy] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [buildingId, setBuildingId] = useState('')
  const [loading, setLoading] = useState(false)

  const formatDate = (date) => date ? date + ':00' : ''

  const fetchEnergyData = async () => {
    try {
      setLoading(true)
      let url = 'http://localhost:8080/energydata'
      if (startDate && endDate && buildingId) {
        url = `http://localhost:8080/energydata/filter?start=${formatDate(startDate)}&end=${formatDate(endDate)}&buildingId=${buildingId}`
      } else if (startDate && endDate) {
        url = `http://localhost:8080/energydata/filter/date?start=${formatDate(startDate)}&end=${formatDate(endDate)}`
      } else if (buildingId) {
        url = `http://localhost:8080/energydata/filter/buildingId/${buildingId}`
      }
      const res = await fetch(url)
      const data = await res.json()
      setEnergy(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEnergyData() }, [])

  // Build chart data from filtered results
  const map = {}
  ;(energy || []).forEach(item => {
    const date = new Date(item.timeStamp)
    const timeKey = date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0') + ':' + String(date.getSeconds()).padStart(2, '0')
    if (!map[timeKey]) map[timeKey] = { timeStamp: timeKey }
    map[timeKey][`B${item.buildingId}`] = Number(item.energyUsage)
  })
  const chartData = Object.values(map).slice(-30)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-dark rounded-xl p-3 border border-[#00d4ff20] text-xs">
          <p className="text-[#00d4ff] font-semibold mb-1">{label}</p>
          {payload.map((p, i) => (
            <div key={i} className="flex items-center gap-2 py-0.5">
              <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <span className="text-slate-400">{p.name}:</span>
              <span className="text-white font-semibold">{Number(p.value).toFixed(2)} kWh</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Historical Data</h1>
        <p className="text-slate-500 text-sm mt-0.5">Filter and analyze past energy consumption</p>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-5 border border-[#00d4ff15] animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" width="16" height="16"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <h3 className="text-white font-semibold text-sm">Filters</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11" className="inline mr-1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Start Time
            </label>
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 bg-white/5 border border-[#00d4ff15] rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00d4ff50] transition-colors [color-scheme:dark]"
              />
              {startDate && (
                <button onClick={() => setStartDate('')} className="px-2 py-1 rounded-lg text-xs text-slate-500 hover:text-red-400 bg-white/5 hover:bg-red-500/10 transition-colors">✕</button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11" className="inline mr-1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>End Time
            </label>
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 bg-white/5 border border-[#00d4ff15] rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00d4ff50] transition-colors [color-scheme:dark]"
              />
              {endDate && (
                <button onClick={() => setEndDate('')} className="px-2 py-1 rounded-lg text-xs text-slate-500 hover:text-red-400 bg-white/5 hover:bg-red-500/10 transition-colors">✕</button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1.5 font-medium">Building</label>
            <select
              value={buildingId}
              onChange={(e) => setBuildingId(e.target.value)}
              className="w-full bg-white/5 border border-[#00d4ff15] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00d4ff50] transition-colors [color-scheme:dark] appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#0a1628]">All Buildings</option>
              <option value="1" className="bg-[#0a1628]">Building 1</option>
              <option value="2" className="bg-[#0a1628]">Building 2</option>
              <option value="3" className="bg-[#0a1628]">Building 3</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchEnergyData}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm rounded-xl px-4 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              {loading ? 'Searching...' : 'Apply Filters'}
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="glass rounded-2xl p-5 border border-[#00d4ff15] animate-fade-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-white font-semibold text-base mb-4">Filtered Results Chart</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00d4ff08" vertical={false} />
              <XAxis dataKey="timeStamp" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>} />
              <Line type="monotone" dataKey="B1" name="Building 1" stroke="#00d4ff" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="B2" name="Building 2" stroke="#00f5d4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="B3" name="Building 3" stroke="#a855f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      <div className="glass rounded-2xl border border-[#00d4ff15] overflow-hidden animate-fade-up" style={{ animationDelay: '300ms' }}>
        <div className="px-5 py-4 border-b border-[#00d4ff10] flex items-center justify-between">
          <h3 className="text-white font-semibold text-base">Results</h3>
          <span className="text-xs text-slate-500 bg-white/5 px-2.5 py-1 rounded-lg">
            {energy.length} records
          </span>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#0a1628]">
              <tr className="border-b border-[#00d4ff08]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Building</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usage (kWh)</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {energy.length === 0 ? (
                <tr><td colSpan={3} className="px-5 py-8 text-center text-slate-600 text-sm">No data found</td></tr>
              ) : (
                energy.map((item, index) => (
                  <tr key={index} className={`border-b border-[#00d4ff05] hover:bg-[#00d4ff05] transition-colors ${item.energyUsage > 80 ? 'bg-red-500/5' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#00d4ff15] flex items-center justify-center text-[#00d4ff] text-xs font-bold">{item.buildingId}</div>
                        <span className="text-white text-sm">Building {item.buildingId}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-sm font-semibold tabular-nums ${item.energyUsage > 80 ? 'text-red-400' : 'text-white'}`}>
                        {Number(item.energyUsage).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {new Date(item.timeStamp).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

