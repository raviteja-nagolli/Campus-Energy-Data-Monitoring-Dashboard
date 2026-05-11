import { useEffect, useState } from 'react'
import KPICard from '../components/KPICard'
import EnergyChart from '../components/EnergyChart'
import StatsCharts from '../components/StatsCharts'
import BuildingTable from '../components/BuildingTable'

const Icons = {
  Zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  TrendingUp: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Sun: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Gauge: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>,
  Leaf: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C10 14.5 12 15 15 15"/></svg>
}

export default function Home() {
  const [energy, setEnergy] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        const res = await fetch('http://localhost:8080/energydata')
        const data = await res.json()
        setEnergy(Array.isArray(data) ? data : [])
        setLastUpdated(new Date().toLocaleTimeString())
      } catch (err) {
        console.error(err)
      }
    }
    fetchEnergyData()
    const interval = setInterval(fetchEnergyData, 5000)
    return () => clearInterval(interval)
  }, [])

  // Build multi-line chart data
  const map = {}
  ;(energy || []).forEach(item => {
    const date = new Date(item.timeStamp)
    const timeKey = date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0') + ':' + String(date.getSeconds()).padStart(2, '0')
    if (!map[timeKey]) map[timeKey] = { timeStamp: timeKey }
    map[timeKey][`B${item.buildingId}`] = Number(item.energyUsage)
  })
  const multiLineData = Object.values(map)
  const MAX_POINTS = 20
  const trimmedData = multiLineData.slice(-MAX_POINTS)

  // Bar data
  const barDataMap = {}
  ;(energy || []).forEach(item => {
    barDataMap[item.buildingId] = item.energyUsage
  })
  const barData = Object.keys(barDataMap).map(id => ({
    building: `Building ${id}`,
    energy: barDataMap[id]
  }))

  // Pie data
  const getTimeKey = (t) => new Date(t).toISOString().slice(11, 19)
  const latestTime = energy.length ? getTimeKey(energy[energy.length - 1].timeStamp) : null
  const pieData = (energy || [])
    .filter(item => getTimeKey(item.timeStamp) === latestTime)
    .map(item => ({
      name: `Building ${item.buildingId}`,
      value: Number(item.energyUsage)
    }))

  // KPI calculations
  const totalConsumption = (energy || []).reduce((s, i) => s + Number(i.energyUsage), 0)
  const currentLoad = pieData.reduce((s, i) => s + i.value, 0)
  const peakUsage = energy.length ? Math.max(...energy.map(i => Number(i.energyUsage))) : 0
  const avgUsage = energy.length ? totalConsumption / energy.length : 0
  const efficiency = avgUsage > 0 ? Math.min(99, Math.max(40, 100 - (avgUsage - 30))).toFixed(1) : '—'
  const co2Saved = (totalConsumption * 0.012).toFixed(1)

  return (
    <div className="space-y-5">
      {/* Section label + refresh info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">Real-time campus energy analytics</p>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-live" />
            Refreshing every 5s · Updated {lastUpdated}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        <KPICard title="Total Consumption" value={totalConsumption.toFixed(1)} unit="kWh" icon={Icons.Zap} color="blue" trend="up" trendValue="+3.2%" delay={0} />
        <KPICard title="Current Load" value={currentLoad.toFixed(1)} unit="kWh" icon={Icons.Activity} color="cyan" trend="up" trendValue="+1.8%" delay={60} />
        <KPICard title="Peak Usage" value={peakUsage.toFixed(1)} unit="kWh" icon={Icons.TrendingUp} color="orange" trend="up" trendValue="+5.1%" delay={120} />
        <KPICard title="Solar Generation" value={(totalConsumption * 0.15).toFixed(1)} unit="kWh" icon={Icons.Sun} color="green" trend="down" trendValue="-2.4%" delay={180} />
        <KPICard title="Efficiency Score" value={efficiency} unit="%" icon={Icons.Gauge} color="purple" trend="flat" trendValue="" delay={240} />
        <KPICard title="CO₂ Saved" value={co2Saved} unit="tons" icon={Icons.Leaf} color="green" trend="down" trendValue="-8.3%" delay={300} />
      </div>

      {/* Energy Chart */}
      <EnergyChart data={trimmedData} />

      {/* Bar + Pie */}
      <StatsCharts barData={barData} pieData={pieData} />

      {/* Building Table */}
      <BuildingTable energy={energy} />
    </div>
  )
}

