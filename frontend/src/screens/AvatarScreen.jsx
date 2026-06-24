import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CosmicBackground from '../components/cosmic/CosmicBackground'
import FloatingOrb from '../components/ui/FloatingOrb'
import useVisitorStore from '../store/useVisitorStore'

export default function AvatarScreen() {
  const navigate = useNavigate()
  const { avatarUrl, visitor } = useVisitorStore()

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <CosmicBackground />
      <FloatingOrb color="#7c3aed" size={350} blur={100} className="-top-20 -left-20" />
      <FloatingOrb color="#ec4899" size={250} blur={80} className="-bottom-20 -right-20" />

      <div className="relative z-10 text-center max-w-lg">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-purple-300 text-xs tracking-widest uppercase mb-4">
          Your Cosmic Avatar Has Been Revealed
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl text-yellow-400 tracking-widest mb-8">
          BEHOLD YOUR COSMIC SELF
        </motion.h1>

        {avatarUrl && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }} className="relative mx-auto w-64 h-64 mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 blur-xl opacity-50 animate-pulse" />
            <img src={avatarUrl} alt="Cosmic Avatar"
              className="relative w-64 h-64 rounded-full object-cover border-4 border-yellow-400/50 shadow-2xl" />
          </motion.div>
        )}

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-purple-200 text-lg mb-8">
          Welcome to the cosmos,{' '}
          <span className="text-yellow-400 font-display">{visitor?.full_name || 'Cosmic Soul'}</span>
        </motion.p>

        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/cosmic-blueprint')}
          className="px-10 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-display tracking-widest rounded-full uppercase">
          Reveal Your Cosmic Blueprint →
        </motion.button>
      </div>
    </div>
  )
}
