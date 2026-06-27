import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useUser } from '../lib/AuthContext'
import { CATEGORIES } from '../lib/constants'
import { ArrowLeft } from 'lucide-react'

export default function History() {
  const user = useUser()
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('training_logs')
      .select('*, sessions(title)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setLogs(data || []); setLoading(false) })
  }, [user])

  const filtered = filter === 'all' ? logs : logs.filter(l => l.category === filter)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link to="/" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <span className="font-semibold">Training History</span>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition ${filter === 'all' ? 'bg-[#c7171a] border-[#c7171a] text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition ${filter === cat.id ? 'text-white border-transparent' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
              style={filter === cat.id ? { background: cat.color, borderColor: cat.color } : {}}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-gray-600 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-600 py-16">No sessions recorded yet</div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(log => {
              const cat = CATEGORIES.find(c => c.id === log.category)
              return (
                <div key={log.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{log.sessions?.title ?? 'Untitled'}</span>
                    <span className="text-gray-500 text-sm">{new Date(log.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm mb-2" style={{ color: cat?.color }}>{cat?.label}</div>
                  {log.notes && <p className="text-gray-400 text-sm bg-gray-800 rounded-lg px-3 py-2 mt-2">{log.notes}</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
