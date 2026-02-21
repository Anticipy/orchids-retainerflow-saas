"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
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
          <CardTitle className="text-2xl font-bold text-white">Reset password</CardTitle>
          <CardDescription className="text-white/40">
            Enter your email and we&apos;ll send you a reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-white/60 leading-relaxed">
                  Check your inbox for <strong className="text-white">{email}</strong>.<br />
                  Click the link to set a new password.
                </p>
              </div>
              <p className="text-xs text-white/25">
                Didn&apos;t get it? Check spam or{" "}
                <button type="button" onClick={() => { setSent(false); setError("") }} className="text-indigo-400 hover:text-indigo-300">
                  try again
                </button>
              </p>
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
                <Label htmlFor="email" className="text-white/60 text-sm">Email</Label>
                <Input
                  id="email" type="email" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-white/20 focus-visible:ring-indigo-500"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                style={{ boxShadow: "0 0 24px rgba(99,102,241,0.3)" }}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="justify-center border-t border-white/[0.06] pt-4">
          <Link href="/login" className="text-sm text-white/30 hover:text-white/60 transition-colors">
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}