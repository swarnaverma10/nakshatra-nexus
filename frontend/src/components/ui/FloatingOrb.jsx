import { motion } from 'framer-motion'

export default function FloatingOrb({ color = '#7c3aed', size = 300, blur = 80, className = '' }) {
  return (
    <motion.div
      animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        filter: `blur(${blur}px)`,
        opacity: 0.25,
      }}
    />
  )
}
