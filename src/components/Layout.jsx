import { Link, useLocation } from 'react-router-dom'
import { Home, Plus, History } from 'lucide-react'

export default function Layout({ children }) {
  const { pathname } = useLocation()

  const tabs = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/builder', icon: Plus, label: 'New' },
    { to: '/history', icon: History, label: 'History' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
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
