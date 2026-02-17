"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BarChart3, Receipt, MessageCircle, ArrowRight, Check, Quote } from "lucide-react";
import { HeroProductDemo } from "@/components/landing/hero-product-demo";
import { FeatureTimerDemo } from "@/components/landing/feature-timer-demo";
import { FeatureInvoiceDemo } from "@/components/landing/feature-invoice-demo";
import { FeaturePortalDemo } from "@/components/landing/feature-portal-demo";
import { FeatureNotificationDemo } from "@/components/landing/feature-notification-demo";
import { cn } from "@/lib/utils";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.5 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export default function LandingPage() {
  return (
    <div className="landing-page min-h-screen bg-[#0f0f0f] text-white">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent)",
        }}
      />

      {/* Sticky Header - Linear style */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f0f0f]/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="relative h-8 w-8 overflow-hidden">
              <Image src="/logo.png" alt="Retallio" width={32} height={32} className="h-8 w-8 object-left object-contain" style={{ objectPosition: "left center" }} />
            </div>
            <span className="font-bold text-lg tracking-tight">Retallio</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <motion.span
                className="inline-block text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                Sign in
              </motion.span>
            </Link>
            <Link href="/signup">
              <motion.span
                className="inline-flex items-center justify-center h-8 px-4 rounded-lg bg-white text-[#0f0f0f] text-sm font-semibold hover:bg-white/90 transition-colors cursor-pointer"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - side-by-side on lg+ so demo is above the fold on 1440x900 */}
      <section className="relative z-10 container mx-auto px-4 py-8 md:py-10 lg:py-12 xl:py-16 lg:min-h-[calc(100vh-3.5rem)] flex flex-col lg:grid lg:grid-cols-2 lg:gap-14 xl:gap-20 lg:items-center">
        <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left order-2 lg:order-1 mt-8 lg:mt-0 space-y-5 lg:space-y-6 max-w-xl lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.15]"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Your clients finally see what
            <br className="hidden sm:inline" />
            {" "}they&apos;re paying for
          </motion.h1>
          <motion.p
            className="text-base md:text-lg text-[#a3a3a3] max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Stop answering &quot;where did my hours go?&quot; Give clients a real-time portal. Invoices generate themselves.
          </motion.p>
          <motion.p
            className="text-sm text-[#a3a3a3]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            ✓ Free for 1 client forever  •  ✓ No credit card required
          </motion.p>
          <motion.div
            className="flex flex-col items-center lg:items-start gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/signup">
              <motion.span
                className="inline-flex items-center gap-2 text-base md:text-lg px-6 md:px-8 py-4 md:py-5 rounded-lg bg-[#6366f1] text-white font-semibold cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 12px 32px rgba(99, 102, 241, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Start Free <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </motion.span>
            </Link>
            <p className="text-xs text-[#a3a3a3]">No credit card required</p>
          </motion.div>
          <motion.div
            className="flex items-center justify-center lg:justify-start gap-2 text-sm text-[#a3a3a3]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-blue-500 border-2 border-[#0f0f0f]" />
              <div className="w-7 h-7 rounded-full bg-purple-500 border-2 border-[#0f0f0f]" />
              <div className="w-7 h-7 rounded-full bg-green-500 border-2 border-[#0f0f0f]" />
            </div>
            <span className="text-xs md:text-sm">The only retainer tool built for both you and your clients</span>
          </motion.div>
          <motion.p
            className="text-xs md:text-sm text-[#737373] italic max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            &ldquo;No more invoice disputes. They see everything before the invoice even arrives.&rdquo;
          </motion.p>
        </div>
        <div className="order-1 lg:order-2 flex items-center justify-center">
          <div className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl">
            <HeroProductDemo />
          </div>
        </div>
      </section>

      {/* Problem - The Gap */}
      <section className="relative z-10 py-20 md:py-28 border-t border-white/10">
        <div className="container mx-auto px-4">
          <motion.p
            className="text-center text-sm font-medium text-[#6366f1] uppercase tracking-wider mb-2"
            {...fadeInUp}
          >
            The gap
          </motion.p>
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center text-white mb-4 max-w-2xl mx-auto"
            {...fadeInUp}
          >
            Every tool serves only you. Your client is in the dark.
          </motion.h2>
          <motion.p
            className="text-[#a3a3a3] text-center mb-12 max-w-xl mx-auto"
            {...fadeInUp}
          >
            Time trackers and invoicing tools serve you. Your client stays in the dark until the invoice arrives.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: BarChart3,
                title: "Time trackers",
                desc: "You track ✓ • Client sees nothing ✗",
              },
              {
                icon: Receipt,
                title: "Invoicing tools",
                desc: "You invoice ✓ • Client doesn't know why ✗",
              },
              {
                icon: MessageCircle,
                title: "Spreadsheets",
                desc: "You track ✓ • Client never sees it ✗",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/5 p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 20px 40px -12px rgba(0,0,0,0.4)",
                  borderColor: "rgba(255,255,255,0.15)",
                }}
              >
                <item.icon className="w-8 h-8 text-[#6366f1] mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-[#a3a3a3]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature 1: Client Portal - THE differentiator */}
      <section className="relative z-10 py-20 md:py-28 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center max-w-6xl xl:max-w-7xl mx-auto">
            <motion.div className="order-2 md:order-1" {...fadeInUp}>
              <p className="text-sm font-medium text-[#6366f1] uppercase tracking-wider mb-2">The transparency layer</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Both sides see the same numbers. In real time.
              </h2>
              <p className="text-[#a3a3a3] text-base md:text-lg leading-relaxed">
                Your client gets a portal. Hours used. Hours left. Every task logged.
                <br />
                <span className="text-white/90">No more &quot;where did my hours go?&quot; No more invoice surprises.</span>
              </p>
            </motion.div>
            <motion.div className="order-1 md:order-2 flex justify-center md:justify-end" {...fadeInUp}>
              <FeaturePortalDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature 2: Time Tracking */}
      <section className="relative z-10 py-20 md:py-28 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center max-w-6xl xl:max-w-7xl mx-auto">
            <motion.div className="flex justify-center md:justify-start" {...fadeInUp}>
              <FeatureTimerDemo />
            </motion.div>
            <motion.div {...fadeInUp}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                You track. Client sees it live.
              </h2>
              <p className="text-[#a3a3a3] text-base md:text-lg leading-relaxed">
                Start a timer. Log hours. Every minute flows straight into their portal.
                <br />
                <span className="text-white/90">You work. They see. Zero back-and-forth.</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature 3: Invoices */}
      <section className="relative z-10 py-20 md:py-28 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center max-w-6xl xl:max-w-7xl mx-auto">
            <motion.div className="order-2 md:order-1" {...fadeInUp}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Invoices they already knew were coming
              </h2>
              <p className="text-[#a3a3a3] text-base md:text-lg leading-relaxed">
                Billing day hits. Invoice auto-generates. Base + overages.
                <br />
                <span className="text-white/90">They saw the numbers all month. No surprises. No disputes.</span>
              </p>
            </motion.div>
            <motion.div className="order-1 md:order-2 flex justify-center md:justify-end" {...fadeInUp}>
              <FeatureInvoiceDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature 4: Notifications */}
      <section className="relative z-10 py-20 md:py-28 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center max-w-6xl xl:max-w-7xl mx-auto">
            <motion.div className="flex justify-center md:justify-start" {...fadeInUp}>
              <FeatureNotificationDemo />
            </motion.div>
            <motion.div {...fadeInUp}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Prevent problems before they happen
              </h2>
              <p className="text-[#a3a3a3] text-base md:text-lg leading-relaxed">
                Alerts at 80% usage. Warnings before overages.
                <br />
                <span className="text-white/90">Both sides stay ahead. No awkward month-end conversations.</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 md:py-28 border-t border-white/10">
        <div className="container mx-auto px-4">
          <motion.p
            className="text-center text-sm font-medium text-[#6366f1] uppercase tracking-wider mb-2"
            {...fadeInUp}
          >
            What freelancers say
          </motion.p>
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center text-white mb-16"
            {...fadeInUp}
          >
            Both sides win
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: "I used to spend an hour each month explaining invoices. Now clients just check their portal. Saves me 12+ hours a year.",
                name: "Sarah Kim",
                role: "Freelance Designer",
              },
              {
                quote: "No more 'where did my hours go?' emails. Clients see everything in real-time. Cut my invoice questions by 90%.",
                name: "Marcus Reid",
                role: "Software Consultant",
              },
              {
                quote: "Finally ditched my spreadsheet. Auto-invoicing alone saves me 2 hours every month.",
                name: "Jamie Park",
                role: "Marketing Consultant",
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                className="relative rounded-xl border border-white/10 bg-white/[0.03] p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{
                  borderColor: "rgba(255,255,255,0.15)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                }}
              >
                <Quote className="absolute top-5 right-5 w-8 h-8 text-[#6366f1]/20" />
                <p className="text-[#e5e5e5] text-base leading-relaxed mb-6 pr-8">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{t.name}</p>
                    <p className="text-[#737373] text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 py-20 md:py-28 border-t border-white/10" id="pricing">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center text-white mb-2"
            {...fadeInUp}
          >
            Simple pricing
          </motion.h2>
          <motion.p
            className="text-[#a3a3a3] text-center mb-12"
            {...fadeInUp}
          >
            Start free, upgrade as you grow.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "",
                desc: "1 client",
                features: ["1 retainer client", "Time tracking", "Manual invoicing", "Basic dashboard"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "$19",
                period: "/mo",
                desc: "10 clients",
                features: ["Up to 10 clients", "Client portal — both sides see everything", "Auto-invoicing", "PDF invoices", "Email notifications"],
                cta: "Start Pro",
                popular: true,
              },
              {
                name: "Business",
                price: "$39",
                period: "/mo",
                desc: "Unlimited",
                features: ["Unlimited clients", "Everything in Pro", "Stripe auto-charge", "Priority support", "Analytics"],
                cta: "Start Business",
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                className={cn(
                  "relative rounded-xl border bg-white text-[#0f0f0f] p-6 flex flex-col",
                  plan.popular
                    ? "border-[#6366f1] shadow-lg shadow-[#6366f1]/20"
                    : "border-white/20 shadow-md"
                )}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{
                  y: -4,
                  boxShadow: plan.popular
                    ? "0 24px 48px -12px rgba(99, 102, 241, 0.3)"
                    : "0 24px 48px -12px rgba(0,0,0,0.15)",
                }}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#6366f1] text-white text-xs font-semibold">
                    Most popular
                  </span>
                )}
                <h3 className="font-bold text-lg text-[#0f0f0f]">{plan.name}</h3>
                <p className="text-sm text-neutral-500 mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-[#0f0f0f]">{plan.price}</span>
                  {plan.period && (
                    <span className="text-neutral-500 font-normal">{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-neutral-700">
                      <Check className="w-4 h-4 text-[#22c55e] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <motion.span
                    className={cn(
                      "inline-flex items-center justify-center w-full py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors",
                      plan.popular
                        ? "bg-[#6366f1] text-white hover:bg-[#6366f1]/90"
                        : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
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

      {/* CTA */}
      <section className="relative z-10 py-20 md:py-28 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto"
            {...fadeInUp}
          >
            The shared dashboard both you and your clients use
          </motion.h2>
          <motion.p
            className="text-[#a3a3a3] mb-8 max-w-lg mx-auto"
            {...fadeInUp}
          >
            Everyone sees the same numbers. All month long. No credit card required.
          </motion.p>
          <motion.div {...fadeInUp}>
            <Link href="/signup">
              <motion.span
                className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-[#6366f1] text-white text-base font-semibold cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 12px 32px rgba(99, 102, 241, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started — It&apos;s Free <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-[#a3a3a3]">
          <p>&copy; {new Date().getFullYear()} Retallio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
