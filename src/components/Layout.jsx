import { Link, useLocation } from 'react-router-dom'
import { Home, Plus, History, Download } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const [installPrompt, setInstallPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setInstallPrompt(null)
  }

  const tabs = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/builder', icon: Plus, label: 'New' },
    { to: '/history', icon: History, label: 'History' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      {installPrompt && !installed && (
        <div className="bg-[#c7171a] px-4 py-3 flex items-center justify-between">
          <span className="text-white text-sm font-medium">Install as app on your phone</span>
          <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 bg-white text-[#c7171a] text-sm font-bold px-3 py-1.5 rounded-lg"
          >
            <Download size={14} /> Install
          </button>
        </div>
      )}
      <div className="flex-1 pb-20">{children}</div>
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex z-50">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = pathname === to
          return (
            <Link key={to} to={to} className="flex-1 flex flex-col items-center justify-center gap-1 py-3">
              <Icon size={22} color={active ? '#c7171a' : '#555'} />
              <span className="text-[10px] font-medium" style={{ color: active ? '#c7171a' : '#555' }}>{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
