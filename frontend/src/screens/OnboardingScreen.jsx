import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import useVisitorStore from "../store/useVisitorStore"
import { createVisitor } from "../services/api"
import portalImg from "../assets/portal1.jpg"

export default function OnboardingScreen() {
  const navigate = useNavigate()
  const { setVisitorId, setVisitor } = useVisitorStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [transitioning, setTransitioning] = useState(false)
  const [form, setForm] = useState({ full_name:"", email:"", date_of_birth:"", place_of_birth:"" })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await createVisitor({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        date_of_birth: form.date_of_birth,
        time_of_birth: "12:00:00",
        place_of_birth: form.place_of_birth.trim(),
        latitude: 20.5937,
        longitude: 78.9629,
        timezone: "Asia/Kolkata",
      })
      setVisitorId(res.data.id)
      setVisitor(res.data)
      setTransitioning(true)
      setTimeout(() => navigate("/selfie"), 900)
    } catch (err) {
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) setError(detail[0]?.msg || "Stellar alignment failed.")
      else if (typeof detail === "string") setError(detail)
      else setError("Something went wrong. Please check your connection.")
      setLoading(false)
    }
  }

  const particles = useMemo(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 3 + 1, dur: Math.random() * 4 + 3,
      delay: Math.random() * 3,
      color: ["#fbbf24","#c084fc","#a78bfa","#ec4899"][Math.floor(Math.random() * 4)]
    })), [])

  return (
    <>
      <style>{`
        input:-webkit-autofill,input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,input:-webkit-autofill:active {
          transition: background-color 9999s ease-in-out 0s;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.8) sepia(1) saturate(2) hue-rotate(200deg);
          opacity: 0.6; cursor: pointer;
        }
        input::placeholder { color: rgba(167,139,250,0.5); }
        input:focus { outline: none; }
      `}</style>

      <AnimatePresence>
        {transitioning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-[#050010] flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 20], opacity: [0, 1, 0] }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full"
              style={{ background: "radial-gradient(circle, #facc15, #7c3aed, transparent)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 overflow-hidden">

        {/* Full screen background image */}
        <img src={portalImg} alt="Cosmic Portal"
          className="absolute inset-0 w-full h-full object-cover" />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(5,1,14,0.82) 0%, rgba(10,2,30,0.65) 50%, rgba(5,1,14,0.75) 100%)" }} />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map(p => (
            <motion.div key={p.id} className="absolute rounded-full"
              style={{ width: p.size, height: p.size, background: p.color,
                left: `${p.x}%`, top: `${p.y}%`, boxShadow: `0 0 6px ${p.color}` }}
              animate={{ y: [0, -50], opacity: [0, 0.8, 0] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }} />
          ))}
        </div>

        {/* Center form */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">

          {/* Branding */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.span className="text-yellow-400" animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>✦</motion.span>
              <span className="font-display text-yellow-400 text-[11px] tracking-[0.4em] uppercase">
                NAKSHATRA NEXUS
              </span>
              <span className="text-yellow-400">✦</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-yellow-400 tracking-[0.15em] leading-tight"
              style={{ textShadow: "0 0 40px rgba(250,204,21,0.5)" }}>
              COSMIC PORTAL
            </h1>
            <p className="text-purple-300/70 text-xs tracking-[0.3em] uppercase mt-2">
              Enter Your Cosmic Details
            </p>
          </motion.div>

          {/* Glass form card */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md rounded-2xl p-7 border border-yellow-500/20"
            style={{
              background: "rgba(5,1,14,0.80)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 60px rgba(124,58,237,0.2), 0 0 120px rgba(124,58,237,0.08), inset 0 0 40px rgba(0,0,0,0.3)",
            }}>

            {/* Gold top accent */}
            <div className="h-px w-full mb-6"
              style={{ background: "linear-gradient(to right, transparent, #facc15, transparent)" }} />

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">

              {[
                { name:"full_name",    placeholder:"Full Name",      type:"text"  },
                { name:"email",        placeholder:"Email Address",   type:"email" },
                { name:"place_of_birth",placeholder:"Place of Birth", type:"text"  },
              ].map(f => (
                <div key={f.name}
                  className="flex items-center rounded-xl px-4 py-3 border transition-all duration-300 focus-within:border-yellow-400 focus-within:shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                  style={{ background: "rgba(5,1,14,0.9)", borderColor: "rgba(250,204,21,0.2)" }}>
                  <input type={f.type} name={f.name} value={form[f.name]}
                    onChange={handleChange} placeholder={f.placeholder}
                    required autoComplete="off" onFocus={(e) => e.target.removeAttribute("readonly")} readOnly
                    style={{ background:"transparent", color:"#fff", border:"none",
                      outline:"none", width:"100%", fontSize:"14px", fontFamily:"inherit" }} />
                </div>
              ))}

              <div className="flex items-center rounded-xl px-4 py-3 border transition-all duration-300 focus-within:border-yellow-400 focus-within:shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                style={{ background: "rgba(5,1,14,0.9)", borderColor: "rgba(250,204,21,0.2)" }}>
                <input type="date" name="date_of_birth" value={form.date_of_birth}
                  onChange={handleChange} required
                  style={{ background:"transparent", border:"none", outline:"none",
                    width:"100%", fontSize:"14px", fontFamily:"inherit", colorScheme:"dark",
                    color: form.date_of_birth ? "#fff" : "rgba(167,139,250,0.5)" }} />
              </div>

              {error && (
                <motion.p initial={{ opacity:0, y:-5 }} animate={{ opacity:1, y:0 }}
                  className="text-pink-400 text-xs px-1">{error}</motion.p>
              )}

              <div className="pt-2">
                <motion.button type="submit"
                  whileHover={{ scale:1.02, boxShadow:"0 0 35px rgba(250,204,21,0.4)" }}
                  whileTap={{ scale:0.97 }} disabled={loading || transitioning}
                  className="w-full py-4 text-white font-display text-xs rounded-xl tracking-[0.25em] uppercase disabled:opacity-60 transition-all"
                  style={{ background:"linear-gradient(135deg, #7c3aed, #ec4899, #f59e0b)" }}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span animate={{ rotate:360 }}
                        transition={{ duration:1, repeat:Infinity, ease:"linear" }}>✦</motion.span>
                      Activating Portal...
                    </span>
                  ) : "BEGIN MY COSMIC JOURNEY"}
                </motion.button>
              </div>
            </form>

            <div className="h-px w-full mt-6"
              style={{ background: "linear-gradient(to right, transparent, rgba(124,58,237,0.5), transparent)" }} />
          </motion.div>

          <p className="text-purple-600/50 text-[10px] text-center mt-5 tracking-[0.2em] uppercase">
            Powered by Vedic Astrology &amp; AI
          </p>
        </div>
      </div>
    </>
  )
}
