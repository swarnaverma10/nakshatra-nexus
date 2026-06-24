import { motion } from 'framer-motion'

export default function LoadingConstellation({ text = 'Reading the cosmos...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="relative w-20 h-20">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-yellow-400"
            style={{
              top: '50%', left: '50%',
              x: Math.cos((i / 5) * Math.PI * 2) * 36 - 6,
              y: Math.sin((i / 5) * Math.PI * 2) * 36 - 6,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
        <motion.div
          className="absolute inset-0 rounded-full border border-purple-500/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <p className="text-purple-300 font-body text-sm tracking-widest uppercase">{text}</p>
    </div>
  )
}
