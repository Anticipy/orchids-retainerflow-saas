"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import Image from "next/image"

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
      setError("Invalid or expired link. Please request a new password reset.")
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
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push("/dashboard"), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 70%)" }}
      />

      <Card className="w-full max-w-md relative z-10" style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
      }}>
        <CardHeader className="text-center space-y-2 pb-6">
          <Link href="/" className="flex items-center justify-center gap-2.5 mb-3 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="Retallio" width={28} height={28} className="w-7 h-7 object-contain" />
            <span className="text-xl font-bold tracking-tight text-white">Retallio</span>
          </Link>
          <CardTitle className="text-2xl font-bold text-white">Set new password</CardTitle>
          <CardDescription className="text-white/40">
            Choose a new password for your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!ready ? (
            <div className="py-6 text-center text-white/30 text-sm">Checking your reset link...</div>
          ) : success ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle className="h-7 w-7 text-emerald-400" />
              </div>
              <p className="text-sm text-white/50">Password updated. Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-white/60 text-sm">New password</Label>
                <Input
                  id="password" type="password" placeholder="At least 6 characters"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-white/20 focus-visible:ring-indigo-500"
                  required minLength={6}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm" className="text-white/60 text-sm">Confirm password</Label>
                <Input
                  id="confirm" type="password" placeholder="Confirm new password"
                  value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-white/20 focus-visible:ring-indigo-500"
                  required minLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                style={{ boxShadow: "0 0 24px rgba(99,102,241,0.3)" }}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update password"}
              </Button>
            </form>
          )}
        </CardContent>

        {ready && !success && (
          <CardFooter className="justify-center border-t border-white/[0.06] pt-4">
            <Link href="/login" className="text-sm text-white/30 hover:text-white/60 transition-colors">
              Back to sign in
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}