import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CATEGORIES } from '../lib/constants'
import { ArrowLeft, Play, Pencil, ExternalLink } from 'lucide-react'

export default function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.from('sessions').select('*').eq('id', id).single().then(({ data }) => setSession(data))
  }, [id])

  if (!session) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">Loading...</div>

  const cat = CATEGORIES.find(c => c.id === session.category)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></button>
        <span className="font-semibold flex-1">{session.title}</span>
        <Link to={`/builder/${id}`} className="text-gray-400 hover:text-white"><Pencil size={18} /></Link>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ background: `${cat?.color}22`, color: cat?.color }}>
            {cat?.label}
          </span>
          <span className="text-gray-500 text-sm">{new Date(session.created_at).toLocaleDateString()}</span>
        </div>

        {(session.sections || []).map((sec, i) => (
          <div key={i} className="mb-5">
            <h3 className="text-gray-400 uppercase text-xs tracking-widest font-semibold mb-3">{sec.title}</h3>
            <div className="flex flex-col gap-2">
              {sec.items?.length > 0 ? sec.items.map((item, j) => (
                <div key={j} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                  <p className="font-medium">{item.text}</p>
                  {item.notes && <p className="text-gray-500 text-sm mt-1">{item.notes}</p>}
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="" className="mt-2 rounded-lg max-h-40 object-cover w-full" onError={e => e.target.style.display='none'} />
                  )}
                  {item.videoUrl && (
                    <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-1.5 text-[#c7171a] text-sm hover:underline">
                      <ExternalLink size={13} /> Watch video
                    </a>
                  )}
                </div>
              )) : (
                <p className="text-gray-700 text-sm">No items</p>
              )}

            </div>
          </div>
        ))}

        <div className="sticky bottom-6 mt-8">
          <button
            onClick={() => navigate(`/train/${id}`)}
            className="w-full bg-[#c7171a] hover:bg-red-700 text-white font-bold py-5 rounded-2xl text-xl flex items-center justify-center gap-3 transition shadow-xl"
          >
            <Play size={24} fill="white" /> Start Training
          </button>
        </div>
      </div>
    </div>
  )
}
