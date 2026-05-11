import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import HistoricalData from './pages/HistoricalData'
import Buildings from './pages/Buildings'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/historical" element={<HistoricalData />} />
        <Route path="/buildings" element={<Buildings />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
        {/* Legacy route */}
        <Route path="/filter" element={<HistoricalData />} />
      </Routes>
    </Layout>
  )
}