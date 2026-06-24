import { useEffect, useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useVisitorStore from '../store/useVisitorStore'
import { spinWheel, revealDestinyVault, getGeminiInsight } from '../services/api'
import FloatingOrb from '../components/ui/FloatingOrb'

const SEGMENTS = [
  { label: 'Cosmic Fortune', color: '#FFD700' },
  { label: 'Celestial Power', color: '#9B59B6' },
  { label: 'Lunar Blessing', color: '#C0C0C0' },
  { label: 'Solar Glory', color: '#FFA500' },
  { label: 'Galactic Wisdom', color: '#00BFFF' },
  { label: 'Sacred Love', color: '#FF69B4' },
  { label: 'Karma Reset', color: '#50C878' },
  { label: 'Destiny Unlock', color: '#FF4444' },
  { label: 'Ancestor Power', color: '#8B4513' },
  { label: 'Stardust', color: '#4B0082' },
  { label: 'Phoenix Rising', color: '#FF6B35' },
  { label: 'Cosmic Shield', color: '#20B2AA' },
]

export default function CosmicIdentityScreen() {
  const navigate = useNavigate()
  const {
    visitorId,
    visitor,
    archetype,
    destinyVault,
    geminiInsight,
    wheelResult,
    setWheelResult,
    setDestinyVault,
    setGeminiInsight,
  } = useVisitorStore()

  const [loadingData, setLoadingData] = useState(true)
  const [sequenceIndex, setSequenceIndex] = useState(0) // 0: loading, 1: Archetype, 2: Wheel Spin, 3: Chest Unlock, 4: Oracle Cards, 5: Insight, 6: Throne Claimed
  const [wheelRotation, setWheelRotation] = useState(0)
  const wheelSpunRef = useRef(false)
  const [chestState, setChestState] = useState('closed') // 'closed', 'shaking', 'opened'
  const [flippedCards, setFlippedCards] = useState([false, false, false])

  // Preload API data in background on mount
  useEffect(() => {
    if (!visitorId) {
      navigate('/')
      return
    }

    const preload = async () => {
      try {
        const promises = []
        if (!wheelResult) {
          promises.push(spinWheel(visitorId).then(r => setWheelResult(r.data)))
        }
        if (!destinyVault) {
          promises.push(revealDestinyVault(visitorId).then(r => setDestinyVault(r.data)))
        }
        if (!geminiInsight) {
          promises.push(getGeminiInsight(visitorId).then(r => setGeminiInsight(r.data.insight)))
        }

        if (promises.length > 0) {
          await Promise.all(promises)
        }
      } catch (err) {
        console.error("Cosmic loading error:", err)
      } finally {
        setLoadingData(false)
        setSequenceIndex(1) // Trigger Archetype Reveal immediately
      }
    }
    preload()
  }, [])

  // Auto-playing sequence timing controller
  useEffect(() => {
    if (loadingData || sequenceIndex === 0) return

    let timer
    if (sequenceIndex === 1) {
      // Archetype reveals -> move to Wheel Spin after 3 seconds
      timer = setTimeout(() => setSequenceIndex(2), 3000)
    } else if (sequenceIndex === 2) {
      // Automatically trigger wheel spin
      if (!wheelSpunRef.current) {
        wheelSpunRef.current = true
        const spins = 1800 + Math.random() * 720
        setWheelRotation(spins)
        // Spin lasts 3.5s -> wait 4.5s total to read result, then move to Chest stage
        timer = setTimeout(() => setSequenceIndex(3), 4800)
      }
    } else if (sequenceIndex === 3) {
      // Trigger chest shaking immediately
      setChestState('shaking')
      timer = setTimeout(() => {
        setChestState('opened')
        // Wait 1.5s after chest opens to transition to Oracle cards
        timer = setTimeout(() => setSequenceIndex(4), 1500)
      }, 1500)
    } else if (sequenceIndex === 4) {
      // Auto flip oracle cards one by one
      const flipTimers = [
        setTimeout(() => setFlippedCards(prev => [true, prev[1], prev[2]]), 400),
        setTimeout(() => setFlippedCards(prev => [prev[0], true, prev[2]]), 1200),
        setTimeout(() => setFlippedCards(prev => [prev[0], prev[1], true]), 2000),
        // Go to Insight reveal 2.5s after the final card flips
        setTimeout(() => setSequenceIndex(5), 3500)
      ]
      return () => flipTimers.forEach(clearTimeout)
    } else if (sequenceIndex === 5) {
      // Show AI Insight -> move to final Throne Claimed after 4.5 seconds
      timer = setTimeout(() => setSequenceIndex(6), 4500)
    }

    return () => clearTimeout(timer)
  }, [sequenceIndex, loadingData])

  const stars = useMemo(() =>
    [...Array(60)].map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 0.5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      dur: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    })), [])

  const currentSegmentColor = useMemo(() => {
    if (!wheelResult) return '#fbbf24'
    const found = SEGMENTS.find(s => s.label.toLowerCase() === wheelResult.segment.toLowerCase())
    return found ? found.color : '#fbbf24'
  }, [wheelResult])

  if (loadingData) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050010]">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-5xl text-yellow-400 text-glow-gold mb-4"
        >
          ✦
        </motion.div>
        <p className="text-purple-300 text-sm tracking-[0.25em] font-display animate-pulse">
          THE COSMOS IS ALIGNING YOUR DESTINY...
        </p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#050010] text-white">
      {/* Starfield backdrop */}
      <div className="fixed inset-0 pointer-events-none">
        {stars.map(s => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-yellow-200"
            style={{ width: s.size, height: s.size, top: `${s.top}%`, left: `${s.left}%` }}
            animate={{ opacity: [0.1, 0.7, 0.1] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity }}
          />
        ))}
      </div>

      <FloatingOrb color="#7c3aed" size={400} blur={120} className="-top-20 -left-20 opacity-40 pointer-events-none" />
      <FloatingOrb color="#ec4899" size={400} blur={120} className="-bottom-20 -right-20 opacity-30 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between px-6 py-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center flex-shrink-0">
          <span className="text-yellow-400 text-xl text-glow-gold">✦</span>
          <h1 className="font-display text-2xl md:text-3xl text-yellow-400 tracking-[0.25em] uppercase mt-0.5">
            Cosmic Identity Reveal
          </h1>
          <p className="text-purple-300 text-xs tracking-wider">Witness the unfolding of your cosmic signature</p>
        </div>

        {/* Cinematic Grid Layout */}
        <div className="flex-1 my-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center overflow-hidden">
          
          {/* LEFT PANEL: Archetype Card + Cosmic Wheel */}
          <div className="lg:col-span-4 flex flex-col gap-4 h-full justify-center">
            
            {/* 1. Archetype Reveal */}
            <AnimatePresence>
              {sequenceIndex >= 1 && archetype && (
                <motion.div
                  initial={{ opacity: 0, x: -50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="rounded-2xl p-4 border border-purple-500/20 backdrop-blur-md flex items-center gap-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(10, 1, 24, 0.85))',
                    boxShadow: '0 8px 32px 0 rgba(124, 58, 237, 0.15)',
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
                    👑
                  </div>
                  <div className="min-w-0">
                    <p className="text-purple-400/80 text-[9px] tracking-widest uppercase">Cosmic Archetype</p>
                    <p className="font-display text-lg text-yellow-400 tracking-wider truncate">{archetype.archetype}</p>
                    <p className="text-pink-400 text-[10px] truncate">{archetype.title}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. Cosmic Wheel (Spins and reveals reward segment) */}
            <AnimatePresence>
              {sequenceIndex >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="rounded-2xl p-5 border border-purple-500/20 backdrop-blur-md flex flex-col items-center justify-center flex-1 min-h-[260px] relative"
                  style={{
                    background: 'rgba(10, 1, 24, 0.75)',
                    boxShadow: '0 8px 32px 0 rgba(124, 58, 237, 0.1)',
                  }}
                >
                  {/* Wheel Header */}
                  <div className="text-center mb-3">
                    <p className="text-purple-400/80 text-[9px] tracking-widest uppercase">Cosmic Blessing Wheel</p>
                  </div>

                  {/* Wheel Element */}
                  <div className="relative w-36 h-36 flex-shrink-0">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-yellow-400 text-sm z-10 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]">▼</div>
                    <motion.div
                      className="w-full h-full rounded-full border border-yellow-400/20"
                      animate={{ rotate: wheelRotation }}
                      transition={{ duration: 3.5, ease: [0.17, 0.67, 0.35, 1] }}
                      style={{
                        background: `conic-gradient(${SEGMENTS.map((s, i) =>
                          `${s.color} ${(i / SEGMENTS.length) * 100}% ${((i + 1) / SEGMENTS.length) * 100}%`
                        ).join(', ')})`,
                        boxShadow: '0 0 25px rgba(124,58,237,0.3)',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center z-10"
                        style={{ background: '#0a0118', border: '1.5px solid rgba(250,204,21,0.6)' }}>
                        <span className="text-yellow-400 text-xs">✦</span>
                      </div>
                    </div>
                  </div>

                  {/* Wheel Result Notification */}
                  <div className="h-10 mt-3 flex items-center justify-center text-center">
                    {sequenceIndex > 2 && wheelResult ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center"
                      >
                        <p className="text-xs font-display font-semibold tracking-wider" style={{ color: currentSegmentColor }}>
                          {wheelResult.segment.toUpperCase()} UNLOCKED!
                        </p>
                      </motion.div>
                    ) : (
                      <p className="text-[10px] text-purple-400/70 tracking-wider animate-pulse">
                        THE WHEEL SPINS...
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* CENTER PANEL: Treasure Chest / Oracle Cards */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center h-full relative">
            
            {/* 3. Vault Chest Animation */}
            {sequenceIndex === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center text-center absolute z-20"
              >
                <motion.div
                  animate={
                    chestState === 'shaking'
                      ? { x: [-6, 6, -6, 6, -6, 6, 0], y: [-2, 2, -2, 2, -2, 2, 0] }
                      : {}
                  }
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-7xl mb-4 filter drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                >
                  {chestState === 'opened' ? '🔓' : '🔒'}
                </motion.div>
                <h3 className="font-display text-lg text-yellow-400 tracking-wider">
                  {chestState === 'shaking' ? 'UNSEALING DESTINY VAULT' : 'VAULT UNLOCKED'}
                </h3>
                <p className="text-xs text-purple-300 mt-1 animate-pulse">
                  {chestState === 'shaking' ? 'Inserting stellar key...' : 'Revealing oracle items...'}
                </p>
              </motion.div>
            )}

            {/* 4. Oracle Cards Grid */}
            <AnimatePresence>
              {sequenceIndex >= 4 && destinyVault && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col gap-4 items-center justify-center h-full"
                >
                  <p className="text-purple-400/80 text-[9px] tracking-widest uppercase mb-1">Stellar Vault Blessings</p>
                  
                  <div className="flex flex-col gap-3.5 w-full max-w-sm">
                    {[
                      {
                        title: 'Lucky Alignment',
                        value: `${destinyVault.lucky_number} • ${destinyVault.lucky_gem} • ${destinyVault.lucky_color}`,
                        desc: 'Stellar alignment markers',
                        emoji: '💎'
                      },
                      {
                        title: 'Power Mantra',
                        value: `"${destinyVault.power_mantra}"`,
                        desc: 'Your frequency activation sound',
                        emoji: '⚡'
                      },
                      {
                        title: 'Stellar Prophecy',
                        value: destinyVault.future_prophecy,
                        desc: 'The path illuminated before you',
                        emoji: '🔮'
                      }
                    ].map((card, i) => (
                      <div key={i} className="perspective-1000 w-full h-[72px]">
                        <div className={`card-inner ${flippedCards[i] ? 'flipped' : ''}`}>
                          
                          {/* Front Side (Face Down) */}
                          <div 
                            className="card-front flex items-center justify-center border border-purple-500/30"
                            style={{
                              background: 'linear-gradient(135deg, #100225 0%, #05000d 100%)',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                            }}
                          >
                            <span className="text-xl text-purple-400/40 animate-pulse">✦</span>
                          </div>

                          {/* Back Side (Face Up) */}
                          <div 
                            className="card-back flex items-center gap-3 p-3 border border-yellow-400/30 text-left"
                            style={{
                              background: 'linear-gradient(135deg, rgba(20,5,50,0.9) 0%, rgba(5,0,12,0.95) 100%)',
                              boxShadow: '0 4px 15px rgba(250,204,21,0.1)'
                            }}
                          >
                            <div className="text-2xl flex-shrink-0">{card.emoji}</div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-purple-400 text-[8px] tracking-wider uppercase font-semibold">{card.title}</p>
                                <p className="text-purple-600 text-[7px] tracking-widest font-mono uppercase">{card.desc}</p>
                              </div>
                              <p className="text-[11px] font-semibold text-yellow-100 leading-snug mt-0.5 truncate-3-lines">
                                {card.value}
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* RIGHT PANEL: Gemini Insight */}
          <div className="lg:col-span-4 flex flex-col justify-center h-full">
            
            {/* 5. Gemini Cosmic Insight */}
            <AnimatePresence>
              {sequenceIndex >= 5 && geminiInsight && (
                <motion.div
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className="rounded-2xl p-5 border border-purple-500/20 backdrop-blur-md flex flex-col justify-between min-h-[320px] max-h-[380px]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(10, 1, 24, 0.85))',
                    boxShadow: '0 8px 32px 0 rgba(236, 72, 153, 0.08)',
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3 border-b border-purple-500/10 pb-2">
                      <span className="text-xl text-pink-500 text-glow-pink">✨</span>
                      <p className="font-display text-pink-400 text-xs tracking-widest uppercase">Gemini AI Insight</p>
                    </div>
                    
                    {/* Insight Text */}
                    <div className="overflow-y-auto max-h-[240px] pr-1.5 custom-scrollbar">
                      <p className="text-purple-100 text-xs leading-relaxed italic font-serif">
                        "{geminiInsight}"
                      </p>
                    </div>
                  </div>

                  <p className="text-[8px] text-pink-500/50 uppercase tracking-[0.2em] mt-3 text-right">
                    ✦ Transmitted via Gemini AI ✦
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

        {/* BOTTOM PANEL: Throne Claimed Banner & Single Continue Button */}
        <div className="text-center flex-shrink-0 flex flex-col items-center gap-3">
          
          {/* 6. Cosmic Throne Banner */}
          <AnimatePresence>
            {sequenceIndex >= 6 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 justify-center py-2 px-6 rounded-full border border-yellow-500/30"
                style={{
                  background: 'linear-gradient(90deg, rgba(250,204,21,0.05), rgba(124,58,237,0.1), rgba(250,204,21,0.05))',
                  boxShadow: '0 0 30px rgba(250,204,21,0.1)'
                }}
              >
                <span className="text-yellow-400 text-xl animate-pulse">⚜️</span>
                <span className="font-display text-sm text-yellow-400 tracking-[0.2em] font-semibold text-glow-gold">
                  COSMIC IDENTITY CLAIMED
                </span>
                <span className="text-yellow-400 text-xl animate-pulse">⚜️</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Single CTA Button */}
          <div className="h-14 flex items-center justify-center">
            {sequenceIndex >= 6 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(236,72,153,0.5)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/passport')}
                className="px-14 py-3.5 text-white font-display tracking-[0.2em] rounded-xl uppercase text-xs font-semibold shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
              >
                Reveal Your Passport →
              </motion.button>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}