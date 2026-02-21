"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { HeroProductDemo } from "@/components/landing/hero-product-demo";
import { FeatureTimerDemo } from "@/components/landing/feature-timer-demo";
import { FeatureInvoiceDemo } from "@/components/landing/feature-invoice-demo";
import { FeaturePortalDemo } from "@/components/landing/feature-portal-demo";
import { FeatureNotificationDemo } from "@/components/landing/feature-notification-demo";
import { cn } from "@/lib/utils";
import { useRef } from "react";

/* ─── Animation Variants ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/* ─── Reusable Components ─────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-[0.15em] mb-4"
    >
      <span className="w-4 h-px bg-indigo-400/60" />
      {children}
      <span className="w-4 h-px bg-indigo-400/60" />
    </motion.p>
  );
}

function SectionHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.h2
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className={cn(
        "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]",
        className
      )}
    >
      {children}
    </motion.h2>
  );
}

/* ─── Noise Texture (SVG data URI) ───────────────────────────────────── */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")";

/* ─── Animated Cursor Component ──────────────────────────────────────── */
function AnimatedCursor() {
  // Waypoints the cursor visits inside the dashboard
  const waypoints = [
    { x: "28%", y: "35%" },   // hover over hours stat
    { x: "55%", y: "28%" },   // move to timer badge
    { x: "55%", y: "28%" },   // pause (click effect)
    { x: "38%", y: "62%" },   // move to progress bar
    { x: "72%", y: "55%" },   // move to task row
    { x: "28%", y: "35%" },   // loop back
  ];

  return (
    <motion.div
      className="absolute pointer-events-none z-30"
      style={{ left: waypoints[0].x, top: waypoints[0].y }}
      animate={{
        left: waypoints.map(w => w.x),
        top: waypoints.map(w => w.y),
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.2, 0.35, 0.55, 0.75, 1],
      }}
    >
      {/* Cursor SVG */}
      <svg
        width="20" height="24"
        viewBox="0 0 20 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }}
      >
        <path
          d="M4 2L16 10.5L10.5 11.5L8 19L4 2Z"
          fill="white"
          stroke="#6366f1"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {/* Click ripple — plays on the "pause" keyframe */}
      <motion.div
        className="absolute top-1 left-1 rounded-full border border-indigo-400/60"
        animate={{
          scale: [0, 0, 2.5, 0, 0, 0],
          opacity: [0, 0, 0.7, 0, 0, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          times: [0, 0.28, 0.38, 0.45, 0.75, 1],
          ease: "easeOut",
        }}
        style={{ width: 20, height: 20, marginTop: -10, marginLeft: -10 }}
      />
    </motion.div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen bg-[#080810] text-white overflow-x-hidden">

      {/* ── Global background layers ── */}
      {/* Grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      {/* Noise */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: NOISE, backgroundSize: "256px 256px" }}
      />
      {/* Top glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%)",
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080810]/75 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-8">
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="relative h-8 w-8">
              <Image
                src="/logo.png"
                alt="Retallio"
                width={32}
                height={32}
                className="h-8 w-8 object-contain object-left"
              />
            </div>
            <span className="font-bold text-[17px] tracking-tight">Retallio</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-white/60 hover:text-white transition-colors px-3 py-1.5">
              Sign in
            </Link>
            <Link href="/signup">
              <motion.span
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-indigo-600 text-white text-sm font-semibold cursor-pointer"
                whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(99,102,241,0.5)" }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </motion.span>
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative z-10 flex flex-col items-center text-center px-4 md:px-8 pt-20 pb-0 md:pt-24 overflow-hidden"
      >
        {/* Announcement pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/[0.08] text-indigo-300 text-xs font-semibold tracking-wide">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-400" />
            </span>
            Free for your first client — forever
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto mb-7"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[76px] font-bold tracking-tight leading-[1.03] text-white"
          >
            Stop explaining
          </motion.h1>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[76px] font-bold tracking-tight leading-[1.03]"
            style={{
              backgroundImage: "linear-gradient(135deg, #818cf8 0%, #6366f1 40%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            invoices.
          </motion.h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed mb-10"
        >
          The only time tracking tool built for{" "}
          <span className="text-white/80">both you and your clients.</span>{" "}
          They see everything. You get paid — without the questions.
        </motion.p>

        {/* CTA group */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-center gap-3 mb-5"
        >
          <Link href="/signup">
            <motion.span
              className="inline-flex items-center gap-2 h-13 px-7 py-4 rounded-xl bg-indigo-600 text-white text-base font-semibold cursor-pointer"
              whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              Start Free — No Card Needed <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-1.5 h-13 px-6 py-4 rounded-xl border border-white/10 text-white/60 text-base font-medium hover:text-white hover:border-white/20 transition-all"
          >
            See how it works <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.p
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-xs text-white/25 mb-16 tracking-wide"
        >
          ✓ Free for 1 client forever &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ 2-minute setup
        </motion.p>

        {/* ── Hero visual — full-width, bleeds to edges ── */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative w-full max-w-6xl mx-auto"
        >
          {/* Glow underneath the mockup */}
          <div
            className="absolute -inset-x-20 top-8 h-32 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.22) 0%, transparent 70%)" }}
          />

          {/* Top edge fade so it bleeds into the section below */}
          <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
            style={{ background: "linear-gradient(to bottom, transparent, #080810)" }}
          />

          {/* Main demo */}
          <div className="relative rounded-t-2xl border border-b-0 border-white/[0.08] overflow-hidden bg-[#0d0d1a] shadow-[0_-20px_80px_rgba(99,102,241,0.12)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-[#0a0a14]">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <div className="mx-3 flex-1 max-w-xs mx-auto h-6 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center px-3 gap-2">
                <span className="text-white/20 text-xs">🔒</span>
                <span className="text-white/25 text-xs">app.retallio.app/dashboard</span>
              </div>
            </div>
            {/* Dashboard + animated cursor overlay */}
            <div className="relative p-2 md:p-4">
              <HeroProductDemo />
              {/* Animated cursor */}
              <AnimatedCursor />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SOCIAL PROOF STRIP
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-14 border-y border-white/[0.06] bg-[#080810]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs font-medium text-white/25 uppercase tracking-[0.2em] mb-8"
          >
            Built for freelancers who are tired of this conversation
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { emoji: "⏱", tool: "Toggl / Harvest", problem: "You see hours. They see nothing." },
              { emoji: "📄", tool: "Invoicing tools", problem: "You send invoices. They ask why." },
              { emoji: "📊", tool: "Spreadsheets", problem: "You track. They still don't trust the number." },
            ].map((item, i) => (
              <motion.div
                key={item.tool}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
              >
                <span className="text-xl mt-0.5">{item.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-white/60 mb-0.5">{item.tool}</p>
                  <p className="text-sm text-white/30">{item.problem}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DIFFERENTIATOR — BIG STATEMENT
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-28 md:py-36">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-4xl">
          <SectionLabel>The difference</SectionLabel>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-white mb-8"
          >
            Every other tool shows{" "}
            <span className="text-white/30 line-through decoration-white/20">you</span>{" "}
            the data.
            <br />
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #818cf8, #6366f1, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Retallio shows both of you.
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed"
          >
            When clients watch hours accumulate in real time all month, invoice day becomes a non-event. They already know what's coming. The invoice is a confirmation, not a surprise.
          </motion.p>

          {/* VS comparison */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-14 grid md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto"
          >
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Without Retallio</p>
              {[
                "Client logs in to nothing",
                "Invoice lands. Confusion follows.",
                "30 minutes explaining tasks",
                "Overage argument every month",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-red-400/60 text-sm">✗</span>
                  <span className="text-sm text-white/30">{item}</span>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl bg-indigo-500/[0.06] border border-indigo-500/20">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-4">With Retallio</p>
              {[
                "Client portal updates in real time",
                "Invoice is a confirmation, not a shock",
                "Zero explanation needed",
                "Overage alerts before they happen",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-emerald-400 text-sm">✓</span>
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURES — ALTERNATING
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="features" className="relative z-10">
        {[
          {
            label: "Shared Dashboard",
            heading: "They see hours.\nYou stop explaining invoices.",
            body: "Clients get a portal. Hours used. Hours left. Every task logged in real time. The question 'where did my hours go?' simply stops existing.",
            component: <FeaturePortalDemo />,
            flip: false,
          },
          {
            label: "Live Time Tracking",
            heading: "Track time.\nThey see it instantly.",
            body: "Start a timer or log hours manually. Their portal updates in real time. No export. No email. No explanation. They just know.",
            component: <FeatureTimerDemo />,
            flip: true,
          },
          {
            label: "Auto-Invoicing",
            heading: "Invoices without\nthe questions.",
            body: "Auto-generate on billing day. Base hours plus overages, calculated automatically. By the time it arrives, they've been watching it build all month.",
            component: <FeatureInvoiceDemo />,
            flip: false,
          },
          {
            label: "Overage Alerts",
            heading: "Catch overages\nbefore they happen.",
            body: "Automated alerts at 80% and 100% of hours used. Your client gets notified. No awkward conversation, no scope creep dispute, no end-of-month drama.",
            component: <FeatureNotificationDemo />,
            flip: true,
          },
        ].map((feature, i) => (
          <div
            key={feature.label}
            className={cn(
              "relative border-t border-white/[0.06] py-24 md:py-32",
              i % 2 === 0 ? "bg-[#080810]" : "bg-[#0a0a14]"
            )}
          >
            <div className="container mx-auto px-4 md:px-8">
              <div
                className={cn(
                  "grid md:grid-cols-2 gap-14 lg:gap-20 xl:gap-28 items-center max-w-6xl mx-auto",
                  feature.flip && "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1"
                )}
              >
                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, x: feature.flip ? 24 : -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="inline-block text-xs font-semibold text-indigo-400 uppercase tracking-[0.15em] mb-4 border border-indigo-500/20 bg-indigo-500/[0.06] px-3 py-1 rounded-full">
                    {feature.label}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-[1.12] mb-5 whitespace-pre-line">
                    {feature.heading}
                  </h2>
                  <p className="text-base md:text-lg text-white/45 leading-relaxed">
                    {feature.body}
                  </p>
                </motion.div>

                {/* Visual */}
                <motion.div
                  initial={{ opacity: 0, x: feature.flip ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-center"
                >
                  <div className="relative w-full">
                    {/* Glow behind demo */}
                    <div
                      className="absolute inset-0 rounded-2xl blur-3xl opacity-20"
                      style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.6), transparent 70%)" }}
                    />
                    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0d0d1a] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                      {feature.component}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-28 md:py-36 border-t border-white/[0.06] bg-[#080810]">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <SectionLabel>Early feedback</SectionLabel>
          <SectionHeading className="mb-4">
            Be one of the first{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #818cf8, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              10 freelancers.
            </span>
          </SectionHeading>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-white/40 max-w-lg mx-auto mb-16 text-base leading-relaxed"
          >
            We're onboarding early users personally — direct access to the founder, same-day support, and real input into what gets built next.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {
                quote: "Finally a tool that shows the client what I'm doing. The invoice questions are gone.",
                name: "Early beta user",
                role: "Freelance Developer",
                initials: "JR",
              },
              {
                quote: "genius move, just give 'em the tools to see for themselves",
                name: "@zlunier",
                role: "Twitter / X",
                initials: "ZL",
                highlight: true,
              },
              {
                quote: "Ditched my spreadsheet on day one. Auto-invoicing alone is worth it. My client actually thanked me for the portal.",
                name: "Early beta user",
                role: "Marketing Consultant",
                initials: "MB",
              },
            ].map((t, i) => (
              <motion.div
                key={t.name + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                whileHover={{ y: -4, borderColor: "rgba(99,102,241,0.25)" }}
                className={cn(
                  "relative p-7 rounded-2xl border text-left transition-colors",
                  t.highlight
                    ? "bg-indigo-500/[0.07] border-indigo-500/25"
                    : "bg-white/[0.02] border-white/[0.07]"
                )}
              >
                <div className="text-3xl text-indigo-300/20 font-serif leading-none mb-4">"</div>
                <p className="text-white/70 text-base leading-relaxed mb-6 italic">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/30">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="relative z-10 py-28 md:py-36 border-t border-white/[0.06] bg-[#0a0a14]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <SectionLabel>Pricing</SectionLabel>
            <SectionHeading>Start free. Upgrade{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(135deg, #818cf8, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                when you're ready.
              </span>
            </SectionHeading>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto items-start">
            {[
              {
                name: "Free",
                price: "$0",
                period: "",
                tagline: "Perfect for your first retainer client",
                features: ["1 retainer client", "Time tracking", "Manual invoicing", "Basic dashboard"],
                cta: "Get Started Free",
                popular: false,
              },
              {
                name: "Pro",
                price: "$19",
                period: "/mo",
                tagline: "For freelancers managing multiple clients",
                features: [
                  "Up to 10 clients",
                  "Client portal — both sides see everything",
                  "Auto-invoicing",
                  "PDF invoices",
                  "Email notifications",
                  "Overage alerts",
                ],
                cta: "Start Pro",
                popular: true,
              },
              {
                name: "Business",
                price: "$39",
                period: "/mo",
                tagline: "For agencies and power users",
                features: [
                  "Unlimited clients",
                  "Everything in Pro",
                  "Stripe auto-charge",
                  "Analytics dashboard",
                  "Priority support",
                ],
                cta: "Start Business",
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                className={cn(
                  "relative rounded-2xl border p-7 flex flex-col transition-all",
                  plan.popular
                    ? "bg-indigo-600 border-indigo-500 shadow-[0_0_60px_rgba(99,102,241,0.25)] scale-[1.02]"
                    : "bg-white/[0.02] border-white/[0.08] hover:border-white/[0.14]"
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white text-indigo-600 text-xs font-bold tracking-wide shadow-lg">
                    Most Popular
                  </span>
                )}
                <div className="mb-6">
                  <p className={cn("text-xs font-semibold uppercase tracking-widest mb-3", plan.popular ? "text-indigo-200" : "text-white/35")}>
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1 mb-2">
                    <span className={cn("text-4xl font-bold tracking-tight", plan.popular ? "text-white" : "text-white")}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={cn("text-sm mb-1.5", plan.popular ? "text-indigo-200" : "text-white/40")}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className={cn("text-sm", plan.popular ? "text-indigo-200" : "text-white/35")}>
                    {plan.tagline}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className={cn("w-4 h-4 mt-0.5 flex-shrink-0", plan.popular ? "text-white" : "text-emerald-400")} />
                      <span className={cn("text-sm", plan.popular ? "text-indigo-100" : "text-white/55")}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="block">
                  <motion.span
                    className={cn(
                      "inline-flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all",
                      plan.popular
                        ? "bg-white text-indigo-600 hover:bg-indigo-50"
                        : "bg-white/[0.06] text-white hover:bg-white/[0.10] border border-white/[0.08]"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.cta}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-36 border-t border-white/[0.06] overflow-hidden">
        {/* CTA glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(99,102,241,0.14) 0%, transparent 70%)",
          }}
        />
        <div className="container mx-auto px-4 md:px-8 text-center relative">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.2em] mb-6"
          >
            Ready?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-6 max-w-3xl mx-auto"
          >
            Send your next invoice
            <br />
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #818cf8, #6366f1, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              without the conversation.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-lg mb-10 max-w-md mx-auto"
          >
            Free for your first client. No credit card. Takes 2 minutes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/signup">
              <motion.span
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 text-white text-base font-semibold cursor-pointer"
                whileHover={{ scale: 1.04, boxShadow: "0 0 48px rgba(99,102,241,0.5)" }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started — It&apos;s Free <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="mt-5 text-xs text-white/20"
          >
            ✓ Free forever for 1 client &nbsp;·&nbsp; ✓ Cancel anytime
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/[0.06] py-10">
        <div className="container mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Retallio" width={22} height={22} className="opacity-60" />
            <span className="text-sm text-white/30">© {new Date().getFullYear()} Retallio</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-white/30 hover:text-white/60 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-white/30 hover:text-white/60 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
