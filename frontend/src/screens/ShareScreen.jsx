import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useVisitorStore from '../store/useVisitorStore'

export default function ShareScreen() {
  const navigate = useNavigate()
  const { astrology, passportUrl } = useVisitorStore()

  const shareText = `I just discovered my cosmic identity! I am a ${astrology?.zodiac?.sign || 'Cosmic Soul'} — discover yours on Nakshatra Nexus!`
  const shareUrl = window.location.origin

  const options = [
    { label: 'WhatsApp', emoji: '💬', color: '#25D366', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank') },
    { label: 'LinkedIn', emoji: '💼', color: '#0077B5', action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank') },
    { label: 'Copy Link', emoji: '🔗', color: '#7c3aed', action: () => navigator.clipboard.writeText(shareUrl).then(() => alert('Copied!')) },
    { label: 'Web Share', emoji: '📤', color: '#ec4899', action: async () => navigator.share ? await navigator.share({ title: 'Nakshatra Nexus', text: shareText, url: shareUrl }) : alert('Use Copy Link') },
  ]

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(180deg, #0a0118 0%, #1a0533 100%)' }}>

      <div className="fixed inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full bg-yellow-400"
            style={{ width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: Math.random() * 3 + 2, delay: Math.random() * 2, repeat: Infinity }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-6xl mb-4">🌌</motion.div>
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl text-yellow-400 tracking-widest mb-2">SHARE YOUR COSMOS</motion.h1>
        <p className="text-purple-300 text-sm mb-8">Let the universe know who you truly are</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {options.map((opt, i) => (
            <motion.div key={opt.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-4" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={opt.action} className="w-full flex flex-col items-center gap-2">
                <span className="text-3xl">{opt.emoji}</span>
                <span className="font-display text-sm tracking-widest" style={{ color: opt.color }}>{opt.label}</span>
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/')}
          className="px-10 py-3 border border-purple-500/50 text-purple-300 font-display tracking-widest rounded-full uppercase hover:bg-purple-900/30 transition-colors text-sm">
          Begin New Journey
        </motion.button>
      </div>
    </div>
  )
}