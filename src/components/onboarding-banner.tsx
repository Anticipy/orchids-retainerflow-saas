"use client"

/**
 * OnboardingBanner
 *
 * Shown on the dashboard when the user hasn't dismissed it.
 * Three steps: add client → log first hour → share portal.
 *
 * Step completion:
 *   Step 1 — clientCount > 0
 *   Step 2 — any time entry exists (timer OR manual) → fetched from /api/time-entries?limit=1
 *   Step 3 — clientCount > 0 (portal is auto-shared when client is created)
 *
 * Usage: <OnboardingBanner clientCount={data.activeClients} />
 */

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { X, Users, Clock, ExternalLink, Check } from "lucide-react"

const STORAGE_KEY = "retallio-onboarding-dismissed"

const STEPS = [
  {
    icon: Users,
    title: "Add your first client",
    body: "Set their monthly hours, rate, and billing day.",
    cta: "Add client →",
    href: "/dashboard/clients",
  },
  {
    icon: Clock,
    title: "Log your first hour",
    body: "Start the timer or add an entry manually.",
    cta: "Go to Time →",
    href: "/dashboard/time",
  },
  {
    icon: ExternalLink,
    title: "Share the portal",
    body: "Your client already got an email — they can view their hours live.",
    cta: "View Clients →",
    href: "/dashboard/clients",
  },
]

export default function OnboardingBanner({ clientCount }: { clientCount: number }) {
  const [visible, setVisible] = useState(false)
  const [completed, setCompleted] = useState<boolean[]>([false, false, false])

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (!dismissed) setVisible(true)
  }, [])

  useEffect(() => {
    // Step 1 + 3: based on clientCount (immediately available)
    const hasClient = clientCount > 0

    // Step 2: check for any time entry (timer started or manual entry)
    const checkTimeEntry = async () => {
      try {
        const res = await fetch("/api/time-entries?limit=1")
        if (!res.ok) throw new Error()
        const data = await res.json()
        // Accept either an array of entries, or { entries: [...] } shape
        const entries = Array.isArray(data) ? data : (data.entries ?? data.timeEntries ?? [])
        const hasEntry = entries.length > 0
        setCompleted([hasClient, hasEntry, hasClient])
      } catch {
        // If API call fails, fall back to false for step 2
        setCompleted([hasClient, false, hasClient])
      }
    }

    checkTimeEntry()
  }, [clientCount])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true")
    setVisible(false)
  }

  // Auto-dismiss once all steps are done
  const allDone = completed.every(Boolean)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] overflow-hidden mb-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-violet-500/[0.10]">
            <div>
              <p className="text-[11px] font-semibold text-violet-400/60 uppercase tracking-[0.15em] mb-0.5">
                Getting started
              </p>
              <h3 className="text-[15px] font-bold text-white tracking-tight">
                {allDone ? "You're all set 🎉" : "Set up your first retainer"}
              </h3>
            </div>
            <button
              onClick={dismiss}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/25 hover:text-white hover:bg-white/[0.06] transition-all"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-violet-500/[0.08]">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const done = completed[i]
              return (
                <div key={i} className={`px-5 py-4 transition-opacity duration-300 ${done ? "opacity-50" : ""}`}>
                  <div className="flex items-start gap-3">
                    {/* Icon bubble */}
                    <div className={`
                      w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300
                      ${done
                        ? "bg-emerald-400/10 border border-emerald-400/20"
                        : "bg-white/[0.04] border border-white/[0.08]"}
                    `}>
                      {done
                        ? <Check className="w-4 h-4 text-emerald-400" />
                        : <Icon className="w-4 h-4 text-white/40" />
                      }
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-semibold text-white/20 tabular-nums">0{i + 1}</span>
                        <p className="text-[13px] font-semibold text-white leading-snug">{step.title}</p>
                      </div>
                      <p className="text-[12px] text-white/35 leading-relaxed mb-2.5">{step.body}</p>
                      {done ? (
                        <motion.span
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[12px] font-medium text-emerald-400"
                        >
                          Done ✓
                        </motion.span>
                      ) : (
                        <Link
                          href={step.href}
                          className="text-[12px] font-medium text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          {step.cta}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}