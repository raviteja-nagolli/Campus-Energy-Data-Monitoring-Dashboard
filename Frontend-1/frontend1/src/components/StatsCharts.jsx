import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#00d4ff', '#00f5d4', '#a855f7', '#ff6b35', '#39ff14']

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark rounded-xl p-3 border border-[#00d4ff20] shadow-xl text-xs">
        <p className="text-[#00d4ff] font-semibold mb-1">{label}</p>
        <span className="text-white font-bold">{Number(payload[0].value).toFixed(2)} kWh</span>
      </div>
    )
  }
  return null
}

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark rounded-xl p-3 border border-[#00d4ff20] text-xs">
        <p className="text-white font-bold">{payload[0].name}</p>
        <p className="text-[#00d4ff]">{Number(payload[0].value).toFixed(2)} kWh</p>
      </div>
    )
  }
  return null
}

export default function StatsCharts({ barData, pieData }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Bar Chart */}
      <div className="glass rounded-2xl p-5 border border-[#00d4ff15] animate-fade-up" style={{ animationDelay: '500ms' }}>
        <h3 className="text-white font-semibold text-base mb-1">Total Usage by Building</h3>
        <p className="text-slate-500 text-xs mb-4">Cumulative kWh comparison</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00d4ff08" vertical={false} />
            <XAxis dataKey="building" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="energy" radius={[6, 6, 0, 0]}>
              {(barData || []).map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="glass rounded-2xl p-5 border border-[#00d4ff15] animate-fade-up" style={{ animationDelay: '550ms' }}>
        <h3 className="text-white font-semibold text-base mb-1">Current Load Distribution</h3>
        <p className="text-slate-500 text-xs mb-4">Real-time share per building</p>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={45}
              paddingAngle={3}
            >
              {(pieData || []).map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend
              formatter={(value) => (
                <span className="text-slate-400 text-xs">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

