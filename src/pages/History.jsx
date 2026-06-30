import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useUser } from '../lib/AuthContext'
import { CATEGORIES } from '../lib/constants'
import Layout from '../components/Layout'

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
    <Layout>
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 sticky top-0 z-10">
        <span className="font-semibold text-white">Training History</span>
      </header>

      <div className="px-4 py-4">
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
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

        {loading ? (
          <div className="text-gray-700 text-sm py-8 text-center">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-700 py-16">No sessions recorded yet</div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(log => {
              const cat = CATEGORIES.find(c => c.id === log.category)
              return (
                <div key={log.id} className="flex bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="w-1 flex-shrink-0" style={{ background: cat?.color ?? '#444' }} />
                  <div className="flex-1 px-3.5 py-3">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-white text-sm font-medium">{log.sessions?.title ?? 'Untitled'}</span>
                      <span className="text-gray-700 text-xs">{new Date(log.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}</span>
                    </div>
                    <div className="text-xs font-medium mb-1" style={{ color: cat?.color }}>{cat?.label}</div>
                    {log.notes && <p className="text-gray-500 text-xs bg-gray-800 rounded-lg px-3 py-2 mt-1 whitespace-pre-line">{log.notes}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
