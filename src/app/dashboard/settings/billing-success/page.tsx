"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"

function BillingSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    if (!sessionId) { setStatus("error"); return }
    const t = setTimeout(() => setStatus("success"), 1500)
    return () => clearTimeout(t)
  }, [sessionId])

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
        <p className="text-[14px] text-white/40">Confirming your subscription…</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <div className="w-full max-w-sm rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden">
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-400/10 border border-red-400/20 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-white mb-1">Something went wrong</p>
              <p className="text-[13px] text-white/35">Please check your settings page to verify your subscription.</p>
            </div>
            <Link href="/dashboard/settings">
              <motion.span
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center h-9 px-5 rounded-xl bg-white text-black text-[13px] font-semibold cursor-pointer hover:bg-white/90 transition-colors"
              >
                Back to settings
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden"
      >
        {/* Glow */}
        <div className="relative">
          <div
            className="absolute inset-x-0 top-0 h-32 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.15) 0%, transparent 70%)" }}
          />
          <div className="relative p-8 text-center space-y-5">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            </motion.div>

            <div>
              <h1 className="text-[20px] font-bold text-white tracking-tight mb-1">Subscription active!</h1>
              <p className="text-[13px] text-white/35 leading-relaxed">
                Your plan has been upgraded. You now have access to all features in your new plan.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Link href="/dashboard" className="flex-1">
                <motion.span
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center h-9 rounded-xl bg-white text-black text-[13px] font-semibold cursor-pointer hover:bg-white/90 transition-colors"
                >
                  Go to dashboard
                </motion.span>
              </Link>
              <Link href="/dashboard/settings" className="flex-1">
                <motion.span
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center h-9 rounded-xl border border-white/[0.09] bg-white/[0.04] text-[13px] font-medium text-white/50 hover:text-white hover:bg-white/[0.07] transition-all cursor-pointer"
                >
                  View settings
                </motion.span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    }>
      <BillingSuccessContent />
    </Suspense>
  )
}