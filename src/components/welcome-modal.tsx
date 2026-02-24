"use client"

/**
 * WelcomeModal
 *
 * Shown exactly once on first login (keyed to localStorage "retallio-welcome-seen").
 * Rich animated experience: hero headline → staggered feature cards → CTA.
 *
 * Usage in dashboard/page.tsx:
 *   <WelcomeModal userName={user.name} />
 *
 * To re-trigger during dev:
 *   localStorage.removeItem("retallio-welcome-seen")
 */

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Users, FileText, Bell, ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"

const STORAGE_KEY = "retallio-welcome-seen"

/* ── Feature cards data ────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Users,
    label: "Client Portal",
    description: "Clients see their hours in real time. No calls. No spreadsheets. No questions.",
    color: "violet",
    delay: 0.55,
  },
  {
    icon: Clock,
    label: "Live Timer",
    description: "Start a timer. Their portal updates instantly. They watch it happen.",
    color: "indigo",
    delay: 0.68,
  },
  {
    icon: FileText,
    label: "Auto-Invoicing",
    description: "Invoices generate on billing day — base hours plus overages, automatically.",
    color: "purple",
    delay: 0.81,
  },
  {
    icon: Bell,
    label: "Overage Alerts",
    description: "Automated nudges at 80% and 100%. Your client knows before you have to say anything.",
    color: "fuchsia",
    delay: 0.94,
  },
]

const colorMap: Record<string, { bg: string; border: string; icon: string; glow: string }> = {
  violet:  { bg: "rgba(139,92,246,0.08)",  border: "rgba(139,92,246,0.18)",  icon: "#a78bfa", glow: "rgba(139,92,246,0.15)" },
  indigo:  { bg: "rgba(99,102,241,0.08)",  border: "rgba(99,102,241,0.18)",  icon: "#818cf8", glow: "rgba(99,102,241,0.15)" },
  purple:  { bg: "rgba(168,85,247,0.08)",  border: "rgba(168,85,247,0.18)",  icon: "#c084fc", glow: "rgba(168,85,247,0.15)" },
  fuchsia: { bg: "rgba(217,70,239,0.08)",  border: "rgba(217,70,239,0.18)",  icon: "#e879f9", glow: "rgba(217,70,239,0.15)" },
}

/* ── Animated bloom behind the hero text ───────────────────────────── */
function ModalBloom() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
      {/* Base glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, ease: [0.06, 0.6, 0.2, 1] }}
        style={{
          position: "absolute",
          top: "-20%", left: "10%", right: "10%",
          height: "55%",
          background: "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(109,40,217,0.55) 0%, rgba(91,33,182,0.25) 50%, transparent 75%)",
          filter: "blur(2px)",
        }}
      />
      {/* Breathing ambient */}
      <motion.div
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: 0, left: "20%", right: "20%",
          height: "40%",
          background: "radial-gradient(ellipse 60% 80% at 50% 30%, rgba(139,92,246,0.22) 0%, transparent 70%)",
          filter: "blur(32px)",
        }}
      />
      {/* Left shaft */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: 0, transformOrigin: "50% 30%" }}
      >
        <div style={{
          position: "absolute",
          top: "-5%", left: "-10%",
          width: "50%", height: "65%",
          background: "radial-gradient(ellipse 35% 80% at 40% 55%, rgba(167,139,250,0.45) 0%, transparent 70%)",
          filter: "blur(1px)",
          transform: "rotate(-18deg) scaleX(0.65)",
          transformOrigin: "50% 100%",
        }} />
      </motion.div>
      {/* Right shaft */}
      <motion.div
        animate={{ rotate: [120, 480] }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: 0, transformOrigin: "50% 30%" }}
      >
        <div style={{
          position: "absolute",
          top: "-5%", right: "-10%",
          width: "50%", height: "65%",
          background: "radial-gradient(ellipse 35% 80% at 60% 55%, rgba(124,58,237,0.40) 0%, transparent 70%)",
          filter: "blur(1px)",
          transform: "rotate(18deg) scaleX(0.65)",
          transformOrigin: "50% 100%",
        }} />
      </motion.div>
      {/* Dark center mask so text stays crisp */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 55% 40% at 50% 28%, rgba(0,0,0,0.50) 0%, transparent 70%)",
      }} />
      {/* Edge vignette */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "inherit",
        background: [
          "linear-gradient(to bottom, rgba(0,0,0,0.0) 35%, rgba(5,5,5,0.98) 75%)",
          "linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 15%)",
          "linear-gradient(to left,  rgba(0,0,0,0.55) 0%, transparent 15%)",
        ].join(", "),
      }} />
    </div>
  )
}

/* ── Feature card ───────────────────────────────────────────────────── */
function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const Icon = feature.icon
  const c = colorMap[feature.color]
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: feature.delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-4 cursor-default overflow-hidden transition-all duration-300"
      style={{
        background: hovered ? c.bg : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? c.border : "rgba(255,255,255,0.07)"}`,
        boxShadow: hovered ? `0 0 32px ${c.glow}` : "none",
      }}
    >
      {/* Card glow on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${c.glow} 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex items-start gap-3">
        {/* Icon bubble */}
        <motion.div
          animate={hovered ? { scale: 1.08 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: c.bg,
            border: `1px solid ${c.border}`,
          }}
        >
          <Icon className="w-4 h-4" style={{ color: c.icon }} />
        </motion.div>

        <div className="min-w-0 pt-0.5">
          <p className="text-[13px] font-semibold text-white leading-tight mb-1">{feature.label}</p>
          <p className="text-[12px] text-white/38 leading-relaxed">{feature.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Main modal ─────────────────────────────────────────────────────── */
interface WelcomeModalProps {
  userName?: string
}

export default function WelcomeModal({ userName }: WelcomeModalProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Small delay so the dashboard itself renders first
    const t = setTimeout(() => {
      const seen = localStorage.getItem(STORAGE_KEY)
      if (!seen) setVisible(true)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true")
    setVisible(false)
  }

  const firstName = userName?.split(" ")[0] ?? "there"

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={dismiss}
            className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-[560px] rounded-3xl overflow-hidden pointer-events-auto"
              style={{
                background: "#050505",
                border: "1px solid rgba(139,92,246,0.22)",
                boxShadow: [
                  "0 48px 120px rgba(0,0,0,0.85)",
                  "0 0 0 1px rgba(139,92,246,0.12)",
                  "0 0 80px rgba(109,40,217,0.20)",
                ].join(", "),
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalBloom />

              {/* ── Hero section ── */}
              <div className="relative z-10 px-8 pt-10 pb-6 text-center">
                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="w-12 h-12 rounded-2xl overflow-hidden mx-auto mb-5 shadow-[0_0_32px_rgba(139,92,246,0.35)]"
                  style={{ border: "1px solid rgba(139,92,246,0.30)" }}
                >
                  <Image src="/logo.png" alt="Retallio" width={48} height={48} className="object-contain" />
                </motion.div>

                {/* Welcome pill */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.22 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
                  style={{
                    background: "rgba(139,92,246,0.12)",
                    border: "1px solid rgba(139,92,246,0.22)",
                  }}
                >
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  <span className="text-[11px] font-semibold text-violet-300 tracking-wide">Welcome to Retallio</span>
                </motion.div>

                {/* Headline */}
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.30, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[28px] font-bold tracking-tight text-white leading-[1.1] mb-3"
                  style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
                >
                  Hey {firstName}, glad<br />you're here.
                </motion.h2>

                {/* Subtext */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.40 }}
                  className="text-[14px] text-white/40 leading-relaxed max-w-[360px] mx-auto"
                >
                  Here's what Retallio does — and how it's going to change the way you work with retainer clients.
                </motion.p>
              </div>

              {/* ── Feature cards ── */}
              <div className="relative z-10 px-6 pb-6 grid grid-cols-2 gap-2.5">
                {FEATURES.map((f, i) => (
                  <FeatureCard key={f.label} feature={f} index={i} />
                ))}
              </div>

              {/* ── Footer CTA ── */}
              <div className="relative z-10 px-6 pb-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.10 }}
                  className="flex flex-col items-center gap-3"
                >
                  {/* Divider */}
                  <div className="w-full h-px bg-white/[0.06] mb-1" />

                  <motion.button
                    onClick={dismiss}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 h-11 px-8 rounded-2xl bg-white text-black text-[14px] font-bold cursor-pointer hover:bg-white/90 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.12)]"
                  >
                    Let's go
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <p className="text-[11px] text-white/20">
                    Start by adding your first retainer client
                  </p>
                </motion.div>
              </div>

              {/* Grain overlay — matches landing page */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none rounded-3xl opacity-[0.025] mix-blend-screen"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundSize: "200px 200px",
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}