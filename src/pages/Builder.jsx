import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useUser } from '../lib/AuthContext'
import { CATEGORIES, DEFAULT_SECTIONS } from '../lib/constants'
import { Plus, Trash2, ArrowLeft, GripVertical } from 'lucide-react'

function SectionBlock({ section, sectionIndex, onUpdate, onDelete }) {
  function addItem() {
    onUpdate(sectionIndex, { ...section, items: [...section.items, { text: '', notes: '' }] })
  }
  function updateItem(i, field, val) {
    const items = section.items.map((item, idx) => idx === i ? { ...item, [field]: val } : item)
    onUpdate(sectionIndex, { ...section, items })
  }
  function removeItem(i) {
    onUpdate(sectionIndex, { ...section, items: section.items.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
        <GripVertical size={16} className="text-gray-600" />
        <input
          value={section.title}
          onChange={e => onUpdate(sectionIndex, { ...section, title: e.target.value })}
          className="flex-1 bg-transparent text-white font-semibold outline-none placeholder:text-gray-600"
          placeholder="Section name"
        />
        <button onClick={() => onDelete(sectionIndex)} className="text-gray-600 hover:text-red-400 transition">
          <Trash2 size={16} />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {section.items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <div className="flex-1 flex flex-col gap-1">
              <input
                value={item.text}
                onChange={e => updateItem(i, 'text', e.target.value)}
                placeholder="Exercise / Technique"
                className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none border border-gray-700 focus:border-[#c7171a] placeholder:text-gray-600 w-full"
              />
              <input
                value={item.notes}
                onChange={e => updateItem(i, 'notes', e.target.value)}
                placeholder="Notes (optional)"
                className="bg-gray-800 text-gray-400 rounded-lg px-3 py-2 text-xs outline-none border border-gray-700 focus:border-gray-500 placeholder:text-gray-700 w-full"
              />
            </div>
            <button onClick={() => removeItem(i)} className="text-gray-700 hover:text-red-400 transition pt-1">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button onClick={addItem} className="flex items-center gap-1 text-[#c7171a] text-sm hover:text-red-400 transition mt-1">
          <Plus size={14} /> Add item
        </button>
      </div>
    </div>
  )
}

export default function Builder() {
  const user = useUser()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('bjj')
  const [sections, setSections] = useState(DEFAULT_SECTIONS.map(t => ({ title: t, items: [] })))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function updateSection(i, updated) {
    setSections(s => s.map((sec, idx) => idx === i ? updated : sec))
  }
  function deleteSection(i) {
    setSections(s => s.filter((_, idx) => idx !== i))
  }
  function addSection() {
    setSections(s => [...s, { title: 'New section', items: [] }])
  }

  async function save(andRun = false) {
    if (!title.trim()) { setError('Session needs a title'); return }
    setSaving(true)
    setError('')
    const { data, error: err } = await supabase.from('sessions').insert({
      user_id: user.id,
      title: title.trim(),
      category,
      sections,
    }).select().single()
    if (err) { setError(err.message); setSaving(false); return }
    if (andRun) {
      navigate(`/train/${data.id}`)
    } else {
      navigate(`/session/${data.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link to="/" className="text-gray-400 hover:text-white transition"><ArrowLeft size={20} /></Link>
        <span className="font-semibold flex-1">New Session</span>
        <button onClick={() => save(false)} disabled={saving} className="text-gray-400 hover:text-white text-sm transition disabled:opacity-50">Save</button>
        <button onClick={() => save(true)} disabled={saving} className="bg-[#c7171a] hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50">
          Save & Train
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
        {error && <div className="bg-red-900/30 border border-red-800 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>}

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Session title"
          className="bg-gray-900 border border-gray-800 text-white text-xl font-semibold rounded-xl px-4 py-4 outline-none focus:border-[#c7171a] placeholder:text-gray-700"
        />

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`rounded-xl py-3 px-3 text-sm font-medium border transition ${
                category === cat.id
                  ? 'border-[#c7171a] text-white bg-[#c7171a]/10'
                  : 'border-gray-800 text-gray-500 hover:border-gray-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {sections.map((sec, i) => (
          <SectionBlock key={i} section={sec} sectionIndex={i} onUpdate={updateSection} onDelete={deleteSection} />
        ))}

        <button onClick={addSection} className="flex items-center justify-center gap-2 border border-dashed border-gray-700 hover:border-gray-500 text-gray-500 hover:text-gray-300 rounded-xl py-4 transition">
          <Plus size={16} /> Add section
        </button>
      </div>
    </div>
  )
}
