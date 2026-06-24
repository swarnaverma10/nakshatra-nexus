import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import CosmicBackground from '../components/cosmic/CosmicBackground'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export default function VisitorProfileScreen() {
  const { visitorId } = useParams()
  const [visitor, setVisitor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!visitorId) { setError('Invalid profile link.'); setLoading(false); return }
    axios.get(`${BASE_URL}/visitors/${visitorId}/profile`)
      .then((res) => { setVisitor(res.data); setLoading(false) })
      .catch(() => { setError('Could not load cosmic profile.'); setLoading(false) })
  }, [visitorId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050010]">
      <CosmicBackground />
      <motion.p animate={{ opacity: [0.4,1,0.4] }} transition={{ duration: 2, repeat: Infinity }}
        className="text-purple-300 tracking-widest font-display text-sm z-10">
        LOADING COSMIC PROFILE...
      </motion.p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050010]">
      <CosmicBackground />
      <p className="text-pink-400 z-10 font-display tracking-widest">{error}</p>
    </div>
  )

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 bg-[#050010]">
      <CosmicBackground intensity={1.2} />
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">

        <motion.h1 initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
          className="font-display text-3xl text-yellow-400 tracking-[0.25em] text-center">
          COSMIC IDENTITY
        </motion.h1>

        {visitor.avatar_url && (
          <motion.img initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.2 }}
            src={visitor.avatar_url} alt="Cosmic Avatar"
            className="w-40 h-40 rounded-full border-2 border-yellow-400 object-cover shadow-[0_0_30px_rgba(250,204,21,0.3)]"
          />
        )}

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
          className="w-full rounded-2xl border border-purple-500/30 bg-black/40 backdrop-blur-md p-6 text-center">
          <p className="text-purple-300 text-xs tracking-[0.2em] uppercase mb-1">Cosmic Traveler</p>
          <p className="text-yellow-400 text-xl font-display tracking-widest">{visitor.full_name}</p>
          {visitor.archetype?.archetype && (
            <p className="text-pink-400 text-sm mt-2 tracking-wider">{visitor.archetype.archetype}</p>
          )}
        </motion.div>

        {visitor.archetype && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
            className="w-full rounded-2xl border border-purple-500/30 bg-black/40 backdrop-blur-md p-6">
            <p className="text-purple-300 text-xs tracking-[0.2em] uppercase mb-4 text-center">Cosmic Identity</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {visitor.zodiac?.sign && <div><p className="text-purple-400 text-xs">ZODIAC</p><p className="text-yellow-400">{visitor.zodiac.sign}</p></div>}
              {visitor.nakshatra?.nakshatra && <div><p className="text-purple-400 text-xs">NAKSHATRA</p><p className="text-yellow-400">{visitor.nakshatra.nakshatra}</p></div>}
              {visitor.aura?.color && <div><p className="text-purple-400 text-xs">AURA</p><p className="text-yellow-400">{visitor.aura.color}</p></div>}
              {visitor.spirit_animal?.animal && <div><p className="text-purple-400 text-xs">SPIRIT ANIMAL</p><p className="text-yellow-400">{visitor.spirit_animal.animal}</p></div>}
            </div>
          </motion.div>
        )}

        {visitor.passport_url && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            className="w-full">
            <p className="text-purple-300 text-xs tracking-[0.2em] uppercase mb-3 text-center">Cosmic Passport</p>
            <img src={visitor.passport_url} alt="Cosmic Passport"
              className="w-full rounded-2xl border border-purple-500/30" />
          </motion.div>
        )}

        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}
          className="text-purple-500 text-xs tracking-widest text-center font-display">
          NAKSHATRA NEXUS — WHERE ANCIENT WISDOM MEETS AI
        </motion.p>
      </div>
    </div>
  )
}
