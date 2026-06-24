import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useVisitorStore from '../store/useVisitorStore'
import FloatingOrb from '../components/ui/FloatingOrb'

const ANIMAL_EMOJI = {
  Wolf: '🐺', Bear: '🐻', Fox: '🦊', Turtle: '🐢', Lion: '🦁',
  Owl: '🦉', Swan: '🦢', Phoenix: '🔥', Horse: '🐴',
  'Mountain Goat': '🐐', Eagle: '🦅', Dolphin: '🐬',
}

export default function CosmicBlueprintScreen() {
  const navigate = useNavigate()
  const { astrology, aura, spiritAnimal } = useVisitorStore()
  
  // Track which cards are visible on the dashboard
  const [visibleStages, setVisibleStages] = useState({
    zodiac: false,
    nakshatra: false,
    aura: false,
    animal: false,
  })

  const [showContinue, setShowContinue] = useState(false)

  useEffect(() => {
    if (!astrology) {
      navigate('/')
      return
    }

    // Auto-reveal sequence: 2 seconds between each discovery
    const timers = [
      setTimeout(() => setVisibleStages(prev => ({ ...prev, zodiac: true })), 400),
      setTimeout(() => setVisibleStages(prev => ({ ...prev, nakshatra: true })), 2400),
      setTimeout(() => setVisibleStages(prev => ({ ...prev, aura: true })), 4400),
      setTimeout(() => setVisibleStages(prev => ({ ...prev, animal: true })), 6400),
      setTimeout(() => setShowContinue(true), 7800)
    ]

    return () => timers.forEach(clearTimeout)
  }, [astrology])

  const stars = useMemo(() =>
    [...Array(60)].map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 0.5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      dur: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    })), [])

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#050010] text-white">
      {/* Starfield background */}
      <div className="fixed inset-0 pointer-events-none">
        {stars.map(s => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-yellow-200"
            style={{ width: s.size, height: s.size, top: `${s.top}%`, left: `${s.left}%` }}
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity }}
          />
        ))}
      </div>

      <FloatingOrb color="#7c3aed" size={400} blur={120} className="-top-20 -left-20 opacity-30 pointer-events-none" />
      <FloatingOrb color="#10b981" size={400} blur={120} className="-bottom-20 -right-20 opacity-20 pointer-events-none" />

      {/* Main layout container */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between px-6 py-8 max-w-5xl mx-auto">
        
        {/* Header section */}
        <div className="text-center flex-shrink-0">
          <span className="text-yellow-400 text-xl text-glow-gold">✦</span>
          <h1 className="font-display text-2xl md:text-3xl text-yellow-400 tracking-[0.25em] uppercase mt-0.5">
            Cosmic Blueprint
          </h1>
          <p className="text-purple-300 text-xs tracking-wider">Your celestial parameters are fully compiled</p>
        </div>

        {/* 2x2 Reveal Grid */}
        <div className="flex-1 my-6 flex items-center justify-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
            
            {/* CARD 1: ZODIAC */}
            <div className="h-[120px] md:h-[135px]">
              <AnimatePresence>
                {visibleStages.zodiac && astrology && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 12 }}
                    className="h-full rounded-2xl p-4 flex items-center gap-4 border border-yellow-500/20 backdrop-blur-md glow-burst-effect"
                    style={{
                      background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.12), rgba(10, 1, 24, 0.9))',
                      boxShadow: '0 8px 32px 0 rgba(250, 204, 21, 0.08)',
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold font-display"
                      style={{
                        background: 'linear-gradient(135deg, #facc15, #f59e0b)',
                        boxShadow: '0 0 25px rgba(250, 204, 21, 0.45)',
                        color: '#050010',
                      }}
                    >
                      {astrology.zodiac.sign[0]}
                    </motion.div>
                    <div className="min-w-0">
                      <p className="text-yellow-400/80 text-[9px] tracking-widest uppercase font-sans">☀️ Zodiac Sign</p>
                      <p className="font-display text-2xl text-yellow-400 tracking-wider truncate">{astrology.zodiac.sign}</p>
                      <p className="text-yellow-600 text-[10px] font-sans mt-0.5">Sun degree: {astrology.zodiac.degree}°</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CARD 2: NAKSHATRA */}
            <div className="h-[120px] md:h-[135px]">
              <AnimatePresence>
                {visibleStages.nakshatra && astrology && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 12 }}
                    className="h-full rounded-2xl p-4 flex items-center gap-4 border border-pink-500/20 backdrop-blur-md glow-burst-effect"
                    style={{
                      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(10, 1, 24, 0.9))',
                      boxShadow: '0 8px 32px 0 rgba(236, 72, 153, 0.08)',
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-2xl"
                      style={{
                        background: 'linear-gradient(135deg, #ec4899, #c084fc)',
                        boxShadow: '0 0 25px rgba(236, 72, 153, 0.45)',
                      }}
                    >
                      🌙
                    </div>
                    <div className="min-w-0">
                      <p className="text-pink-400/80 text-[9px] tracking-widest uppercase font-sans">🌙 Nakshatra</p>
                      <p className="font-display text-2xl text-pink-400 tracking-wider truncate">{astrology.nakshatra.nakshatra}</p>
                      <div className="flex gap-2.5 mt-0.5 text-purple-400 text-[10px] font-sans">
                        <span>Lord: {astrology.nakshatra.lord}</span>
                        <span>Pada: {astrology.nakshatra.pada}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CARD 3: AURA */}
            <div className="h-[120px] md:h-[135px]">
              <AnimatePresence>
                {visibleStages.aura && aura && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 12 }}
                    className="h-full rounded-2xl p-4 flex items-center gap-4 border backdrop-blur-md glow-burst-effect"
                    style={{
                      borderColor: `${aura.hex}44`,
                      background: `linear-gradient(135deg, ${aura.hex}15, rgba(10, 1, 24, 0.9))`,
                      boxShadow: `0 8px 32px 0 ${aura.hex}12`,
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-display font-semibold text-white text-center leading-tight"
                      style={{
                        background: aura.hex,
                        boxShadow: `0 0 25px ${aura.hex}`,
                      }}
                    >
                      {aura.color.split(' ')[0]}
                    </motion.div>
                    <div className="min-w-0">
                      <p className="text-purple-300/80 text-[9px] tracking-widest uppercase font-sans">✨ Aura Color</p>
                      <p className="font-display text-2xl tracking-wider truncate" style={{ color: aura.hex }}>{aura.color}</p>
                      <p className="text-purple-400 text-[10px] font-sans mt-0.5 truncate">{aura.nakshatra_boost}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CARD 4: SPIRIT ANIMAL */}
            <div className="h-[120px] md:h-[135px]">
              <AnimatePresence>
                {visibleStages.animal && spiritAnimal && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 12 }}
                    className="h-full rounded-2xl p-4 flex items-center gap-4 border border-emerald-500/20 backdrop-blur-md glow-burst-effect"
                    style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(10, 1, 24, 0.9))',
                      boxShadow: '0 8px 32px 0 rgba(16, 185, 129, 0.08)',
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-3xl"
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        boxShadow: '0 0 25px rgba(16, 185, 129, 0.45)',
                      }}
                    >
                      {ANIMAL_EMOJI[spiritAnimal.animal] || '🐾'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-emerald-400/80 text-[9px] tracking-widest uppercase font-sans">🐾 Spirit Animal</p>
                      <p className="font-display text-2xl text-emerald-400 tracking-wider truncate">{spiritAnimal.animal}</p>
                      <div className="flex gap-2 mt-1.5 font-sans">
                        <span className="px-2 py-0.5 rounded-full text-[9px] text-purple-300 border border-purple-500/20 bg-purple-950/20">
                          {spiritAnimal.element}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] text-pink-300 border border-pink-500/20 bg-pink-950/20">
                          {spiritAnimal.power}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Continue Button Section */}
        <div className="h-16 flex items-center justify-center flex-shrink-0">
          <AnimatePresence>
            {showContinue && (
              <motion.button
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(124,58,237,0.5)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/cosmic-identity')}
                className="px-14 py-3.5 text-white font-display tracking-[0.2em] rounded-xl uppercase text-xs font-semibold shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
              >
                Reveal Your Destiny →
              </motion.button>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}