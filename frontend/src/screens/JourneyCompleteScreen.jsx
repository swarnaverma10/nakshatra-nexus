import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import CosmicBackground from '../components/cosmic/CosmicBackground'
import FloatingOrb from '../components/ui/FloatingOrb'
import RevealCard from '../components/ui/RevealCard'
import useVisitorStore from '../store/useVisitorStore'

const ANIMAL_EMOJI = {
  Wolf: '🐺', Bear: '🐻', Fox: '🦊', Turtle: '🐢', Lion: '🦁',
  Owl: '🦉', Swan: '🦢', Phoenix: '🔥', Horse: '🐴',
  'Mountain Goat': '🐐', Eagle: '🦅', Dolphin: '🐬',
}

export default function JourneyCompleteScreen() {
  const navigate = useNavigate()
  const { 
    visitorId,
    visitor, 
    avatarUrl, 
    astrology, 
    aura, 
    spiritAnimal, 
    archetype, 
    reset 
  } = useVisitorStore()

  const [celebrationStarted, setCelebrationStarted] = useState(false)

  useEffect(() => {
    // If essential data is missing, redirect to safety
    if (!visitor) {
      navigate('/')
    } else {
      setCelebrationStarted(true)
    }
  }, [visitor, navigate])

  // Confetti/Sparks generation
  const goldSparks = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2
      const distance = 80 + Math.random() * 200
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: Math.random() * 6 + 3,
        duration: Math.random() * 2 + 1.5,
        delay: Math.random() * 0.5,
      }
    })
  }, [])

  if (!visitor) return null

  const handleRestart = () => {
    reset()
    navigate('/')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-y-auto px-4 py-16 bg-[#050010]">
      <CosmicBackground intensity={1.5} />
      
      {/* Ambient glowing fields */}
      <FloatingOrb color="#facc15" size={400} blur={130} className="-top-30 left-1/4 opacity-40 animate-pulse" />
      <FloatingOrb color="#ec4899" size={350} blur={110} className="-bottom-20 right-10 opacity-30" />

      {/* Gold Celebration Sparks */}
      {celebrationStarted && goldSparks.map((spark) => (
        <motion.div
          key={spark.id}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{
            x: [0, spark.x],
            y: [0, spark.y],
            opacity: [0, 1, 0.8, 0],
            scale: [0, 1.5, 1, 0],
          }}
          transition={{
            duration: spark.duration,
            repeat: Infinity,
            delay: spark.delay,
            ease: 'easeOut',
          }}
          className="absolute left-1/2 top-1/3 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 z-0 pointer-events-none"
          style={{
            width: spark.size,
            height: spark.size,
            marginLeft: -spark.size / 2,
            marginTop: -spark.size / 2,
            boxShadow: '0 0 10px rgba(250, 204, 21, 0.9)',
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-2xl text-center flex flex-col items-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <motion.p
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-yellow-400 text-sm tracking-[0.3em] uppercase mb-3 font-display text-glow-gold"
          >
            ✦ The Stars Align ✦
          </motion.p>
          <h1 className="font-display text-3xl md:text-5xl text-white tracking-[0.15em] font-bold leading-tight">
            YOUR COSMIC JOURNEY IS <span className="text-yellow-400 text-glow-gold">COMPLETE</span>
          </h1>
        </motion.div>

        {/* Master Identity Card */}
        <RevealCard delay={0.3} className="w-full p-8 mb-10 overflow-hidden relative border border-yellow-500/30 rounded-3xl bg-black/60 backdrop-blur-md">
          {/* Glowing diagonal border flash */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-500/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col items-center mb-8">
            {/* User Avatar with Glowing Rings */}
            {avatarUrl && (
              <div className="relative w-36 h-36 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[-4px] rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, #facc15 0%, transparent 50%, #7c3aed 70%, #facc15 100%)',
                    padding: '2px',
                  }}
                >
                  <div className="w-full h-full rounded-full bg-[#050010]" />
                </motion.div>
                <img
                  src={avatarUrl}
                  alt={visitor?.full_name}
                  className="w-full h-full rounded-full object-cover border-4 border-yellow-400/80 shadow-[0_0_30px_rgba(250,204,21,0.35)] relative z-10"
                />
              </div>
            )}

            <h2 className="font-display text-2xl text-yellow-400 font-semibold tracking-wider text-glow-gold">
              {visitor?.full_name}
            </h2>
            <p className="text-purple-300/80 text-xs font-body tracking-wider uppercase mt-1">
              Cosmic ID: #{visitorId?.substring(0, 8) || 'NEXUS'}
            </p>
          </div>

          {/* Grid of Cosmic Attributes */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            
            {/* 1. Zodiac */}
            <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-purple-400 uppercase tracking-widest block mb-2 font-body">Zodiac</span>
              <span className="text-xl mb-1 block">🪐</span>
              <span className="font-display text-sm text-yellow-400 truncate">{astrology?.zodiac?.sign || 'N/A'}</span>
            </div>

            {/* 2. Nakshatra */}
            <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-purple-400 uppercase tracking-widest block mb-2 font-body">Nakshatra</span>
              <span className="text-xl mb-1 block">✨</span>
              <span className="font-display text-sm text-pink-400 truncate">{astrology?.nakshatra?.nakshatra || 'N/A'}</span>
            </div>

            {/* 3. Aura */}
            <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-purple-400 uppercase tracking-widest block mb-2 font-body">Aura</span>
              <span className="text-xl mb-1 block">🔮</span>
              <span 
                className="font-display text-sm truncate" 
                style={{ color: aura?.hex || '#a855f7' }}
              >
                {aura?.color || 'N/A'}
              </span>
            </div>

            {/* 4. Spirit Animal */}
            <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-purple-400 uppercase tracking-widest block mb-2 font-body">Guide</span>
              <span className="text-xl mb-1 block">
                {spiritAnimal ? ANIMAL_EMOJI[spiritAnimal.animal] || '🦄' : '🦄'}
              </span>
              <span className="font-display text-sm text-white truncate">{spiritAnimal?.animal || 'N/A'}</span>
            </div>

            {/* 5. Archetype */}
            <div className="col-span-2 md:col-span-1 bg-purple-950/20 border border-purple-500/20 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-purple-400 uppercase tracking-widest block mb-2 font-body">Archetype</span>
              <span className="text-xl mb-1 block">🎭</span>
              <span className="font-display text-sm text-blue-400 truncate">{archetype?.archetype || 'N/A'}</span>
            </div>
            
          </div>
        </RevealCard>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(250,204,21,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRestart}
            className="px-12 py-4 bg-gradient-to-r from-yellow-500 via-pink-600 to-purple-600 text-white font-display tracking-[0.2em] rounded-xl uppercase text-sm font-semibold shadow-[0_0_20px_rgba(250,204,21,0.2)] transition-all"
          >
            Begin New Journey
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
