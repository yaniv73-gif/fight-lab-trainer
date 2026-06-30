import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CATEGORIES } from '../lib/constants'
import { useUser } from '../lib/AuthContext'
import { ChevronRight, LogOut } from 'lucide-react'
import Layout from '../components/Layout'

export default function Dashboard() {
  const user = useUser()
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [sessions, setSessions] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: sessionData }, { data: logs }] = await Promise.all([
        supabase.from('sessions').select('id, title, category, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('training_logs').select('category').eq('user_id', user.id),
      ])
      setSessions(sessionData || [])
      const counts = {}
      for (const cat of CATEGORIES) counts[cat.id] = 0
      for (const log of logs || []) {
        if (counts[log.category] !== undefined) counts[log.category]++
      }
      setStats(counts)
      setLoading(false)
    }
    load()
  }, [user])

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.category === filter)
  const totalLogs = Object.values(stats).reduce((a, b) => a + b, 0)

  return (
    <Layout>
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#c7171a] flex items-center justify-center font-bold text-sm text-white">FL</div>
          <span className="font-semibold text-white text-base">Fight Lab</span>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="text-gray-600 hover:text-gray-400 transition">
          <LogOut size={18} />
        </button>
      </header>

      <div className="px-4 pt-4">
        {/* Stats pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-full px-3 py-1.5 whitespace-nowrap flex-shrink-0">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
              <span className="text-gray-400 text-xs">{cat.label.split(' /')[0].split(' No')[0]}</span>
              <span className="text-white text-xs font-semibold">{stats[cat.id] ?? 0}</span>
            </div>
          ))}
        </div>

        {/* New session button */}
        <Link to="/builder" className="flex items-center justify-center gap-2 bg-[#c7171a] hover:bg-red-700 text-white font-bold rounded-xl py-4 text-base w-full mb-5 transition">
          + New Session
        </Link>

        {/* Sessions header */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-gray-600 text-xs font-semibold uppercase tracking-widest">Sessions</span>
          <span className="text-gray-600 text-xs">{sessions.length} total</span>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition flex-shrink-0 ${filter === 'all' ? 'border-[#c7171a] text-[#c7171a] bg-[#c7171a]/10' : 'border-gray-800 text-gray-600'}`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition flex-shrink-0"
              style={filter === cat.id
                ? { borderColor: cat.color, color: cat.color, background: `${cat.color}18` }
                : { borderColor: '#2a2a2a', color: '#555' }
              }
            >
              {cat.label.split(' /')[0]}
            </button>
          ))}
        </div>

        {/* Session list */}
        {loading ? (
          <div className="text-gray-700 text-sm py-8 text-center">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-700 mb-2">No sessions yet</p>
            <Link to="/builder" className="text-[#c7171a] text-sm">Create your first session →</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(s => {
              const cat = CATEGORIES.find(c => c.id === s.category)
              return (
                <Link key={s.id} to={`/session/${s.id}`} className="flex bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition">
                  <div className="w-1 flex-shrink-0" style={{ background: cat?.color ?? '#444' }} />
                  <div className="flex-1 flex items-center justify-between px-3.5 py-3">
                    <div>
                      <div className="text-white text-sm font-medium">{s.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-medium" style={{ color: cat?.color ?? '#888' }}>{cat?.label}</span>
                        <span className="text-gray-700 text-xs">{new Date(s.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-700" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
