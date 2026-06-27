import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useUser } from '../lib/AuthContext'
import { CATEGORIES } from '../lib/constants'
import { ChevronLeft, ChevronRight, CheckCircle2, X } from 'lucide-react'

export default function TrainingMode() {
  const { id } = useParams()
  const user = useUser()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [sectionIdx, setSectionIdx] = useState(0)
  const [done, setDone] = useState(false)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('sessions').select('*').eq('id', id).single().then(({ data }) => setSession(data))
  }, [id])

  if (!session) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">Loading...</div>
  }

  const sections = session.sections || []
  const current = sections[sectionIdx]
  const cat = CATEGORIES.find(c => c.id === session.category)
  const isLast = sectionIdx === sections.length - 1

  async function finishSession() {
    setSaving(true)
    await supabase.from('training_logs').insert({
      user_id: user.id,
      session_id: session.id,
      category: session.category,
      notes: notes.trim(),
    })
    setSaving(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 px-6">
        <CheckCircle2 size={64} className="text-green-500" />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Session Complete!</h1>
          <p className="text-gray-400">{session.title}</p>
        </div>
        <button onClick={() => navigate('/')} className="bg-[#c7171a] text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-red-700 transition">
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <button onClick={() => navigate(`/session/${id}`)} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <div className="text-sm font-medium text-gray-300">{session.title}</div>
        <div className="text-sm text-gray-500">{sectionIdx + 1} / {sections.length}</div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-800">
        <div
          className="h-1 transition-all duration-500"
          style={{ width: `${((sectionIdx + 1) / sections.length) * 100}%`, background: cat?.color ?? '#c7171a' }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 py-8 max-w-xl mx-auto w-full">
        <div className="mb-2 text-xs uppercase tracking-widest font-semibold" style={{ color: cat?.color ?? '#c7171a' }}>
          {cat?.label}
        </div>
        <h1 className="text-3xl font-bold mb-8">{current?.title}</h1>

        {current?.items?.length > 0 ? (
          <div className="flex flex-col gap-4 flex-1">
            {current.items.map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4">
                <p className="text-xl font-semibold">{item.text}</p>
                {item.notes && <p className="text-gray-400 text-sm mt-2">{item.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600 text-lg">
            No items in this section
          </div>
        )}

        {/* Notes (last section only) */}
        {isLast && (
          <div className="mt-6">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Session notes / improvements..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 outline-none focus:border-gray-600 resize-none text-sm"
              rows={3}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8 pt-4 flex gap-3 max-w-xl mx-auto w-full">
        <button
          onClick={() => setSectionIdx(i => i - 1)}
          disabled={sectionIdx === 0}
          className="flex items-center gap-2 bg-gray-900 border border-gray-800 text-white rounded-xl py-4 px-5 font-semibold disabled:opacity-30 hover:bg-gray-800 transition"
        >
          <ChevronLeft size={20} />
        </button>

        {isLast ? (
          <button
            onClick={finishSession}
            disabled={saving}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-4 font-bold text-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <CheckCircle2 size={22} /> {saving ? 'Saving...' : 'Finish Session'}
          </button>
        ) : (
          <button
            onClick={() => setSectionIdx(i => i + 1)}
            className="flex-1 bg-[#c7171a] hover:bg-red-700 text-white rounded-xl py-4 font-bold text-lg flex items-center justify-center gap-2 transition"
          >
            Next <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
