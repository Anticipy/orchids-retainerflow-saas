"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, BarChart2, Users, Clock, Settings, Menu, X,
  LogOut, User, ChevronDown, FileText,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

/* ── Nav items — Invoices restored ─────────────────────────────────── */
const NAV = [
  { href: "/dashboard",           label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/clients",   label: "Clients",   icon: Users },
  { href: "/dashboard/time",      label: "Time",      icon: Clock },
  { href: "/dashboard/invoices",  label: "Invoices",  icon: FileText },
  { href: "/dashboard/settings",  label: "Settings",  icon: Settings },
]

/* ── Timer helpers ──────────────────────────────────────────────────── */
function useTick(startedAt: string | null) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!startedAt) { setElapsed(0); return }
    const tick = () => setElapsed(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startedAt])
  return elapsed
}

function fmt(s: number) {
  const h = Math.floor(s / 3600).toString().padStart(2, "0")
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0")
  const sec = (s % 60).toString().padStart(2, "0")
  return `${h}:${m}:${sec}`
}

function RunningTimerBadge({ startedAt, clientName }: { startedAt: string; clientName?: string }) {
  const elapsed = useTick(startedAt)
  return (
    <Link href="/dashboard/time" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/15 transition-all">
      <span className="relative flex-shrink-0 w-2 h-2">
        <span className="absolute inset-0 rounded-full bg-violet-400 animate-ping opacity-70" />
        <span className="relative block w-2 h-2 rounded-full bg-violet-400" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-mono font-semibold text-violet-300 leading-none tabular-nums">{fmt(elapsed)}</p>
        {clientName && <p className="text-[10px] text-violet-400/60 truncate mt-0.5 leading-none">{clientName}</p>}
      </div>
    </Link>
  )
}

/* ── Nav item ───────────────────────────────────────────────────────── */
function NavItem({ item, active }: { item: typeof NAV[0]; active: boolean }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
        active
          ? "bg-violet-500/10 text-violet-300 border border-violet-500/20"
          : "text-white/40 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
      }`}
    >
      {active && (
        <motion.div
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-xl bg-violet-500/10"
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
      <Icon className={`w-4 h-4 flex-shrink-0 relative z-10 ${active ? "text-violet-400" : ""}`} />
      <span className="relative z-10">{item.label}</span>
    </Link>
  )
}

/* ── User menu ──────────────────────────────────────────────────────── */
function UserMenu({ user }: { user: { name: string; email: string } }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 h-9 px-2.5 rounded-xl border border-white/[0.08] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all group"
      >
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
          style={{ background: "rgba(167,139,250,0.14)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.22)" }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-[13px] font-medium text-white/60 group-hover:text-white/80 transition-colors hidden sm:block max-w-[120px] truncate">
          {user.name}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-full mt-2 z-50 w-56 rounded-2xl border border-white/[0.09] bg-[#0c0c0c] shadow-[0_24px_60px_rgba(0,0,0,0.7)] overflow-hidden"
            >
              <div className="px-4 py-3.5 border-b border-white/[0.06]">
                <p className="text-[13px] font-semibold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-white/30 truncate mt-0.5">{user.email}</p>
              </div>
              <div className="p-1.5">
                <Link href="/dashboard/settings" onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-white/50 hover:text-white hover:bg-white/[0.05] transition-all"
                >
                  <User className="w-3.5 h-3.5" /> Settings
                </Link>
                <button onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-white/50 hover:text-red-400 hover:bg-red-500/[0.06] transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Top bar ────────────────────────────────────────────────────────── */
// FIX: merged mobile hamburger+logo INTO the top bar so the logo only
// appears once. Previously there were two separate elements both showing
// the logo on mobile — the standalone hamburger bar and the mobile drawer
// header. Now the top bar handles everything: hamburger+logo on the left
// for mobile, notifications+user on the right for all breakpoints.
function TopBar({
  user,
  onMobileOpen,
}: {
  user: { name: string; email: string } | null
  onMobileOpen: () => void
}) {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-[220px] h-14 z-30 flex items-center px-4 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
      {/* Mobile only: hamburger + logo */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={onMobileOpen}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/[0.08] text-white/50 hover:text-white transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md overflow-hidden">
            <Image src="/logo.png" alt="Retallio" width={24} height={24} className="object-contain" />
          </div>
          <span className="text-[14px] font-semibold tracking-tight text-white">Retallio</span>
        </Link>
      </div>

      {/* Pushes user controls to the right */}
      <div className="flex-1" />

      {/* Notifications + user — all breakpoints */}
      {user && (
        <div className="flex items-center gap-3">
          <NotificationsDropdown />
          <div className="w-px h-5 bg-white/[0.08]" />
          <UserMenu user={user} />
        </div>
      )}
    </header>
  )
}

/* ── Layout ─────────────────────────────────────────────────────────── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [activeTimer, setActiveTimer] = useState<{ startedAt: string; clientName?: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "You",
          email: data.user.email || "",
        })
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTimer = useCallback(async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return
    const { data } = await supabase
      .from("time_entries")
      .select("started_at, clients(name)")
      .eq("user_id", authUser.id)
      .is("ended_at", null)
      .limit(1)
      .maybeSingle()
    setActiveTimer(data ? { startedAt: data.started_at, clientName: (data.clients as any)?.name } : null)
  }, [supabase])

  useEffect(() => {
    fetchTimer()
    const id = setInterval(fetchTimer, 30_000)
    return () => clearInterval(id)
  }, [fetchTimer])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-70 transition-opacity">
          <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
            <Image src="/logo.png" alt="Retallio" width={28} height={28} className="object-contain" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">Retallio</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            active={item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)}
          />
        ))}
      </nav>

      <AnimatePresence>
        {activeTimer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="px-3 pb-3"
          >
            <RunningTimerBadge startedAt={activeTimer.startedAt} clientName={activeTimer.clientName} />
          </motion.div>
        )}
      </AnimatePresence>

      {user && (
        <div className="px-4 py-4 border-t border-white/[0.06]">
          <Link href="/dashboard/settings" className="flex items-center gap-3 group">
            <div
              className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[13px] font-bold"
              style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.18)" }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-white/70 group-hover:text-white transition-colors truncate leading-tight">{user.name}</p>
              <p className="text-[11px] text-white/25 truncate leading-tight">{user.email}</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white flex" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <aside className="hidden md:flex flex-col w-[220px] flex-shrink-0 border-r border-white/[0.06] fixed top-0 bottom-0 left-0 z-40 bg-black">
        {sidebar}
      </aside>

      <TopBar user={user} onMobileOpen={() => setMobileOpen(true)} />

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[260px] bg-[#080808] border-r border-white/[0.06] md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                  <Image src="/logo.png" alt="Retallio" width={24} height={24} className="object-contain" />
                  <span className="text-[15px] font-semibold text-white">Retallio</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{sidebar}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 md:ml-[220px] min-h-screen pt-14 overflow-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}