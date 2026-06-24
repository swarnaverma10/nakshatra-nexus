import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CosmicBackground from '../components/cosmic/CosmicBackground'
import RevealCard from '../components/ui/RevealCard'
import LoadingConstellation from '../components/ui/LoadingConstellation'
import useVisitorStore from '../store/useVisitorStore'
import { revealDestinyVault } from '../services/api'

const VAULT_OPTIONS = [
  { id: 'A', label: 'The Sealed Scroll', emoji: '📜', color: '#facc15' },
  { id: 'B', label: 'The Hidden Key',    emoji: '🗝️', color: '#c084fc' },
  { id: 'C', label: 'The Star Shard',    emoji: '💎', color: '#67e8f9' },
]

export default function DestinyVaultScreen() {
  const navigate = useNavigate()
  const { visitorId, destinyVault, setDestinyVault } = useVisitorStore()

  const [picked, setPicked] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(destinyVault || null)

  const handlePick = useCallback(async (optionId) => {
    if (picked || !visitorId) return
    setPicked(optionId)
    setLoading(true)
    setError('')

    try {
      const res = await revealDestinyVault(visitorId)
      setResult(res.data)
      setDestinyVault(res.data)
    } catch {
      setError('The vault stayed silent. The cosmos will reveal more on your passport.')
    } finally {
      setLoading(false)
    }
  }, [picked, visitorId, setDestinyVault])

  const revealedWord = result?.message || result?.word || result?.reveal || 'The cosmos has spoken.'

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 bg-[#050010]">
      <CosmicBackground intensity={1.3} />

      <div className="relative z-10 w-full max-w-lg text-center flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-purple-300 text-xs tracking-[0.25em] uppercase mb-2 font-body">Choose Your Fate</p>
          <h1 className="font-display text-4xl md:text-5xl text-yellow-400 tracking-[0.15em] text-glow-gold">
            DESTINY VAULT
          </h1>
        </motion.div>

        {!picked ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {VAULT_OPTIONS.map((opt, i) => (
              <motion.button
                key={opt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${opt.color}50` }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handlePick(opt.id)}
                className="flex flex-col items-center gap-3 py-8 px-4 rounded-2xl border bg-black/30"
                style={{ borderColor: `${opt.color}40` }}
              >
                <span className="text-4xl">{opt.emoji}</span>
                <span className="font-display text-xs tracking-widest uppercase" style={{ color: opt.color }}>
                  {opt.label}
                </span>
              </motion.button>
            ))}
          </div>
        ) : loading ? (
          <LoadingConstellation text="Unsealing your destiny..." />
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 80 }}
              className="w-full"
            >
              <RevealCard delay={0.1} className="mb-8 w-full p-8">
                <p className="text-purple-400 text-xs tracking-widest uppercase mb-3 font-body">✨ Revealed ✨</p>
                <p className="font-display text-2xl text-yellow-400 leading-relaxed">
                  {revealedWord}
                </p>
                {error && <p className="text-pink-400 text-sm mt-4 font-body">{error}</p>}
              </RevealCard>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(236,72,153,0.5)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/passport')}
                className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 text-white font-display tracking-[0.18em] rounded-xl uppercase text-sm font-medium"
              >
                Reveal Your Passport →
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
