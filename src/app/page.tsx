"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, BarChart3, Receipt, MessageCircle, ArrowRight, Check } from "lucide-react";
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
            <Clock className="h-5 w-5 text-[#6366f1]" />
            <span className="font-bold text-lg tracking-tight">Tempo</span>
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

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white mb-6"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Your retainer clients, organized
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-[#a3a3a3] mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Track time. Bill automatically. Keep clients happy.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/signup">
              <motion.span
                className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-[#6366f1] text-white text-base font-semibold cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 12px 32px rgba(99, 102, 241, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Start Free <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
        <div className="mt-16 md:mt-20">
          <HeroProductDemo />
        </div>
      </section>

      {/* Problem */}
      <section className="relative z-10 py-20 md:py-28 border-t border-white/10">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center text-white mb-12"
            {...fadeInUp}
          >
            Retainers shouldn&apos;t feel like chaos
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: BarChart3,
                title: "Spreadsheet hell",
                desc: "Hours scattered across tabs",
              },
              {
                icon: Receipt,
                title: "Billing confusion",
                desc: "Manual invoices every month",
              },
              {
                icon: MessageCircle,
                title: "Client questions",
                desc: '"Where did my hours go?"',
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

      {/* Feature 1: Time Tracking */}
      <section className="relative z-10 py-20 md:py-28 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center max-w-6xl xl:max-w-7xl mx-auto">
            <motion.div className="order-2 md:order-1" {...fadeInUp}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Time Tracking That Actually Works
              </h2>
              <p className="text-[#a3a3a3] text-base md:text-lg leading-relaxed">
                Start a timer. Log hours. See totals instantly.
                <br />
                Every minute tracked against the right retainer.
              </p>
            </motion.div>
            <motion.div className="order-1 md:order-2 flex justify-center md:justify-end" {...fadeInUp}>
              <FeatureTimerDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature 2: Invoices */}
      <section className="relative z-10 py-20 md:py-28 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center max-w-6xl xl:max-w-7xl mx-auto">
            <motion.div className="flex justify-center md:justify-start" {...fadeInUp}>
              <FeatureInvoiceDemo />
            </motion.div>
            <motion.div {...fadeInUp}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Invoices on Autopilot
              </h2>
              <p className="text-[#a3a3a3] text-base md:text-lg leading-relaxed">
                Billing day hits. Invoice generates automatically.
                <br />
                Base retainer + overages. Sent to your client. Done.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature 3: Client Portal */}
      <section className="relative z-10 py-20 md:py-28 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center max-w-6xl xl:max-w-7xl mx-auto">
            <motion.div className="order-2 md:order-1" {...fadeInUp}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Clients See Everything
              </h2>
              <p className="text-[#a3a3a3] text-base md:text-lg leading-relaxed">
                Give clients a portal. They see hours used, tasks completed, invoices.
                <br />
                No more &quot;where did my hours go?&quot; emails.
              </p>
            </motion.div>
            <motion.div className="order-1 md:order-2 flex justify-center md:justify-end" {...fadeInUp}>
              <FeaturePortalDemo />
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
                Never Miss a Beat
              </h2>
              <p className="text-[#a3a3a3] text-base md:text-lg leading-relaxed">
                Alerts when clients hit 80% of hours.
                <br />
                Warnings before overages. You stay in control.
              </p>
            </motion.div>
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
                features: ["Up to 10 clients", "Client portal", "Auto-invoicing", "PDF invoices", "Email notifications"],
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
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4"
            {...fadeInUp}
          >
            Stop stressing about retainers
          </motion.h2>
          <motion.p
            className="text-[#a3a3a3] mb-8"
            {...fadeInUp}
          >
            No credit card required. 1 client free forever.
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
          <p>&copy; {new Date().getFullYear()} Tempo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
