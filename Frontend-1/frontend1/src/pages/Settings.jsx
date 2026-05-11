import { useState } from 'react'

export default function Settings() {
  const [threshold, setThreshold] = useState(80)
  const [refreshRate, setRefreshRate] = useState(5)
  const [notifications, setNotifications] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    setThreshold(80)
    setRefreshRate(5)
    setNotifications(true)
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Configure dashboard preferences and alert thresholds</p>
      </div>

      {/* Alert Threshold */}
      <div className="glass rounded-2xl p-5 border border-[#00d4ff15] animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" width="16" height="16"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <h3 className="text-white font-semibold text-sm">Alert Threshold</h3>
        </div>
        <p className="text-slate-500 text-xs mb-4">Set the kWh threshold for triggering high-consumption alerts.</p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="30"
            max="150"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="flex-1 accent-[#00d4ff] h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00d4ff] [&::-webkit-slider-thumb]:shadow-[0_0_10px_#00d4ff80]"
          />
          <div className="flex items-center gap-1 bg-white/5 border border-[#00d4ff15] rounded-xl px-3 py-1.5 min-w-[80px] justify-center">
            <span className="text-white font-bold tabular-nums">{threshold}</span>
            <span className="text-slate-500 text-xs">kWh</span>
          </div>
        </div>
      </div>

      {/* Refresh Rate */}
      <div className="glass rounded-2xl p-5 border border-[#00d4ff15] animate-fade-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="#00f5d4" strokeWidth="2" width="16" height="16"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          <h3 className="text-white font-semibold text-sm">Refresh Rate</h3>
        </div>
        <p className="text-slate-500 text-xs mb-4">How frequently the dashboard auto-refreshes data.</p>
        <div className="flex gap-2 flex-wrap">
          {[2, 5, 10, 15, 30].map(sec => (
            <button
              key={sec}
              onClick={() => setRefreshRate(sec)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                refreshRate === sec
                  ? 'bg-[#00d4ff15] text-[#00d4ff] border-[#00d4ff30] glow-blue'
                  : 'text-slate-500 border-white/5 hover:text-white hover:border-white/15 bg-white/5'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="glass rounded-2xl p-5 border border-[#00d4ff15] animate-fade-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/15">
              <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" width="16" height="16"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Push Notifications</h3>
              <p className="text-slate-500 text-xs mt-0.5">Receive alerts when thresholds are breached</p>
            </div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
              notifications ? 'bg-[#00d4ff]' : 'bg-white/15'
            }`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
              notifications ? 'left-[22px]' : 'left-0.5'
            }`} />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 animate-fade-up" style={{ animationDelay: '300ms' }}>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm rounded-xl px-6 py-2.5 hover:opacity-90 transition-opacity"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 glass border border-[#00d4ff15] text-slate-400 hover:text-white font-semibold text-sm rounded-xl px-6 py-2.5 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          Reset
        </button>
      </div>
    </div>
  )
}

