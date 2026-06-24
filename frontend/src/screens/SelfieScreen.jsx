import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import CosmicBackground from '../components/cosmic/CosmicBackground'
import useVisitorStore from '../store/useVisitorStore'
import { uploadSelfie } from '../services/api'

export default function SelfieScreen() {
  const navigate = useNavigate()
  const { visitorId, setSelfieUrl } = useVisitorStore()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [captured, setCaptured] = useState(false)
  const [previewSrc, setPreviewSrc] = useState(null)
  const [capturedBlob, setCapturedBlob] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 640 },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch {
      setError('Camera access denied. Please allow camera permission.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  const capture = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    // Guard: video must have loaded dimensions
    const vw = video.videoWidth || video.clientWidth
    const vh = video.videoHeight || video.clientHeight
    if (!vw || !vh) {
      setError('Camera not ready yet. Please wait a moment and try again.')
      return
    }

    const size = Math.min(vw, vh)
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext('2d')
    // Mirror the image to match the mirrored live preview
    ctx.save()
    ctx.translate(size, 0)
    ctx.scale(-1, 1)
    const offsetX = (vw - size) / 2
    const offsetY = (vh - size) / 2
    ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, size, size)
    ctx.restore()

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setPreviewSrc(dataUrl)

    canvas.toBlob((blob) => {
      if (blob && blob.size > 0) {
        setCapturedBlob(blob)
      } else {
        setError('Capture failed — please retake.')
      }
    }, 'image/jpeg', 0.92)

    stopCamera()
    setCaptured(true)
  }, [])

  const retake = () => {
    setCaptured(false)
    setPreviewSrc(null)
    setCapturedBlob(null)
    setError('')
    startCamera()
  }

  const handleUse = async () => {
    if (!capturedBlob || !visitorId) return
    setLoading(true)
    setError('')
    try {
      const file = new File([capturedBlob], 'selfie.jpg', { type: 'image/jpeg' })
      const res = await uploadSelfie(visitorId, file)
      setSelfieUrl(res.data.selfie_url)
      navigate('/processing')
    } catch {
      setError('Upload failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0118 0%, #1a0533 100%)' }}>
      <CosmicBackground />
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <span className="text-yellow-400 text-2xl">✦</span>
          <h1 className="font-display text-3xl text-yellow-400 tracking-widest mt-1">COSMIC SELFIE</h1>
          <p className="text-purple-300 text-sm mt-1">
            {captured ? '✨ Looking cosmic! Use this photo?' : 'Position your face in the cosmic frame'}
          </p>
        </motion.div>

        {/* Circle frame */}
        <div className="relative w-72 h-72">
          <div className="absolute inset-0 rounded-full"
            style={{ background: 'conic-gradient(from 0deg, #facc15, #7c3aed, #ec4899, #facc15)', padding: 3 }}>
            <div className="w-full h-full rounded-full" style={{ background: '#0a0118' }} />
          </div>

          <div className="absolute inset-1 rounded-full overflow-hidden">
            {!captured ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
            ) : previewSrc ? (
              <img src={previewSrc} alt="captured" className="w-full h-full object-cover" />
            ) : null}
          </div>

          {/* Scan line animation */}
          {!captured && (
            <motion.div
              className="absolute left-2 right-2 h-0.5 rounded"
              style={{ background: 'rgba(250,204,21,0.6)', top: '50%' }}
              animate={{ top: ['20%', '80%', '20%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </div>

        {error && <p className="text-pink-400 text-sm">{error}</p>}

        <AnimatePresence mode="wait">
          {!captured ? (
            <motion.button
              key="capture"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={capture}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(circle, #facc15, #f59e0b)' }}>
                <div className="w-10 h-10 rounded-full border-2 border-yellow-900/50" />
              </div>
              <span className="text-yellow-400 text-xs tracking-widest font-display">TAP TO CAPTURE</span>
            </motion.button>
          ) : (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={retake}
                className="px-6 py-3 border border-purple-500/50 text-purple-300 font-display text-sm rounded-full tracking-widest"
              >
                ↩ Retake
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleUse}
                disabled={loading}
                className="px-8 py-3 font-display text-sm rounded-full tracking-widest text-white disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
              >
                {loading ? 'Uploading...' : 'USE THIS ✦'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}