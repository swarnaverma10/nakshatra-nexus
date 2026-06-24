import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function NotFoundScreen() {
  const navigate = useNavigate()
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(180deg, #0a0118 0%, #1a0533 100%)' }}>
      <div className="text-center">
        <motion.div animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }} className="text-8xl mb-6">🌌</motion.div>
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="font-display text-5xl text-yellow-400 tracking-widest mb-4">LOST IN COSMOS</motion.h1>
        <p className="text-purple-300 text-sm mb-2 tracking-widest">404 — This star system does not exist</p>
        <p className="text-purple-400 text-xs mb-8">The page you seek has drifted into a black hole</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/')}
          className="px-10 py-3 text-white font-display tracking-widest rounded-full uppercase"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
          Return to Home Galaxy
        </motion.button>
      </div>
    </div>
  )
}