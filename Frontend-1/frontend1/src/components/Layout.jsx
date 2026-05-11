import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import AlertBanner from './AlertBanner'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const location = useLocation()

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('http://localhost:8080/energydata')
        const data = await res.json()
        if (Array.isArray(data)) {
          setAlerts(data.filter(item => item.energyUsage > 80))
        }
      } catch (_) {}
    }
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden grid-bg" style={{ background: '#020817' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block flex-shrink-0 w-64">
        <Sidebar currentPath={location.pathname} />
      </div>

      {/* Mobile sidebar drawer */}
      <div
        className={`sidebar-drawer fixed top-0 left-0 h-full w-64 z-30 lg:hidden ${sidebarOpen ? 'open' : 'closed'}`}
      >
        <Sidebar currentPath={location.pathname} onClose={() => setSidebarOpen(false)} mobile />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(s => !s)} />
        {alerts.length > 0 && <AlertBanner alerts={alerts} />}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
