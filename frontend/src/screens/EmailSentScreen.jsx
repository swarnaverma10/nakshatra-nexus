import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CosmicBackground from '../components/cosmic/CosmicBackground'
import useVisitorStore from '../store/useVisitorStore'
import { sendEmail } from '../services/api'

export default function EmailSentScreen() {
  const navigate = useNavigate()
  const { visitorId, visitor } = useVisitorStore()
  const [status, setStatus] = useState('sending')

  useEffect(() => {
    if (!visitorId) { setStatus('error'); return }
    sendEmail(visitorId)
      .then((res) => {
        if (res.data.sent) setStatus('sent')
        else setStatus('error')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
      style={{ background: 'linear-gradient(180deg, #0a0118 0%, #1a0533 100%)' }}>
      <CosmicBackground />
      <div className="relative z-10 w-full max-w-md text-center">

        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-8xl mb-6"
        >
          {status === 'sending' ? '📡' : status === 'sent' ? '✉️' : '⚠️'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl text-yellow-400 tracking-widest mb-6"
        >
          {status === 'sending' ? 'TRANSMITTING...'
            : status === 'sent' ? 'PASSPORT DELIVERED!'
            : 'TRANSMISSION FAILED'}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="rounded-2xl border border-purple-500/30 bg-black/40 backdrop-blur-md p-6 mb-8"
        >
          {status === 'sent' && (
            <p className="text-purple-100 text-sm leading-relaxed">
              Your cosmic passport has been sent to{' '}
              <span className="text-yellow-400 font-display">{visitor?.email}</span>.
              <br /><br />
              Check your inbox — your complete cosmic identity awaits.
            </p>
          )}
          {status === 'error' && (
            <p className="text-purple-100 text-sm leading-relaxed">
              Email could not be delivered right now.
              <br /><br />
              Your passport is saved and accessible via your QR code.
            </p>
          )}
          {status === 'sending' && (
            <p className="text-purple-300 text-sm">
              Sending your cosmic passport across the digital cosmos...
            </p>
          )}
        </motion.div>

        {status !== 'sending' && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/share')}
            className="px-10 py-3 text-white font-display tracking-widest rounded-full uppercase"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
          >
            Share Your Journey →
          </motion.button>
        )}
      </div>
    </div>
  )
}