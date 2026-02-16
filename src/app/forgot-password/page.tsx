"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, AlertCircle, CheckCircle } from "lucide-react"

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

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      <div className="absolute inset-0 app-grid-bg pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#6366f1]/10 via-transparent to-transparent pointer-events-none" />

      <Card className="w-full max-w-md relative border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <Link href="/" className="flex items-center justify-center gap-2 mb-2 text-foreground hover:opacity-90">
            <Clock className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">Tempo</span>
          </Link>
          <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email and we&apos;ll send you a link to set a new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22c55e]/20">
                <CheckCircle className="h-6 w-6 text-[#22c55e]" />
              </div>
              <p className="text-sm text-muted-foreground">
                Check your inbox for <strong className="text-foreground">{email}</strong>. Click the link to set a new password.
              </p>
              <p className="text-xs text-muted-foreground">
                Didn&apos;t get it? Check spam or{" "}
                <button type="button" onClick={() => { setSent(false); setError(""); }} className="text-primary hover:underline">
                  try again
                </button>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/20 bg-white/5 focus-visible:ring-primary"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center border-t border-white/10">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
