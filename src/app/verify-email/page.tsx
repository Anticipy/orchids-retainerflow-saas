"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { AuthShell, AuthHeader, AuthBody, AuthFooter } from "@/components/auth-shell"

export default function VerifyEmailPage() {
  return (
    <AuthShell>
      <AuthHeader
        title="Check your email"
        subtitle="We sent a verification link to your address"
      />

      <AuthBody>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3"
        >
          {/* Icon */}
          <div className="flex justify-center pb-2">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
          </div>

          {/* Steps */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 space-y-2.5">
            <p className="text-[11px] font-semibold text-white/25 uppercase tracking-[0.12em]">What to do next</p>
            {[
              "Open your email inbox",
              "Click the verification link",
              "You'll land straight in your dashboard",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-4 h-4 mt-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[10px] font-semibold text-white/30">
                  {i + 1}
                </span>
                <span className="text-[13px] text-white/50">{step}</span>
              </div>
            ))}
          </div>

          {/* Spam note */}
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3 space-y-1">
            <p className="text-[11px] font-semibold text-white/25 uppercase tracking-[0.12em]">Didn't receive it?</p>
            <p className="text-[12px] text-white/35 leading-relaxed">
              Check your spam folder — email comes from{" "}
              <span className="text-white/50">support@retallio.app</span>
            </p>
          </div>
        </motion.div>
      </AuthBody>

      <AuthFooter>
        <Link href="/login" className="text-[12px] text-violet-400 hover:text-violet-300 transition-colors font-medium">
          Already verified? Sign in →
        </Link>
      </AuthFooter>
    </AuthShell>
  )
}