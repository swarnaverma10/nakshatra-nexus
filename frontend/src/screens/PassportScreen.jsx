import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useVisitorStore from '../store/useVisitorStore'
import { generatePassport, generateQR } from '../services/api'
import FloatingOrb from '../components/ui/FloatingOrb'

export default function PassportScreen() {
  const navigate = useNavigate()
  const {
    visitorId, visitor, astrology, aura, archetype, spiritAnimal,
    avatarUrl, passportUrl, qrUrl, setPassportUrl, setQrUrl,
  } = useVisitorStore()

  const [loading, setLoading] = useState(!passportUrl)
  const [fullscreen, setFullscreen] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const passportId = visitorId ? `NK-${visitorId.slice(-8).toUpperCase()}` : 'NK-NEXUS'

  useEffect(() => {
    if (!passportUrl && visitorId) {
      Promise.all([generatePassport(visitorId), generateQR(visitorId)])
        .then(([p, q]) => {
          setPassportUrl(p.data.passport_url)
          setQrUrl(q.data.qr_url)
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false)
          setTimeout(() => setRevealed(true), 300)
        })
    } else {
      setLoading(false)
      setTimeout(() => setRevealed(true), 300)
    }
  }, [])

  const rows = [
    { label: 'Zodiac',        value: astrology?.zodiac?.sign,         icon: '☀️' },
    { label: 'Nakshatra',     value: astrology?.nakshatra?.nakshatra, icon: '🌙' },
    { label: 'Aura',          value: aura?.color,                     icon: '✨' },
    { label: 'Spirit Animal', value: spiritAnimal?.animal,            icon: '🦅' },
    { label: 'Archetype',     value: archetype?.archetype,            icon: '⚡' },
  ].filter(r => r.value)

  if (loading) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050010]">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="text-5xl mb-4 text-yellow-400">✦</motion.div>
      <p className="text-purple-300 text-sm tracking-widest font-display">COMPILING COSMIC COLLECTIBLE...</p>
    </div>
  )

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#050010] text-white">
      {/* Stars backdrop */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full bg-yellow-300"
            style={{ width: Math.random() * 2 + 0.5, height: Math.random() * 2 + 0.5, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.1, 0.7, 0.1] }}
            transition={{ duration: Math.random() * 3 + 2, delay: Math.random() * 3, repeat: Infinity }} />
        ))}
      </div>

      <FloatingOrb color="#7c3aed" size={450} blur={130} className="-top-20 -left-20 opacity-40 pointer-events-none" />
      <FloatingOrb color="#ec4899" size={450} blur={130} className="-bottom-20 -right-20 opacity-30 pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-8 max-w-5xl mx-auto">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="text-center flex-shrink-0">
          <span className="text-yellow-400 text-2xl text-glow-gold">✦</span>
          <h1 className="font-display text-3xl md:text-4xl text-yellow-400 tracking-widest mt-1">COSMIC PASSPORT</h1>
          <p className="text-purple-300 text-xs tracking-widest mt-1 uppercase">Your luxury collectible identity card is ready</p>
        </motion.div>

        {/* Large Hero Collectible Passport Card */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 35 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 60, damping: 12, delay: 0.1 }}
              className="w-full max-w-3xl cursor-zoom-in relative z-10"
              onClick={() => fullscreen || setFullscreen(true)}
            >
              {/* Outer Card Wrapper with physical boundary layout */}
              <div 
                className="relative rounded-3xl overflow-hidden border-2 border-yellow-500/40 p-0.5"
                style={{
                  boxShadow: '0 20px 80px rgba(124, 58, 237, 0.35), 0 0 100px rgba(250, 204, 21, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Physical Border Line Double Effect */}
                <div 
                  className="rounded-[22px] overflow-hidden flex flex-col justify-between"
                  style={{
                    background: 'linear-gradient(160deg, #100224 0%, #03000b 60%, #15062a 100%)',
                    border: '1.5px solid rgba(250, 204, 21, 0.2)'
                  }}
                >
                  
                  {/* Top Accent Strip */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500" />

                  {/* Header Block inside Card */}
                  <div className="px-6 py-4 flex items-center justify-between border-b border-purple-500/10"
                    style={{ background: 'linear-gradient(135deg, rgba(20,5,50,0.85), rgba(5,0,12,0.9))' }}>
                    <div>
                      <p className="font-display text-yellow-400 text-base md:text-lg tracking-[0.25em] font-bold text-glow-gold">
                        NAKSHATRA NEXUS
                      </p>
                      <p className="text-purple-300 text-[10px] md:text-xs tracking-[0.2em] font-sans uppercase">
                        Cosmic Passport
                      </p>
                    </div>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                      className="text-yellow-400 text-3xl"
                    >
                      ✦
                    </motion.span>
                  </div>

                  {/* Main Grid Content (Three Columns) */}
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between w-full">
                    
                    {/* LEFT COLUMN: Circular Profile Photo inside Gold Zodiac Frame */}
                    <div className="flex flex-col items-center gap-4 flex-shrink-0">
                      <div className="relative w-40 h-40 flex items-center justify-center">
                        
                        {/* SVG Rotating Gold Zodiac Wheel Frame Overlay */}
                        <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full pointer-events-none animate-spin-slow">
                          <circle cx="60" cy="60" r="58" fill="none" stroke="#fbbf24" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.5" />
                          <circle cx="60" cy="60" r="54" fill="none" stroke="#fbbf24" strokeWidth="1.75" opacity="0.8" />
                          <circle cx="60" cy="60" r="49" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.3" />
                          {[...Array(12)].map((_, i) => {
                            const angle = (i / 12) * 360
                            return (
                              <line
                                key={i}
                                x1="60"
                                y1="6"
                                x2="60"
                                y2="12"
                                stroke="#fbbf24"
                                strokeWidth="1.25"
                                transform={`rotate(${angle} 60 60)`}
                                opacity="0.85"
                              />
                            )
                          })}
                        </svg>

                        {/* Profile avatar image */}
                        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-yellow-500/50 relative z-10">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-purple-950/60 flex items-center justify-center">
                              <span className="text-2xl text-yellow-400">✦</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ID Badge */}
                      <div className="px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full shadow-inner">
                        <p className="text-yellow-400 font-display text-[10px] tracking-widest uppercase font-semibold">{passportId}</p>
                      </div>
                    </div>

                    {/* CENTER COLUMN: Metadata Grid */}
                    <div className="flex-1 w-full space-y-4 text-center md:text-left">
                      <h2 className="font-display text-2xl md:text-3xl text-yellow-400 tracking-wider mb-2 truncate">
                        {visitor?.full_name || 'Cosmic Traveler'}
                      </h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        {rows.map((row) => (
                          <div key={row.label} className="flex flex-col border-b border-purple-500/10 pb-1 items-center md:items-start">
                            <p className="text-purple-400/80 text-[8px] tracking-[0.2em] uppercase font-sans mb-0.5">{row.label}</p>
                            <p className="text-white text-sm md:text-base font-semibold flex items-center gap-1.5 font-sans">
                              <span className="text-base">{row.icon}</span>
                              <span className="truncate max-w-[150px]">{row.value}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      <p className="text-purple-400/60 text-xs italic pt-1 font-serif">
                        "Your cosmic identity, always with you"
                      </p>
                    </div>

                    {/* RIGHT COLUMN: Aligned, Integrated QR Code (Secondary) */}
                    {qrUrl && (
                      <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
                        <div 
                          className="p-2 bg-white rounded-2xl border border-yellow-500/20 shadow-xl"
                          style={{ boxShadow: '0 0 25px rgba(250,204,21,0.15)' }}
                        >
                          <img src={qrUrl} alt="QR Code" className="w-24 h-24" />
                        </div>
                        <p className="text-yellow-400/70 text-[9px] tracking-widest font-display animate-pulse uppercase">✦ SCAN TO VERIFY ✦</p>
                      </div>
                    )}

                  </div>

                  {/* Footer Bar inside Card */}
                  <div className="px-6 py-4.5 flex items-center justify-between border-t border-purple-500/10 font-sans"
                    style={{ background: 'linear-gradient(135deg, rgba(5,0,12,0.9), rgba(20,5,50,0.85))' }}>
                    <p className="text-purple-400/70 text-[10px] md:text-xs uppercase tracking-wide">
                      DOB: {visitor?.date_of_birth || ''}  |  Place: {visitor?.place_of_birth || ''}
                    </p>
                    <p className="text-purple-400/70 text-[10px] uppercase tracking-widest font-display">
                      NK NEXUS
                    </p>
                  </div>

                </div>
              </div>
              <p className="text-purple-500 text-[10px] text-center mt-3 tracking-widest uppercase font-display animate-pulse">
                ✦ Tap Card to View High-Res Image ✦
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 15 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4 flex-wrap justify-center mt-2 z-20"
        >
          {passportUrl && (
            <a
              href={passportUrl}
              download="cosmic-passport.jpg"
              className="px-8 py-3.5 border border-yellow-400/50 hover:border-yellow-400 text-yellow-400 font-display text-xs rounded-xl tracking-[0.18em] hover:bg-yellow-400/5 transition-all duration-300 uppercase shadow-lg"
            >
              ⬇ DOWNLOAD PASSPORT
            </a>
          )}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/email-sent')}
            className="px-8 py-3.5 text-white font-display text-xs rounded-xl tracking-[0.18em] uppercase transition-all duration-300 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
          >
            SEND TO EMAIL →
          </motion.button>
        </motion.div>
      </div>

      {/* Fullscreen view */}
      <AnimatePresence>
        {fullscreen && passportUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setFullscreen(false)}
          >
            <img src={passportUrl} alt="Cosmic Passport" className="max-w-full max-h-full rounded-2xl shadow-2xl border border-yellow-500/20" />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}