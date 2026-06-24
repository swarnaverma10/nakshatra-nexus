import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CosmicBackground from '../components/cosmic/CosmicBackground'
import LoadingConstellation from '../components/ui/LoadingConstellation'
import useVisitorStore from '../store/useVisitorStore'
import { generateAvatar, calculateAstrology, revealAura, revealSpiritAnimal, revealArchetype } from '../services/api'

const STEPS = [
  { label: 'Generating your cosmic avatar...', key: 'avatar' },
  { label: 'Calculating zodiac & nakshatra...', key: 'astrology' },
  { label: 'Reading your aura...', key: 'aura' },
  { label: 'Summoning your spirit animal...', key: 'spirit' },
  { label: 'Revealing your archetype...', key: 'archetype' },
]

export default function ProcessingScreen() {
  const navigate = useNavigate()
  const { visitorId, setAvatarUrl, setAstrology, setAura, setSpiritAnimal, setArchetype } = useVisitorStore()
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!visitorId) { navigate('/'); return }
    runAll()
  }, [])

  const runAll = async () => {
    try {
      setStep(0)
      const av = await generateAvatar(visitorId)
      setAvatarUrl(av.data.avatar_url)

      setStep(1)
      const ast = await calculateAstrology(visitorId)
      setAstrology(ast.data)

      setStep(2)
      const aura = await revealAura(visitorId)
      setAura(aura.data)

      setStep(3)
      const sa = await revealSpiritAnimal(visitorId)
      setSpiritAnimal(sa.data)

      setStep(4)
      const arc = await revealArchetype(visitorId)
      setArchetype(arc.data)

      setStep(5)
      setTimeout(() => navigate('/avatar'), 800)
    } catch (err) {
      setError('A cosmic disturbance occurred. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <CosmicBackground intensity={1.5} />
      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-display text-3xl text-yellow-400 tracking-widest mb-12"
        >
          COSMIC ALIGNMENT IN PROGRESS
        </motion.h1>

        <LoadingConstellation text={STEPS[Math.min(step, STEPS.length - 1)]?.label} />

        <div className="mt-8 flex gap-2 justify-center">
          {STEPS.map((s, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${i <= step ? 'bg-yellow-400' : 'bg-purple-800'}`}
              animate={i === step ? { scale: [1, 1.4, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          ))}
        </div>

        {error && (
          <div className="mt-8">
            <p className="text-pink-400 mb-4">{error}</p>
            <button onClick={runAll} className="px-6 py-2 border border-purple-500 text-purple-300 rounded-full text-sm">
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
