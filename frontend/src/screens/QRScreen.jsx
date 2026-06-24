import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CosmicBackground from '../components/cosmic/CosmicBackground'
import RevealCard from '../components/ui/RevealCard'
import LoadingConstellation from '../components/ui/LoadingConstellation'
import useVisitorStore from '../store/useVisitorStore'
import { generateQR } from '../services/api'

export default function QRScreen() {
  const navigate = useNavigate()
  const { visitorId, qrUrl, setQrUrl } = useVisitorStore()
  const [loading, setLoading] = useState(!qrUrl)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (!qrUrl && visitorId) {
      generateQR(visitorId)
        .then((r) => {
          setQrUrl(r.data.qr_url)
          setLoading(false)
        })
        .catch(() => {
          setError('Could not generate QR code.')
          setLoading(false)
        })
    }
  }, [qrUrl, visitorId, setQrUrl])

  const handleDownloadQR = useCallback(async () => {
    if (!qrUrl) return
    setDownloading(true)
    try {
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `cosmic-passport-qr-${visitorId || 'code'}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download QR:', err)
      // Fallback
      window.open(qrUrl, '_blank')
    } finally {
      setDownloading(false)
    }
  }, [qrUrl, visitorId])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 bg-[#050010]">
      <CosmicBackground intensity={1.4} />
      
      <div className="relative z-10 w-full max-w-md text-center flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl text-yellow-400 tracking-[0.2em] mb-8 text-glow-gold"
        >
          COSMIC QR
        </motion.h1>

        {loading ? (
          <LoadingConstellation text="Encoding your cosmic signature..." />
        ) : error ? (
          <>
            <RevealCard delay={0.2} className="mb-6 w-full">
              <p className="text-pink-400 text-sm">{error}</p>
              <p className="text-purple-300 text-xs mt-2 font-body">
                Your cosmic record is still safe. You can continue with your journey.
              </p>
            </RevealCard>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/email-sent')}
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-display tracking-[0.15em] rounded-full uppercase text-sm shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            >
              Continue →
            </motion.button>
          </>
        ) : (
          <>
            <RevealCard delay={0.2} className="mb-8 w-full p-8 flex flex-col items-center relative overflow-hidden">
              {/* Animated corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-400/60" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-400/60" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-400/60" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-400/60" />

              <p className="text-purple-300 text-xs tracking-[0.2em] uppercase mb-6 font-body">
                Your Cosmic Identity Code
              </p>

              {/* Holographic interactive QR view */}
              <div className="relative w-64 h-64 p-3 bg-black/60 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-6">
                
                {/* Rotating Outer Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0%, #db2777 30%, transparent 50%, #facc15 80%, transparent 100%)',
                    padding: '2px'
                  }}
                >
                  <div className="w-full h-full rounded-2xl bg-transparent" />
                </motion.div>

                {/* Cyber pulse border overlay */}
                <motion.div
                  animate={{ scale: [1, 1.03, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-[-4px] rounded-2xl border border-yellow-400/40 pointer-events-none"
                />

                {/* QR Code Image */}
                <motion.img
                  src={qrUrl}
                  alt="QR Code"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, type: 'spring' }}
                  className="w-full h-full rounded-xl object-contain z-10 p-2 bg-white"
                />
              </div>

              <p className="text-yellow-400 text-sm font-semibold tracking-wider font-display mb-1 text-glow-gold">
                SCAN TO ACCESS YOUR COSMIC PASSPORT
              </p>
              <p className="text-purple-300/80 text-xs font-body max-w-[280px]">
                Scan with any device at any point to retrieve your custom reading, passport and high-res avatar.
              </p>
            </RevealCard>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              {/* Download QR Button */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={downloading}
                onClick={handleDownloadQR}
                className="px-6 py-4 bg-purple-900/40 border border-purple-500/50 hover:border-yellow-400/60 text-purple-200 hover:text-yellow-400 font-display tracking-[0.15em] rounded-xl uppercase text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{downloading ? 'Downloading...' : 'Download QR Code'}</span>
                <span>💾</span>
              </motion.button>

              {/* Continue to Email */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(124,58,237,0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/email-sent')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 text-white font-display tracking-[0.15em] rounded-xl uppercase text-xs shadow-[0_0_15px_rgba(124,58,237,0.2)] font-medium"
              >
                Send to Email →
              </motion.button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
