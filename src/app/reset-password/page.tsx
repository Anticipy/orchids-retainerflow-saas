"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, AlertCircle, CheckCircle } from "lucide-react"

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
    const check = () => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setReady(true)
          setError("")
          return
        }
        setError("Invalid or expired link. Please request a new password reset.")
        setReady(true)
      })
    }
    check()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setReady(true)
        setError("")
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push("/dashboard"), 2000)
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
          <CardTitle className="text-2xl font-bold">Set new password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Choose a new password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!ready ? (
            <div className="py-4 text-center text-muted-foreground text-sm">
              Checking your reset link...
            </div>
          ) : success ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22c55e]/20">
                <CheckCircle className="h-6 w-6 text-[#22c55e]" />
              </div>
              <p className="text-sm text-muted-foreground">Password updated. Redirecting to dashboard...</p>
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
                <Label htmlFor="password" className="text-foreground">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-white/20 bg-white/5 focus-visible:ring-primary"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-foreground">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="border-white/20 bg-white/5 focus-visible:ring-primary"
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? "Updating..." : "Update password"}
              </Button>
            </form>
          )}
        </CardContent>
        {ready && !success && (
          <CardFooter className="justify-center border-t border-white/10">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Back to sign in
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
