"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { AuthShell, AuthHeader, AuthBody, AuthFooter, InputField, AuthButton, AuthError } from "@/components/auth-shell"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setReady(true); setError(""); return }
      setError("Invalid or expired link. Please request a new reset.")
      setReady(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) { setReady(true); setError("") }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError("Passwords do not match"); return }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return }
    setLoading(true); setError("")
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true); setLoading(false)
    setTimeout(() => router.push("/dashboard"), 2200)
  }

  return (
    <AuthShell>
      <AuthHeader title="Set new password" subtitle="Choose a new password for your account" />

      <AuthBody>
        {!ready ? (
          <div className="flex items-center justify-center gap-2.5 py-8">
            <Loader2 className="w-4 h-4 text-white/30 animate-spin" />
            <span className="text-[13px] text-white/30">Checking your reset link…</span>
          </div>
        ) : success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4 py-6 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-white mb-1">Password updated</p>
              <p className="text-[13px] text-white/40">Redirecting you to your dashboard…</p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthError message={error} />
            <InputField
              id="password"
              label="New password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={setPassword}
              minLength={6}
              disabled={!!error && !password}
            />
            <InputField
              id="confirm"
              label="Confirm password"
              type="password"
              placeholder="Repeat new password"
              value={confirm}
              onChange={setConfirm}
              minLength={6}
            />
            <AuthButton loading={loading}>
              {loading ? "Updating…" : "Update password"}
            </AuthButton>
          </form>
        )}
      </AuthBody>

      {ready && !success && (
        <AuthFooter>
          <Link href="/login" className="text-[12px] text-white/30 hover:text-white/60 transition-colors">
            ← Back to sign in
          </Link>
        </AuthFooter>
      )}
    </AuthShell>
  )
}