import { HashRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { LeverPage } from './pages/LeverPage'
import { PendulumPage } from './pages/PendulumPage'

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-lab-bg">
        <NavBar />
        <Routes>
          <Route path="/" element={<LeverPage />} />
          <Route path="/bandul" element={<PendulumPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <footer className="pb-8 text-center text-xs text-slate-400">
          Eksperimen fisika interaktif — tuas & bandul. Nilai percobaan tersimpan otomatis di
          browser ini.
        </footer>
      </div>
    </HashRouter>
  )
}

function NavBar() {
  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-lab-accent text-white shadow-sm'
        : 'text-lab-muted hover:bg-slate-100 hover:text-lab-ink'
    }`

  return (
    <nav className="sticky top-0 z-10 border-b border-lab-line bg-lab-surface/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
        <span className="text-sm font-extrabold tracking-tight text-lab-ink">
          🧪 Lab Fisika Interaktif
        </span>
        <div className="flex items-center gap-1.5">
          <NavLink to="/" end className={tabClass}>
            Tuas
          </NavLink>
          <NavLink to="/bandul" className={tabClass}>
            Bandul
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
