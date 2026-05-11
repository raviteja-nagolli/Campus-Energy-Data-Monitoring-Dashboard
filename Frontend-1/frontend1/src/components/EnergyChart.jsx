import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark rounded-xl p-3 border border-[#00d4ff20] shadow-xl text-xs">
        <p className="text-[#00d4ff] font-semibold mb-2">{label}</p>
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

export default function EnergyChart({ data }) {
  const buildings = data && data.length > 0
    ? Object.keys(data[0]).filter(k => k !== 'timeStamp')
    : []

  const colorMap = {
    B1: { stroke: '#00d4ff', fill: 'url(#gradB1)' },
    B2: { stroke: '#00f5d4', fill: 'url(#gradB2)' },
    B3: { stroke: '#a855f7', fill: 'url(#gradB3)' },
  }

  const defaultColors = ['#00d4ff', '#00f5d4', '#a855f7', '#ff6b35', '#39ff14']

  return (
    <div className="glass rounded-2xl p-5 border border-[#00d4ff15] animate-fade-up" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-semibold text-base">Real-time Energy Consumption</h3>
          <p className="text-slate-500 text-xs mt-0.5">Live per-building usage (kWh) — last 20 readings</p>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#00d4ff10] border border-[#00d4ff20]">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-live" />
          <span className="text-green-400 text-xs font-semibold">LIVE</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            {buildings.map((b, i) => {
              const color = colorMap[b]?.stroke || defaultColors[i % defaultColors.length]
              return (
                <linearGradient key={b} id={`grad${b}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              )
            })}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#00d4ff08" vertical={false} />
          <XAxis
            dataKey="timeStamp"
            tick={{ fill: '#475569', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#475569', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-slate-400 text-xs">{value}</span>
            )}
          />
          <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Threshold', fill: '#ef4444', fontSize: 10 }} />

          {buildings.map((b, i) => {
            const color = colorMap[b]?.stroke || defaultColors[i % defaultColors.length]
            return (
              <Area
                key={b}
                type="monotone"
                dataKey={b}
                name={`Building ${b.replace('B', '')}`}
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad${b})`}
                dot={false}
                activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              />
            )
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

