import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CATEGORIES } from '../lib/constants'
import { useUser } from '../lib/AuthContext'
import { Plus, Dumbbell, ChevronRight } from 'lucide-react'

export default function Dashboard() {
  const user = useUser()
  const [stats, setStats] = useState({})
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: sessions }, { data: logs }] = await Promise.all([
        supabase.from('sessions').select('id, title, category, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('training_logs').select('category').eq('user_id', user.id),
      ])
      setRecent(sessions || [])
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

  const totalLogs = Object.values(stats).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#c7171a] flex items-center justify-center font-bold text-sm">FL</div>
          <span className="font-semibold text-lg">Fight Lab Trainer</span>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="text-gray-400 text-sm hover:text-white">Sign out</button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-400 uppercase text-xs font-semibold tracking-widest">Training overview</h2>
            <span className="text-gray-500 text-sm">{totalLogs} total sessions</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="text-2xl font-bold" style={{ color: cat.color }}>{stats[cat.id] ?? 0}</div>
                <div className="text-gray-400 text-sm mt-1">{cat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3 mb-8">
          <Link to="/builder" className="flex-1 bg-[#c7171a] hover:bg-red-700 text-white rounded-xl py-4 flex items-center justify-center gap-2 font-semibold transition">
            <Plus size={20} /> New Session
          </Link>
          <Link to="/history" className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-4 flex items-center justify-center gap-2 font-semibold border border-gray-800 transition">
            <Dumbbell size={20} /> History
          </Link>
        </div>

        {/* Recent sessions */}
        <div>
          <h2 className="text-gray-400 uppercase text-xs font-semibold tracking-widest mb-4">Recent sessions</h2>
          {loading ? (
            <div className="text-gray-600 text-sm">Loading...</div>
          ) : recent.length === 0 ? (
            <div className="bg-gray-900 rounded-xl p-6 text-center border border-gray-800">
              <p className="text-gray-500 mb-3">No sessions yet</p>
              <Link to="/builder" className="text-[#c7171a] hover:underline text-sm">Create your first session →</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recent.map(s => {
                const cat = CATEGORIES.find(c => c.id === s.category)
                return (
                  <Link key={s.id} to={`/session/${s.id}`} className="bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl px-4 py-4 flex items-center justify-between transition">
                    <div>
                      <div className="font-medium">{s.title}</div>
                      <div className="text-sm mt-0.5" style={{ color: cat?.color ?? '#888' }}>{cat?.label}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm">{new Date(s.created_at).toLocaleDateString()}</span>
                      <ChevronRight size={16} className="text-gray-600" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
