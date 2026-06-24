import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useVisitorStore from '../store/useVisitorStore'
import { spinWheel } from '../services/api'

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

export default function CosmicWheelScreen() {
  const navigate = useNavigate()
  const { visitorId, setWheelResult, wheelResult } = useVisitorStore()
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState(wheelResult || null)
  const [error, setError] = useState('')

  const handleSpin = async () => {
    if (spinning || result) return
    setSpinning(true)
    setError('')
    const spins = 1440 + Math.random() * 720
    setRotation(prev => prev + spins)
    try {
      await new Promise(r => setTimeout(r, 3500))
      const res = await spinWheel(visitorId)
      setResult(res.data)
      setWheelResult(res.data)
    } catch {
      setError('Cosmic disturbance. Try again.')
    } finally {
      setSpinning(false)
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden px-4"
      style={{ background: 'linear-gradient(180deg, #0a0118 0%, #1a0533 100%)' }}>

      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full bg-yellow-400"
            style={{ width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: Math.random() * 3 + 2, delay: Math.random() * 2, repeat: Infinity }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl text-yellow-400 tracking-widest mb-2">COSMIC WHEEL</motion.h1>
        <p className="text-purple-300 text-sm mb-8">Spin to reveal your cosmic reward</p>

        {/* Wheel */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-400 text-2xl z-10">▼</div>
          <motion.div
            className="w-full h-full rounded-full"
            animate={{ rotate: rotation }}
            transition={{ duration: 3.5, ease: [0.17, 0.67, 0.35, 1] }}
            style={{
              background: `conic-gradient(${SEGMENTS.map((s, i) =>
                `${s.color} ${(i / SEGMENTS.length) * 100}% ${((i + 1) / SEGMENTS.length) * 100}%`
              ).join(', ')})`,
              boxShadow: '0 0 40px rgba(124,58,237,0.5)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full flex items-center justify-center z-10"
              style={{ background: '#0a0118', border: '2px solid rgba(250,204,21,0.6)', boxShadow: '0 0 20px rgba(250,204,21,0.4)' }}>
              <span className="text-yellow-400 font-display text-sm">✦</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="spin">
              <motion.button
                whileHover={{ scale: spinning ? 1 : 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSpin}
                disabled={spinning}
                className="px-12 py-4 text-white font-display tracking-widest rounded-full uppercase text-sm disabled:opacity-60"
                style={{ background: spinning ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #ec4899)', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}
              >
                {spinning ? 'THE COSMOS DECIDES...' : 'SPIN YOUR DESTINY ✦'}
              </motion.button>
              {error && <p className="text-pink-400 text-sm mt-4">{error}</p>}
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-2xl p-5 mb-6"
                style={{ background: 'rgba(124,58,237,0.2)', border: `1px solid ${result.color}66`, backdropFilter: 'blur(12px)' }}>
                <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Your Cosmic Reward</p>
                <p className="font-display text-2xl mb-2" style={{ color: result.color }}>{result.segment}</p>
                <p className="text-purple-200 text-sm leading-relaxed">{result.reward}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/cosmic-identity')}
                className="px-12 py-4 text-white font-display tracking-widest rounded-full uppercase text-sm"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}
              >
                Open Destiny Vault →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}