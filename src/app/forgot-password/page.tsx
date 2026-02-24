"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { AuthShell, AuthHeader, AuthBody, AuthFooter, InputField, AuthButton, AuthError } from "@/components/auth-shell"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError("")
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSent(true); setLoading(false)
  }

  return (
    <AuthShell>
      <AuthHeader title="Reset your password" subtitle="Enter your email and we'll send a link" />

      <AuthBody>
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-5 py-4 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-white mb-1">Check your inbox</p>
              <p className="text-[13px] text-white/40 leading-relaxed">
                We sent a reset link to{" "}
                <span className="text-white/70 font-medium">{email}</span>.
              </p>
            </div>
            <div className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-left space-y-1.5">
              <p className="text-[11px] font-semibold text-white/25 uppercase tracking-[0.12em]">Didn't receive it?</p>
              <p className="text-[12px] text-white/35">
                Check spam — comes from <span className="text-white/50">noreply@retallio.app</span>
              </p>
              <button
                type="button"
                onClick={() => { setSent(false); setError("") }}
                className="text-[12px] text-violet-400 hover:text-violet-300 transition-colors"
              >
                Try a different address →
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthError message={error} />
            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
            />
            <AuthButton loading={loading}>
              {loading ? "Sending link…" : "Send reset link"}
            </AuthButton>
          </form>
        )}
      </AuthBody>

      <AuthFooter>
        <Link href="/login" className="text-[12px] text-white/30 hover:text-white/60 transition-colors">
          ← Back to sign in
        </Link>
      </AuthFooter>
    </AuthShell>
  )
}