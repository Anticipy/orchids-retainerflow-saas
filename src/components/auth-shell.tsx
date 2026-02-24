/**
 * auth-shell.tsx
 *
 * Shared primitives for all Retallio auth pages.
 * Import AuthShell, InputField, GoogleIcon from here.
 *
 * Usage:
 *   <AuthShell>
 *     <AuthHeader title="Welcome back" subtitle="Sign in to your account" />
 *     <AuthBody>…form…</AuthBody>
 *     <AuthFooter>…link…</AuthFooter>
 *   </AuthShell>
 */
"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

/* ── Outer wrapper: black bg, grain, bloom, centered ─────────────── */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center px-4 py-12 overflow-hidden"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      {/* Grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.032] mix-blend-screen"
        style={{ backgroundImage: GRAIN, backgroundSize: "200px 200px" }}
        aria-hidden
      />

      {/* Bloom */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            marginLeft: -400,
            width: 800,
            height: 500,
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(109,40,217,0.28) 0%, rgba(124,58,237,0.10) 50%, transparent 75%)",
            filter: "blur(1px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[400px]"
      >
        <div
          className="rounded-2xl border border-white/[0.08] overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}

/* ── Logo + title section ────────────────────────────────────────── */
export function AuthHeader({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children?: React.ReactNode
}) {
  return (
    <div className="px-8 pt-8 pb-6 text-center border-b border-white/[0.06]">
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-6 hover:opacity-70 transition-opacity"
      >
        <Image src="/logo.png" alt="Retallio" width={24} height={24} className="object-contain" />
        <span className="text-[15px] font-semibold tracking-tight text-white">Retallio</span>
      </Link>
      <h1 className="text-[22px] font-bold tracking-tight text-white mb-1">{title}</h1>
      {subtitle && <p className="text-[13px] text-white/35">{subtitle}</p>}
      {children}
    </div>
  )
}

/* ── Body (padding wrapper) ──────────────────────────────────────── */
export function AuthBody({ children }: { children: React.ReactNode }) {
  return <div className="px-8 py-6 space-y-4">{children}</div>
}

/* ── Footer link row ─────────────────────────────────────────────── */
export function AuthFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-8 py-4 border-t border-white/[0.06] text-center">
      {children}
    </div>
  )
}

/* ── Input field ─────────────────────────────────────────────────── */
export function InputField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  minLength,
  extra,
  disabled,
}: {
  id: string
  label: string
  type: string
  placeholder: string
  value: string
  onChange?: (v: string) => void
  minLength?: number
  extra?: React.ReactNode
  disabled?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[12px] font-medium text-white/40 uppercase tracking-[0.12em]">
          {label}
        </label>
        {extra}
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required
        minLength={minLength}
        disabled={disabled}
        className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 outline-none transition-all focus:border-violet-500/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
      />
    </div>
  )
}

/* ── Primary action button ───────────────────────────────────────── */
export function AuthButton({
  children,
  loading,
  disabled,
  onClick,
  type = "submit",
}: {
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  type?: "submit" | "button"
}) {
  return (
    <motion.button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      whileHover={loading || disabled ? {} : { scale: 1.01 }}
      whileTap={loading || disabled ? {} : { scale: 0.99 }}
      className="w-full h-11 rounded-xl bg-white text-black text-[14px] font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </motion.button>
  )
}

/* ── Google OAuth button ─────────────────────────────────────────── */
export function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-white/[0.09] bg-white/[0.04] text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/[0.07] hover:border-white/[0.14] transition-all"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      Continue with Google
    </motion.button>
  )
}

/* ── Divider ─────────────────────────────────────────────────────── */
export function AuthDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-white/[0.06]" />
      <span className="text-[11px] text-white/20 uppercase tracking-widest">or</span>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  )
}

/* ── Error banner ────────────────────────────────────────────────── */
export function AuthError({ message }: { message: string }) {
  if (!message) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 text-[13px] text-red-400 bg-red-500/[0.08] border border-red-500/20 px-3.5 py-2.5 rounded-xl"
    >
      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </motion.div>
  )
}

/* ── Success state (icon + message) ─────────────────────────────── */
export function AuthSuccess({
  icon,
  title,
  body,
  children,
}: {
  icon?: React.ReactNode
  title: string
  body?: string
  children?: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-4 py-6 text-center"
    >
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
          {icon}
        </div>
      )}
      <div>
        <p className="text-[15px] font-semibold text-white mb-1">{title}</p>
        {body && <p className="text-[13px] text-white/40 leading-relaxed">{body}</p>}
      </div>
      {children}
    </motion.div>
  )
}