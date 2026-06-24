import { motion } from 'framer-motion'

export default function RevealCard({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={`relative rounded-2xl border border-purple-500/30 bg-black/40 backdrop-blur-md p-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}
