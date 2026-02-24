"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { HeroProductDemo } from "@/components/landing/hero-product-demo";
import { FeatureTimerDemo } from "@/components/landing/feature-timer-demo";
import { FeatureInvoiceDemo } from "@/components/landing/feature-invoice-demo";
import { FeaturePortalDemo } from "@/components/landing/feature-portal-demo";
import { FeatureNotificationDemo } from "@/components/landing/feature-notification-demo";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";

/* ══════════════════════════════════════════════════════════════════════
   HERO BLOOM — Raycast-faithful approach
══════════════════════════════════════════════════════════════════════ */
function HeroBloom({ heroRef }: { heroRef: React.RefObject<HTMLElement | null> }) {
  const [bloomKey, setBloomKey] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setBloomKey((k) => k + 1);
        });
      },
      { threshold: 0.3 }
    );
    const el = heroRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [heroRef]);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 0,
      }}
    >
      <motion.div
        key={bloomKey}
        initial={{ opacity: 0, scale: 0.55 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 4.5, ease: [0.06, 0.6, 0.2, 1] }}
        style={{ position: "absolute", inset: 0, transformOrigin: "50% 65%" }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 85% 70% at 50% 72%, rgba(109,40,217,0.75) 0%, rgba(91,33,182,0.4) 40%, transparent 70%)",
          filter: "blur(2px)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 100% 80% at 50% 60%, rgba(109,40,217,0.22) 0%, transparent 65%)",
          filter: "blur(40px)",
        }} />
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: 0, transformOrigin: "50% 65%" }}
      >
        <div style={{
          position: "absolute",
          top: "-10%", left: "-5%",
          width: "55%", height: "90%",
          background: "radial-gradient(ellipse 38% 85% at 35% 60%, rgba(167,139,250,0.72) 0%, rgba(124,58,237,0.32) 50%, transparent 72%)",
          filter: "blur(1px)",
          transform: "rotate(-22deg) scaleX(0.7)",
          transformOrigin: "50% 100%",
        }} />
      </motion.div>

      <motion.div
        animate={{ rotate: [120, 480] }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: 0, transformOrigin: "50% 65%" }}
      >
        <div style={{
          position: "absolute",
          top: "-10%", right: "-5%",
          width: "55%", height: "90%",
          background: "radial-gradient(ellipse 38% 85% at 65% 60%, rgba(139,92,246,0.65) 0%, rgba(109,40,217,0.28) 50%, transparent 72%)",
          filter: "blur(1px)",
          transform: "rotate(22deg) scaleX(0.7)",
          transformOrigin: "50% 100%",
        }} />
      </motion.div>

      <motion.div
        animate={{ rotate: [240, 600] }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: 0, transformOrigin: "50% 65%" }}
      >
        <div style={{
          position: "absolute",
          top: "15%", left: "50%",
          marginLeft: "-18%",
          width: "36%", height: "80%",
          background: "radial-gradient(ellipse 50% 90% at 50% 75%, rgba(196,181,253,0.85) 0%, rgba(167,139,250,0.50) 35%, rgba(124,58,237,0.18) 65%, transparent 80%)",
          filter: "blur(0.5px)",
          transform: "scaleX(0.55)",
          transformOrigin: "50% 100%",
        }} />
      </motion.div>

      <motion.div
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 55% at 50% 65%, rgba(124,58,237,0.18) 0%, transparent 60%)",
          filter: "blur(48px)",
        }}
      />

      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 60% 45% at 50% 35%, rgba(0,0,0,0.45) 0%, transparent 70%)",
      }} />

      <div style={{
        position: "absolute", inset: 0,
        background: [
          "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 18%)",
          "linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 22%)",
          "linear-gradient(to right, rgba(0,0,0,0.80) 0%, transparent 18%)",
          "linear-gradient(to left, rgba(0,0,0,0.80) 0%, transparent 18%)",
        ].join(", "),
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SHARED SMOOTH SCROLL HELPER
   Extracted so both Navbar links and the hero button can use it.
══════════════════════════════════════════════════════════════════════ */
function smoothScrollTo(id: string, offset = 80) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

/* ══════════════════════════════════════════════════════════════════════
   FLOATING NAVBAR
══════════════════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close menu on scroll
  useEffect(() => {
    if (menuOpen) {
      const fn = () => setMenuOpen(false);
      window.addEventListener("scroll", fn, { passive: true, once: true });
    }
  }, [menuOpen]);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    // slight delay so menu closes before scroll starts
    setTimeout(() => smoothScrollTo(id), 120);
  };

  const NAV_LINKS = [
    { label: "Features", id: "features" },
    { label: "Pricing",  id: "pricing"  },
  ];

  return (
    <div
      className="fixed z-50"
      style={{ top: 20, left: "50%", transform: "translateX(-50%)", width: "min(calc(100vw - 32px), 960px)" }}
    >
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* ── Main bar ── */}
        <div
          className={cn(
            "flex items-center justify-between px-5 py-3.5 rounded-2xl border transition-all duration-500",
            scrolled || menuOpen
              ? "bg-black/90 border-white/[0.09] backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
              : "bg-black/30 border-white/[0.06] backdrop-blur-md",
            menuOpen && "rounded-b-none border-b-white/[0.04]"
          )}
        >
          {/* Logo */}
          <a
            href="/"
            onClick={scrollToTop}
            className="flex items-center gap-2.5 hover:opacity-70 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden">
              <Image src="/logo.png" alt="Retallio" width={32} height={32} className="object-contain" />
            </div>
            <span className="text-[16px] font-semibold tracking-tight text-white">Retallio</span>
          </a>

          {/* Desktop nav — hidden on mobile */}
          <nav className="hidden md:flex items-center">
            {NAV_LINKS.map(({ label, id }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => { e.preventDefault(); smoothScrollTo(id); }}
                className="px-4 py-2 rounded-xl text-[14px] font-medium text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden md:block px-3.5 py-2 text-[14px] font-medium text-white/40 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link href="/signup" className="hidden md:block">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white text-black text-[13px] font-semibold cursor-pointer whitespace-nowrap"
              >
                Get Started
              </motion.span>
            </Link>

            {/* Mobile: Get Started + hamburger */}
            <Link href="/signup" className="md:hidden">
              <motion.span
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white text-black text-[13px] font-semibold cursor-pointer whitespace-nowrap"
              >
                Get Started
              </motion.span>
            </Link>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-xl hover:bg-white/[0.06] transition-colors gap-[5px]"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block w-4.5 h-px bg-white/60 rounded-full origin-center"
                style={{ width: 18 }}
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.15 }}
                className="block h-px bg-white/60 rounded-full"
                style={{ width: 18 }}
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block h-px bg-white/60 rounded-full origin-center"
                style={{ width: 18 }}
              />
            </button>
          </div>
        </div>

        {/* ── Dropdown menu ── */}
        <motion.div
          initial={false}
          animate={menuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden md:hidden"
        >
          <div className="bg-black/90 backdrop-blur-2xl border border-t-0 border-white/[0.09] rounded-b-2xl shadow-[0_16px_40px_rgba(0,0,0,0.7)] px-3 pb-3 pt-1">
            {/* Nav links */}
            {NAV_LINKS.map(({ label, id }, i) => (
              <motion.a
                key={id}
                href={`#${id}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(id); }}
                initial={false}
                animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
                transition={{ delay: menuOpen ? i * 0.05 : 0, duration: 0.2 }}
                className="flex items-center w-full px-3 py-3 rounded-xl text-[15px] font-medium text-white/55 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                {label}
              </motion.a>
            ))}

            {/* Divider */}
            <div className="my-2 border-t border-white/[0.06]" />

            {/* Sign in */}
            <motion.div
              initial={false}
              animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
              transition={{ delay: menuOpen ? 0.1 : 0, duration: 0.2 }}
            >
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center w-full px-3 py-3 rounded-xl text-[15px] font-medium text-white/55 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                Sign in
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.header>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   GRAIN
══════════════════════════════════════════════════════════════════════ */
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ══════════════════════════════════════════════════════════════════════
   CONVERSATION SECTION
══════════════════════════════════════════════════════════════════════ */

const BEFORE_MESSAGES = [
  { from: "client", text: "Hey, got the invoice — can you break down these hours?", time: "2:14 PM" },
  { from: "you",    text: "Sure! Monday was the homepage redesign, Tuesday API work...", time: "2:31 PM" },
  { from: "client", text: "Ok but why does it say 22hrs? I thought we agreed on 20?", time: "2:45 PM" },
  { from: "you",    text: "The extra 2hrs were approved in the Slack thread on Feb 8th", time: "3:02 PM" },
  { from: "client", text: "Hmm, let me check with my team and get back to you", time: "3:18 PM" },
  { from: "you",    text: "No problem 🙂", time: "3:19 PM" },
];

const AFTER_MESSAGES = [
  { from: "system", text: "Invoice #024 sent to Meridian Studio · $2,109", time: "Mar 1" },
  { from: "system", text: "Invoice opened by studio@meridian.co", time: "Mar 1 · 9:41 AM" },
  { from: "system", text: "Payment received · $2,109", time: "Mar 3 · 11:02 AM" },
];

function ChatBubble({
  msg,
  index,
}: {
  msg: { from: string; text: string; time: string };
  index: number;
}) {
  const isYou = msg.from === "you";
  const isSystem = msg.from === "system";

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ delay: index * 0.18, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-center"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] text-white/45 font-medium">{msg.text}</span>
          <span className="text-[10px] text-white/20">{msg.time}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, x: isYou ? 8 : -8 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ delay: index * 0.14, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isYou ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[82%] px-3.5 py-2 rounded-2xl text-[13px] leading-snug ${
          isYou
            ? "bg-violet-600 text-white rounded-br-sm"
            : "bg-white/[0.07] border border-white/[0.09] text-white/75 rounded-bl-sm"
        }`}
      >
        <p>{msg.text}</p>
        <p className={`text-[10px] mt-1 ${isYou ? "text-violet-200/60 text-right" : "text-white/25"}`}>
          {msg.time}
        </p>
      </div>
    </motion.div>
  );
}

function ConversationSection() {
  return (
    <section className="relative z-10 py-24 border-t border-white/[0.05] overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(109,40,217,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.2em] mb-4">
            The difference
          </p>
          <h2 className="text-[clamp(22px,3vw,36px)] font-bold tracking-tight text-white leading-[1.1]">
            Stop having this conversation.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-3.5 py-2.5 border-b border-white/[0.07] bg-white/[0.02]">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[11px] font-medium text-white/35">Meridian Studio · iMessage</span>
              </div>
              <span className="text-[10px] font-semibold text-red-400/70 bg-red-400/10 px-2 py-0.5 rounded-full">Without Retallio</span>
            </div>
            <div className="p-3.5 space-y-2.5 min-h-[260px]">
              {BEFORE_MESSAGES.map((msg, i) => (
                <ChatBubble key={i} msg={msg} index={i} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-3.5 py-2.5 border-b border-violet-500/[0.12] bg-violet-500/[0.03]">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[11px] font-medium text-white/35">Meridian Studio · iMessage</span>
              </div>
              <span className="text-[10px] font-semibold text-violet-300 bg-violet-500/15 px-2 py-0.5 rounded-full">With Retallio</span>
            </div>
            <div className="p-3.5 space-y-2.5 min-h-[260px] flex flex-col">
              {AFTER_MESSAGES.map((msg, i) => (
                <ChatBubble key={i} msg={msg} index={i} />
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex-1 flex flex-col items-center justify-center pb-4 pt-2"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-2.5">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-[12px] font-medium text-white/40 text-center">No questions.</p>
                <p className="text-[11px] text-white/20 text-center">They watched it build all month.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeatureSection({
  label,
  heading,
  body,
  component,
  flip,
  index,
}: {
  label: string;
  heading: string;
  body: string;
  component: React.ReactNode;
  flip: boolean;
  index: number;
}) {
  return (
    <div className="border-t border-white/[0.05] py-32">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div
          className={cn(
            "grid md:grid-cols-2 gap-20 lg:gap-28 items-center",
            flip && "md:[&>*:first-child]:order-2"
          )}
        >
          <motion.div
            initial={{ opacity: 0, x: flip ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] font-semibold text-violet-400/80 uppercase tracking-[0.2em] mb-5">
              {label}
            </p>
            <h2 className="text-[clamp(28px,3.8vw,42px)] font-bold tracking-tight text-white leading-[1.1] mb-5 whitespace-pre-line">
              {heading}
            </h2>
            <p className="text-[15px] text-white/38 leading-relaxed">{body}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: flip ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <div
                className="absolute -inset-8 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(109,40,217,0.14) 0%, transparent 70%)",
                  filter: "blur(24px)",
                }}
              />
              <div className="relative rounded-2xl border border-white/[0.07] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
                {component}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const dashY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>

      {/* Grain */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.032] mix-blend-screen"
        style={{ backgroundImage: GRAIN, backgroundSize: "200px 200px" }}
        aria-hidden
      />

      <Navbar />

      {/* ════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden"
      >
        <HeroBloom heroRef={heroRef} />

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(52px,9vw,104px)] font-bold tracking-[-0.045em] leading-[0.95] text-white mb-7 max-w-[820px]"
          >
            Your clients see
            <br />
            everything.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-[17px] text-white/45 max-w-[440px] leading-relaxed mb-10"
          >
            Time tracking and invoicing where both you
            and your client share the same view.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <Link href="/signup">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-white text-black text-[14px] font-semibold cursor-pointer hover:bg-white/90 transition-colors"
              >
                Start free <ArrowRight className="w-3.5 h-3.5" />
              </motion.span>
            </Link>

            {/* ── Smooth scroll to #features ── */}
            <a
              href="#features"
              onClick={(e) => { e.preventDefault(); smoothScrollTo("features"); }}
              className="inline-flex items-center h-11 px-6 rounded-xl border border-white/[0.10] text-white/50 text-[14px] font-medium hover:text-white hover:border-white/[0.18] transition-all"
            >
              See how it works
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 text-[12px] text-white/40 tracking-wide"
          >
            Free for your first client · No credit card needed
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-transparent via-white/20 to-transparent"
          />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          DASHBOARD
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 pt-0 pb-0 overflow-hidden" style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "center" }}>
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
          style={{ background: "linear-gradient(to bottom, black, transparent)" }}
        />

        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {[
            { x: "8%",  y: "18%", s: 1.5, o: 0.40, d: 0 },
            { x: "15%", y: "55%", s: 1,   o: 0.28, d: 0.3 },
            { x: "6%",  y: "72%", s: 1.2, o: 0.32, d: 0.8 },
            { x: "22%", y: "12%", s: 1,   o: 0.30, d: 0.5 },
            { x: "28%", y: "82%", s: 1.5, o: 0.35, d: 1.1 },
            { x: "38%", y: "8%",  s: 1,   o: 0.28, d: 0.2 },
            { x: "48%", y: "88%", s: 1.2, o: 0.32, d: 0.7 },
            { x: "58%", y: "6%",  s: 1,   o: 0.28, d: 1.4 },
            { x: "62%", y: "90%", s: 1.5, o: 0.38, d: 0.4 },
            { x: "72%", y: "14%", s: 1,   o: 0.28, d: 0.9 },
            { x: "78%", y: "76%", s: 1.2, o: 0.32, d: 0.1 },
            { x: "85%", y: "42%", s: 1,   o: 0.28, d: 1.2 },
            { x: "91%", y: "22%", s: 1.5, o: 0.36, d: 0.6 },
            { x: "94%", y: "65%", s: 1,   o: 0.28, d: 1.0 },
            { x: "32%", y: "48%", s: 1,   o: 0.20, d: 1.5 },
            { x: "68%", y: "52%", s: 1,   o: 0.20, d: 0.8 },
            { x: "4%",  y: "38%", s: 1,   o: 0.25, d: 0.6 },
            { x: "96%", y: "45%", s: 1,   o: 0.25, d: 1.1 },
            { x: "50%", y: "4%",  s: 1.5, o: 0.22, d: 0.9 },
            { x: "18%", y: "92%", s: 1,   o: 0.28, d: 0.3 },
          ].map((dot, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                left: dot.x,
                top: dot.y,
                width: dot.s * 2,
                height: dot.s * 2,
                borderRadius: "50%",
                backgroundColor: "white",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, dot.o, dot.o * 0.6, dot.o] }}
              transition={{
                duration: 3 + i * 0.4,
                delay: dot.d,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <motion.div
          style={{ y: dashY }}
          className="relative w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 py-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10"
          >
            <p className="text-[clamp(18px,2.2vw,26px)] font-semibold tracking-tight text-white/80 leading-snug">
              Both sides of the retainer, one screen.
            </p>
            <p className="text-[14px] text-white/30 mt-2">
              You track. They see. No calls needed.
            </p>
          </motion.div>

          <div
            className="absolute pointer-events-none"
            style={{
              bottom: -40,
              left: "5%",
              right: "5%",
              height: 160,
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(109,40,217,0.55) 0%, rgba(124,58,237,0.20) 50%, transparent 80%)",
              filter: "blur(40px)",
            }}
          />

          <div
            className="absolute pointer-events-none"
            style={{
              top: 80,
              left: "15%",
              right: "15%",
              height: 100,
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.40) 0%, transparent 70%)",
              filter: "blur(24px)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl overflow-hidden bg-[#080808] mx-1 sm:mx-0"
            style={{
              boxShadow: [
                "0 48px 160px rgba(0,0,0,0.90)",
                "0 0 0 1px rgba(139,92,246,0.40)",
                "0 0 80px rgba(109,40,217,0.30)",
                "0 0 160px rgba(109,40,217,0.12)",
                "inset 0 1px 0 rgba(255,255,255,0.08)",
              ].join(", "),
            }}
          >
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-[#040404]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              <div className="mx-auto flex-1 max-w-[240px] h-5 rounded-md bg-white/[0.04] border border-white/[0.05] flex items-center px-2.5 gap-1.5">
                <span className="text-white/20 text-[10px]">🔒</span>
                <span className="text-white/20 text-[10px]">app.retallio.app</span>
              </div>
            </div>

            <HeroProductDemo />
          </motion.div>

          <div
            className="pointer-events-none"
            style={{
              height: 60,
              marginTop: 1,
              background:
                "linear-gradient(to bottom, rgba(139,92,246,0.06) 0%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
            }}
          />
        </motion.div>
      </section>

      <ConversationSection />

      {/* ════════════════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════════════════ */}
      <div id="features">
        {[
          {
            label: "Client Portal",
            heading: "They see hours.\nYou stop explaining.",
            body: "Clients get a real-time portal. Hours used, hours left, every task logged. The question 'where did my hours go?' stops existing.",
            component: <FeaturePortalDemo />,
            flip: false,
          },
          {
            label: "Live Timer",
            heading: "Track time.\nThey see it instantly.",
            body: "Start a timer. Their portal updates in real time. No export, no email, no explanation. They just know.",
            component: <FeatureTimerDemo />,
            flip: true,
          },
          {
            label: "Auto-Invoicing",
            heading: "Invoices without\nthe questions.",
            body: "Auto-generate on billing day. Base hours plus overages, calculated automatically. By the time it arrives, they've watched it build all month.",
            component: <FeatureInvoiceDemo />,
            flip: false,
          },
          {
            label: "Overage Alerts",
            heading: "Catch overages\nbefore they happen.",
            body: "Automated alerts at 80% and 100% of hours used. Your client gets notified. No awkward conversation.",
            component: <FeatureNotificationDemo />,
            flip: true,
          },
        ].map((f, i) => (
          <FeatureSection key={f.label} {...f} index={i} />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-36 border-t border-white/[0.05]">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.2em] mb-4">
              Early users
            </p>
            <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold tracking-tight text-white">
              Be one of the first 10.
            </h2>
            <p className="mt-4 text-[15px] text-white/30 max-w-md mx-auto leading-relaxed">
              We're onboarding early users personally. Direct access to the founder. Same-day support. Real input into what gets built.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                quote: "Finally a tool that shows the client what I'm doing. The invoice questions are completely gone.",
                name: "Early beta user",
                role: "Freelance developer",
                init: "JR",
                highlight: false,
              },
              {
                quote: "genius move, just give 'em the tools to see for themselves",
                name: "@zlunier",
                role: "Twitter / X",
                init: "ZL",
                highlight: true,
              },
              {
                quote: "Ditched my spreadsheet on day one. My client actually thanked me for the portal.",
                name: "Early beta user",
                role: "Marketing consultant",
                init: "MB",
                highlight: false,
              },
            ].map((t, i) => (
              <motion.div
                key={t.name + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={cn(
                  "p-6 rounded-2xl border flex flex-col gap-5",
                  t.highlight
                    ? "bg-violet-600/[0.08] border-violet-500/25"
                    : "bg-white/[0.025] border-white/[0.07]"
                )}
              >
                <p className="text-[14px] text-white/60 leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-[11px] font-bold text-violet-300">
                    {t.init}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white leading-tight">{t.name}</p>
                    <p className="text-[11px] text-white/30">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          PRICING
      ════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="relative z-10 py-36 border-t border-white/[0.05]">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.2em] mb-4">
              Pricing
            </p>
            <h2 className="text-[clamp(28px,4.5vw,48px)] font-bold tracking-tight text-white">
              Start free. Scale when you're ready.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 items-start">
            {[
              {
                name: "Free",
                price: "$0",
                per: "",
                sub: "For your first retainer client",
                features: ["1 client", "Time tracking", "Manual invoicing", "Client portal"],
                cta: "Get started free",
                pop: false,
              },
              {
                name: "Pro",
                price: "$19",
                per: "/mo",
                sub: "For freelancers with multiple clients",
                features: ["Up to 10 clients", "Real-time client portal", "Auto-invoicing", "PDF invoices", "Overage alerts"],
                cta: "Start Pro",
                pop: true,
              },
              {
                name: "Business",
                price: "$39",
                per: "/mo",
                sub: "For agencies and power users",
                features: ["Unlimited clients", "Everything in Pro", "Stripe auto-charge", "Analytics", "Priority support"],
                cta: "Start Business",
                pop: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-7",
                  plan.pop
                    ? "bg-white border-white text-black"
                    : "bg-white/[0.025] border-white/[0.07] text-white hover:border-white/[0.12] transition-colors"
                )}
              >
                {plan.pop && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-violet-600 text-white text-[11px] font-bold tracking-wide">
                    Most Popular
                  </div>
                )}
                <div className="mb-7">
                  <p className={cn("text-[11px] font-semibold uppercase tracking-[0.15em] mb-3", plan.pop ? "text-black/35" : "text-white/25")}>
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-[38px] font-bold tracking-tighter leading-none">{plan.price}</span>
                    {plan.per && <span className={cn("text-[13px] mb-1.5", plan.pop ? "text-black/40" : "text-white/30")}>{plan.per}</span>}
                  </div>
                  <p className={cn("text-[13px]", plan.pop ? "text-black/45" : "text-white/30")}>{plan.sub}</p>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check className={cn("w-3.5 h-3.5 flex-shrink-0", plan.pop ? "text-black" : "text-violet-400")} />
                      <span className={cn("text-[13px]", plan.pop ? "text-black/65" : "text-white/50")}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "inline-flex items-center justify-center w-full py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer",
                      plan.pop
                        ? "bg-black text-white hover:bg-black/80"
                        : "bg-white/[0.05] text-white hover:bg-white/[0.09] border border-white/[0.08]"
                    )}
                  >
                    {plan.cta}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-48 border-t border-white/[0.05] overflow-hidden">
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 pointer-events-none"
          style={{
            width: 600,
            height: 400,
            background:
              "radial-gradient(ellipse 70% 60% at 50% 90%, rgba(109,40,217,0.22) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(40px,7vw,84px)] font-bold tracking-[-0.04em] text-white leading-[1.0] mb-6 max-w-2xl mx-auto"
          >
            Send your next invoice
            without the call.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-[15px] text-white/30 mb-10 max-w-xs mx-auto"
          >
            Free for your first client. No credit card. 2 minutes to set up.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.22 }}
          >
            <Link href="/signup">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black text-[15px] font-semibold cursor-pointer hover:bg-white/90 transition-colors"
              >
                Get started free <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/[0.05] py-10">
        <div className="container mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Retallio" width={18} height={18} className="opacity-35" />
            <span className="text-[13px] text-white/22">© {new Date().getFullYear()} Retallio</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[13px] text-white/22 hover:text-white/55 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[13px] text-white/22 hover:text-white/55 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}