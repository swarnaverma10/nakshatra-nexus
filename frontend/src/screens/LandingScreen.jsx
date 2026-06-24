import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import portalImg from "../assets/portal2.jpeg"

function StarField() {
  const stars = useMemo(() => Array.from({ length: 90 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, delay: Math.random() * 5,
    duration: Math.random() * 4 + 3,
  })), [])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map(s => (
        <motion.div key={s.id} className="absolute rounded-full bg-white"
          style={{ left: s.x + "%", top: s.y + "%", width: s.size, height: s.size }}
          animate={{ opacity: [0.1, 0.85, 0.1], scale: [1, 1.4, 1] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </div>
  )
}

export default function LandingScreen() {
  const navigate = useNavigate()
  const [burst, setBurst] = useState([])
  const [leaving, setLeaving] = useState(false)

  const handleBegin = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setBurst(Array.from({ length: 24 }, (_, i) => ({
      id: i, cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2,
      angle: (i / 24) * 360,
    })))
    setLeaving(true)
    setTimeout(() => navigate("/onboarding"), 900)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06010f]">

      {/* Full-screen hero background */}
      <div className="absolute inset-0 z-0">
        <img
          src={portalImg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,1,15,0.55) 0%, rgba(6,1,15,0.75) 55%, rgba(6,1,15,0.95) 100%)",
          }}
        />
      </div>

      <StarField />

      {/* Ambient glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0"
        style={{ width: 700, height: 700, background: "radial-gradient(circle,rgba(124,58,237,0.12) 0%,rgba(236,72,153,0.06) 50%,transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Burst particles */}
      <AnimatePresence>
        {burst.map(p => (
          <motion.div key={p.id} className="fixed rounded-full pointer-events-none z-50"
            style={{ left: p.cx, top: p.cy, width: 8, height: 8, background: "#facc15", boxShadow: "0 0 10px #facc15" }}
            animate={{ x: Math.cos((p.angle * Math.PI) / 180) * 150, y: Math.sin((p.angle * Math.PI) / 180) * 150, opacity: [1, 0], scale: [1, 0] }}
            transition={{ duration: 0.8, ease: "easeOut" }} />
        ))}
      </AnimatePresence>

      {/* Page leave overlay */}
      <AnimatePresence>
        {leaving && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-[#06010f] flex items-center justify-center">
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 2, 20], opacity: [0, 1, 0] }}
              transition={{ duration: 0.9 }}
              style={{ width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,#facc15,#7c3aed,transparent)" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CENTERED CONTENT */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">

        <motion.div
          className="max-w-xl w-full flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
        >
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.span className="text-yellow-400 text-xl" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>✦</motion.span>
              <span className="font-display text-yellow-400 text-[11px] tracking-[0.4em] uppercase">Nakshatra Nexus</span>
              <span className="text-yellow-400 text-xl">✦</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl text-yellow-400 tracking-[0.1em] leading-[1.05] uppercase mb-4"
              style={{ textShadow: "0 0 60px rgba(250,204,21,0.4),0 0 120px rgba(250,204,21,0.15)" }}>
              WHERE STARS<br />REVEAL YOUR<br />DESTINY
            </h1>

            <div className="h-px mb-4 mx-auto w-2/3" style={{ background: "linear-gradient(to right,transparent,#facc15,#ec4899,transparent)" }} />

            <p className="text-purple-200/85 text-sm leading-relaxed tracking-wide max-w-sm mx-auto">
              AI-powered cosmic identity experience through Vedic Astrology, Nakshatra & Spirit guidance.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8 w-full">
            {[
              { icon: "🪐", label: "Zodiac Reading" },
              { icon: "🌙", label: "Nakshatra Reveal" },
              { icon: "✨", label: "Aura Discovery" },
              { icon: "🦁", label: "Spirit Animal" },
              { icon: "🔮", label: "Destiny Vault" },
              { icon: "🎭", label: "Cosmic Archetype" },
            ].map(({ icon, label }) => (
              <motion.div key={label} whileHover={{ scale: 1.04, borderColor: "rgba(250,204,21,0.4)" }}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border transition-all"
                style={{ background: "rgba(124,58,237,0.10)", borderColor: "rgba(124,58,237,0.25)" }}>
                <span className="text-base">{icon}</span>
                <span className="text-purple-200 text-[11px] tracking-wider">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="w-full">
            <motion.button onClick={handleBegin}
              whileHover={{ scale: 1.03, boxShadow: "0 0 50px rgba(250,204,21,0.4),0 0 100px rgba(124,58,237,0.2)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-5 rounded-2xl text-white font-display text-xs tracking-[0.3em] uppercase font-semibold relative overflow-hidden"
              style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899,#f59e0b)", boxShadow: "0 0 30px rgba(124,58,237,0.3)" }}>
              ✦ BEGIN MY COSMIC JOURNEY ✦
            </motion.button>

            <p className="text-center text-purple-300/60 text-[10px] tracking-[0.3em] uppercase mt-4">
              Powered by Vedic Astrology & AI
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
