"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertCircle } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push("/dashboard")
    router.refresh()
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Top indigo glow */}
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
          <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
          <CardDescription className="text-white/40">
            Sign in to manage your retainer clients
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-11 border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white transition-all"
            onClick={handleGoogleLogin}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 text-white/25" style={{ background: "rgba(13,13,26,0.8)" }}>or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
                className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-white/20 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/50"
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white/60 text-sm">Password</Label>
                <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password" type="password" placeholder="Your password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-white/20 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/50"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
              style={{ boxShadow: loading ? "none" : "0 0 24px rgba(99,102,241,0.3)" }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-white/[0.06] pt-4">
          <p className="text-sm text-white/30">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}