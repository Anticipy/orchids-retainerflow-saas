"use client";

import { useEffect } from "react";
import Link from "next/link";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay || "0";
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "none";
            }, parseInt(delay));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const T = "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)";
const fromLeft  = { opacity: 0, transform: "translateX(-32px)", transition: T } as React.CSSProperties;
const fromRight = { opacity: 0, transform: "translateX(32px)",  transition: T } as React.CSSProperties;
const fromBottom= { opacity: 0, transform: "translateY(28px)",  transition: T } as React.CSSProperties;

const steps = [
  { n: "01", title: "You log time", body: "Add a time entry with what you worked on. Takes 30 seconds. Your client's portal updates the moment you hit save." },
  { n: "02", title: "Your client watches it build", body: "Their portal shows every hour logged and every task completed — in real time, all month long. No waiting for end-of-month reports." },
  { n: "03", title: "Overage alerts fire automatically", body: "At 80% and 100% of included hours, both sides get an email. No awkward calls. No scope disputes." },
  { n: "04", title: "Invoice generates itself", body: "Retallio builds the invoice from your time entries at month end. Your client has already seen every hour — there are no questions." },
  { n: "05", title: "Client approves in one click", body: "Before the invoice is finalized, the client approves it from their portal. Both sides aligned. Payment moves faster." },
];

const comparisons = [
  { name: "Retallio",  for: "Solo freelancers",           portal: true,  price: "Free / $19 / $39", highlight: true  },
  { name: "Bonsai",    for: "Freelancers (all-in-one)",   portal: false, price: "From $17/mo",      highlight: false },
  { name: "Harvest",   for: "Small teams",                portal: false, price: "From $11/mo",      highlight: false },
  { name: "Toggl",     for: "Individuals",                portal: false, price: "Free / $9/mo",     highlight: false },
  { name: "Accelo",    for: "Agencies",                   portal: false, price: "From $24/user",    highlight: false },
  { name: "Scoro",     for: "Agencies",                   portal: false, price: "From $26/user",    highlight: false },
];

const faqs = [
  { q: "What is retainer management software?", a: "Retainer management software helps freelancers track hours, manage recurring client relationships, and handle monthly billing for clients on a fixed fee. The best tools give clients live visibility into work done so invoices never arrive as a surprise." },
  { q: "How is Retallio different from Toggl or Harvest?", a: "Toggl and Harvest track time for you. Retallio tracks time for both you and your client. Your client gets a live portal where they see every hour logged and every task completed — updated in real time as you work. No other retainer management software does this." },
  { q: "Do my clients need to create an account?", a: "No. Each client gets a unique portal link. They click it and see everything — no signup, no password, no friction. Most clients check it within the first week and never question an invoice again." },
  { q: "Is Retallio built for agencies?", a: "Retallio is built for solo freelancers and small consultancies with 1–10 retainer clients. If you're running a larger agency with a full team, tools like Accelo or Scoro may be a better fit." },
  { q: "What happens when a client uses all their hours?", a: "Both you and your client get automatic email alerts at 80% and 100% of hours used. Additional work is tracked and billed at your overage rate, set when you create the client." },
  { q: "Can I try it for free?", a: "Yes. Retallio is free for your first client, forever. No credit card required. Full portal experience — time tracking, live client visibility, and manual invoicing." },
];

export default function RetainerManagementSoftwarePage() {
  useReveal();

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>

      {/* Noise */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.032] mix-blend-screen" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px" }} aria-hidden="true" />

      {/* Nav */}
      <div className="fixed z-50" style={{ top: 20, left: "50%", transform: "translateX(-50%)", width: "min(calc(100vw - 32px), 960px)" }}>
        <div className="flex items-center justify-between px-5 py-3.5 rounded-2xl border border-white/[0.06] bg-black/30 backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-70 transition-opacity">
            <div className="w-8 h-8 rounded-xl overflow-hidden">
              <img src="/logo.png" alt="Retallio" width={32} height={32} className="object-contain" />
            </div>
            <span className="text-[16px] font-semibold tracking-tight">Retallio</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden md:block px-3.5 py-2 text-[14px] font-medium text-white/40 hover:text-white transition-colors">Sign in</Link>
            <Link href="/signup">
              <span className="inline-flex items-center px-4 py-2 rounded-xl bg-white text-black text-[13px] font-semibold cursor-pointer hover:bg-white/90 transition-colors">Get Started Free</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div aria-hidden="true" style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 85% 70% at 50% 72%, rgba(109,40,217,0.65) 0%, rgba(91,33,182,0.35) 40%, transparent 70%)", filter:"blur(2px)" }} />
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 100% 80% at 50% 60%, rgba(109,40,217,0.18) 0%, transparent 65%)", filter:"blur(40px)" }} />
          <div style={{ position:"absolute", top:"-10%", left:"-5%", width:"55%", height:"90%", background:"radial-gradient(ellipse 38% 85% at 35% 60%, rgba(167,139,250,0.60) 0%, rgba(124,58,237,0.28) 50%, transparent 72%)", filter:"blur(1px)", transform:"rotate(-22deg) scaleX(0.7)", transformOrigin:"50% 100%" }} />
          <div style={{ position:"absolute", top:"-10%", right:"-5%", width:"55%", height:"90%", background:"radial-gradient(ellipse 38% 85% at 65% 60%, rgba(139,92,246,0.55) 0%, rgba(109,40,217,0.24) 50%, transparent 72%)", filter:"blur(1px)", transform:"rotate(22deg) scaleX(0.7)", transformOrigin:"50% 100%" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 18%), linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 22%), linear-gradient(to right, rgba(0,0,0,0.80) 0%, transparent 18%), linear-gradient(to left, rgba(0,0,0,0.80) 0%, transparent 18%)" }} />
        </div>

        <div className="relative z-10 max-w-[820px] mx-auto">
          <h1 data-reveal data-delay="80" style={fromBottom} className="text-[clamp(48px,8.5vw,96px)] font-bold tracking-[-0.045em] leading-[0.93] text-white mb-7">
            Retainer management
            <br /><span className="text-white/35">software that works</span>
            <br />for both sides.
          </h1>

          <p data-reveal data-delay="160" style={fromBottom} className="text-[18px] text-white/45 max-w-[480px] mx-auto leading-relaxed mb-10">
            Your client gets a live portal. They watch your hours build all month.
            By the time the invoice lands, there are no questions.
          </p>

          <div data-reveal data-delay="240" style={fromBottom} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <span className="inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-white text-black text-[15px] font-semibold cursor-pointer hover:bg-white/90 transition-colors">
                Start free — no credit card
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </Link>
            <Link href="#comparison">
              <span className="inline-flex items-center h-12 px-7 rounded-xl border border-white/[0.10] text-white/50 text-[15px] font-medium hover:text-white hover:border-white/20 transition-all cursor-pointer">Compare tools</span>
            </Link>
          </div>

          <p data-reveal data-delay="300" style={fromBottom} className="mt-7 text-[13px] text-white/20 tracking-wide">
            Free for your first client · 2 minutes to set up
          </p>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="relative z-10 py-40 border-t border-white/[0.05]">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <p data-reveal style={fromLeft} className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.2em] mb-5">The problem</p>
              <h2 data-reveal data-delay="60" style={fromLeft} className="text-[clamp(30px,4vw,48px)] font-bold tracking-tight text-white leading-[1.08] mb-6">
                Most retainer software<br />wasn't built for you.
              </h2>
              <p data-reveal data-delay="120" style={fromLeft} className="text-[16px] text-white/40 leading-relaxed">
                Accelo, Scoro, Teamwork, ClickUp — every tool ranking on Google targets agencies with 10-person teams and enterprise budgets. They charge $200/month for CRM, resource planning, and features you'll never touch.
                <br /><br />
                You need two things: track your hours, and let your client see them. That's it. Nobody built that. So we did.
              </p>
            </div>

            <div data-reveal style={fromRight} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07] bg-white/[0.02]">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                </div>
                <span className="text-[11px] text-white/30 mx-auto">Client · iMessage</span>
                <span className="text-[10px] font-semibold text-red-400/70 bg-red-400/10 px-2 py-0.5 rounded-full">Without Retallio</span>
              </div>
              <div className="p-6 space-y-3.5">
                {[
                  { from: "client", text: "Hey, got the invoice — can you break down these hours?" },
                  { from: "me",     text: "Sure! Monday was the homepage redesign, Tuesday API work..." },
                  { from: "client", text: "Ok but why does it say 22hrs? I thought we agreed on 20?" },
                  { from: "me",     text: "The extra 2hrs were approved in the Slack thread on Feb 8th" },
                  { from: "client", text: "Hmm, let me check with my team and get back to you" },
                ].map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[14px] leading-snug ${msg.from === "me" ? "bg-violet-600 text-white rounded-br-sm" : "bg-white/[0.07] border border-white/[0.09] text-white/75 rounded-bl-sm"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-40 border-t border-white/[0.05]">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="text-center mb-20">
            <p data-reveal style={fromBottom} className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.2em] mb-4">How it works</p>
            <h2 data-reveal data-delay="60" style={fromBottom} className="text-[clamp(30px,4vw,52px)] font-bold tracking-tight text-white leading-[1.08]">
              Your client sees everything.
              <br /><span className="text-white/35">Before the invoice arrives.</span>
            </h2>
          </div>

          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={step.n} data-reveal data-delay={`${i * 60}`} style={i % 2 === 0 ? fromLeft : fromRight}
                className="group flex gap-8 p-8 rounded-2xl border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.03] hover:border-violet-500/20 transition-all duration-300">
                <span className="text-[11px] font-bold text-violet-400/40 group-hover:text-violet-400/70 uppercase tracking-widest w-6 flex-shrink-0 mt-1 transition-colors">{step.n}</span>
                <div className="flex-1">
                  <h3 className="text-[17px] font-semibold text-white mb-2.5">{step.title}</h3>
                  <p className="text-[15px] text-white/40 leading-relaxed">{step.body}</p>
                </div>
                <svg className="w-4 h-4 text-white/10 group-hover:text-violet-400/40 flex-shrink-0 mt-1 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE DIFFERENCE ── */}
      <section className="relative z-10 py-40 border-t border-white/[0.05]">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="text-center mb-20">
            <p data-reveal style={fromBottom} className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.2em] mb-4">The difference</p>
            <h2 data-reveal data-delay="60" style={fromBottom} className="text-[clamp(30px,4vw,52px)] font-bold tracking-tight text-white leading-[1.08]">Stop having this conversation.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div data-reveal style={fromLeft} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07]">
                <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-white/10" /><div className="w-2 h-2 rounded-full bg-white/10" /><div className="w-2 h-2 rounded-full bg-white/10" /></div>
                <span className="flex-1 text-center text-[11px] text-white/30">Client · iMessage</span>
                <span className="text-[10px] font-semibold text-red-400/70 bg-red-400/10 px-2 py-0.5 rounded-full">Without Retallio</span>
              </div>
              <div className="p-5 space-y-3 min-h-[280px]">
                {[
                  { from:"client", text:"Hey, got the invoice — can you break down these hours?" },
                  { from:"me",     text:"Sure! Monday was the homepage redesign, Tuesday API work..." },
                  { from:"client", text:"Ok but why does it say 22hrs? I thought we agreed on 20?" },
                  { from:"me",     text:"The extra 2hrs were approved in the Slack thread on Feb 8th" },
                  { from:"client", text:"Hmm, let me check with my team and get back to you" },
                  { from:"me",     text:"No problem 🙂" },
                ].map((msg, i) => (
                  <div key={i} className={`flex ${msg.from==="me"?"justify-end":"justify-start"}`}>
                    <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-snug ${msg.from==="me"?"bg-violet-600 text-white rounded-br-sm":"bg-white/[0.07] border border-white/[0.09] text-white/70 rounded-bl-sm"}`}>{msg.text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal style={fromRight} className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-violet-500/[0.12]">
                <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-white/10" /><div className="w-2 h-2 rounded-full bg-white/10" /><div className="w-2 h-2 rounded-full bg-white/10" /></div>
                <span className="flex-1 text-center text-[11px] text-white/30">Client · iMessage</span>
                <span className="text-[10px] font-semibold text-violet-300 bg-violet-500/15 px-2 py-0.5 rounded-full">With Retallio</span>
              </div>
              <div className="p-5 space-y-3 min-h-[280px] flex flex-col">
                {["Invoice #024 sent to Meridian Studio · $2,109", "Invoice opened by studio@meridian.co · 9:41 AM", "Payment received · $2,109 · 11:02 AM"].map((event, i) => (
                  <div key={i} className="flex justify-center">
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.04] border border-white/[0.07]">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className="text-[12px] text-white/45">{event}</span>
                    </div>
                  </div>
                ))}
                <div className="flex-1 flex flex-col items-center justify-center pb-4 pt-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                  </div>
                  <p className="text-[14px] font-medium text-white/50 text-center">No questions.</p>
                  <p className="text-[13px] text-white/25 text-center mt-1">They watched it build all month.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section id="comparison" className="relative z-10 py-40 border-t border-white/[0.05]">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <div className="text-center mb-16">
            <p data-reveal style={fromBottom} className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.2em] mb-4">Comparison</p>
            <h2 data-reveal data-delay="60" style={fromBottom} className="text-[clamp(30px,4vw,48px)] font-bold tracking-tight text-white leading-[1.08]">
              Retallio vs other retainer<br />management software
            </h2>
          </div>
          <div data-reveal style={fromBottom} className="rounded-2xl border border-white/[0.07] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.07] bg-white/[0.025]">
                    <th className="text-left px-6 py-5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Tool</th>
                    <th className="text-left px-6 py-5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Built for</th>
                    <th className="text-left px-6 py-5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Live client portal</th>
                    <th className="text-left px-6 py-5 text-[11px] font-semibold text-white/25 uppercase tracking-widest">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row) => (
                    <tr key={row.name} className={`border-b border-white/[0.04] last:border-0 transition-colors ${row.highlight ? "bg-violet-500/[0.08]" : "hover:bg-white/[0.02]"}`}>
                      <td className="px-6 py-5">
                        <span className={`text-[14px] font-semibold ${row.highlight ? "text-white" : "text-white/55"}`}>
                          {row.name}
                          {row.highlight && <span className="ml-2 text-[10px] font-bold text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-full">That's us</span>}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[14px] text-white/35">{row.for}</td>
                      <td className="px-6 py-5">
                        {row.portal
                          ? <span className="text-[13px] font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">Real-time</span>
                          : <span className="text-[14px] text-white/20">—</span>}
                      </td>
                      <td className="px-6 py-5 text-[14px] text-white/35">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p data-reveal data-delay="100" style={fromBottom} className="mt-5 text-center text-[14px] text-white/25 leading-relaxed">
            The key difference: Retallio is the only retainer management software where your client has a live portal.<br className="hidden md:block" />
            Every other tool tracks time for you. Retallio tracks time for both of you.
          </p>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="relative z-10 py-40 border-t border-white/[0.05]">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div data-reveal style={fromLeft}>
              <p className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.2em] mb-5">Who it's for</p>
              <h2 className="text-[clamp(30px,4vw,48px)] font-bold tracking-tight text-white leading-[1.08] mb-6">
                Built for freelancers<br />who bill monthly.
              </h2>
              <p className="text-[16px] text-white/40 leading-relaxed mb-8">
                If you bill the same clients every month and want to stop having the invoice conversation — Retallio was built for you. Not for agencies. Not for teams. For you.
              </p>
              <Link href="/signup">
                <span className="inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-white text-black text-[14px] font-semibold cursor-pointer hover:bg-white/90 transition-colors">
                  Get started free
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </Link>
            </div>
            <div data-reveal style={fromRight} className="space-y-2.5">
              {["Freelance designers","Freelance developers","Social media managers","SEO consultants","Copywriters & content creators","Marketing consultants"].map((label) => (
                <div key={label} className="group flex items-center gap-3 px-5 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-violet-500/20 hover:bg-violet-500/[0.04] transition-all cursor-default">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400/40 group-hover:bg-violet-400 flex-shrink-0 transition-colors" />
                  <span className="text-[15px] text-white/60 group-hover:text-white/80 transition-colors">{label}</span>
                  <svg className="ml-auto w-3.5 h-3.5 text-white/10 group-hover:text-violet-400/50 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="relative z-10 py-40 border-t border-white/[0.05]">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="text-center mb-16">
            <p data-reveal style={fromBottom} className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.2em] mb-4">Early users</p>
            <h2 data-reveal data-delay="60" style={fromBottom} className="text-[clamp(30px,4.5vw,48px)] font-bold tracking-tight text-white">What freelancers say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { q:"Finally a tool that shows the client what I'm doing. The invoice questions are completely gone.", init:"JR", name:"Early beta user", role:"Freelance developer" },
              { q:"Ditched my spreadsheet on day one. My client actually thanked me for the portal.", init:"MB", name:"Early beta user", role:"Marketing consultant", featured:true },
              { q:"Genius move. Just give them the tools to see for themselves.", init:"ZL", name:"@zlunier", role:"X / Twitter" },
            ].map((t, i) => (
              <div key={t.init} data-reveal data-delay={`${i*80}`} style={fromBottom} className={`p-8 rounded-2xl border flex flex-col gap-6 min-h-[220px] ${t.featured ? "border-violet-500/25 bg-violet-600/[0.08]" : "border-white/[0.07] bg-white/[0.025]"}`}>
                <p className="text-[15px] text-white/60 leading-relaxed flex-1">"{t.q}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-[12px] font-bold text-violet-300">{t.init}</div>
                  <div>
                    <p className="text-[14px] font-semibold text-white leading-tight">{t.name}</p>
                    <p className="text-[12px] text-white/30">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="relative z-10 py-40 border-t border-white/[0.05]">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <div className="text-center mb-16">
            <p data-reveal style={fromBottom} className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.2em] mb-4">Pricing</p>
            <h2 data-reveal data-delay="60" style={fromBottom} className="text-[clamp(30px,4.5vw,48px)] font-bold tracking-tight text-white leading-[1.08]">
              Start free.<br /><span className="text-white/35">Scale when you're ready.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 items-start">
            {/* Free */}
            <div data-reveal data-delay="0" style={fromBottom} className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-3 text-white/25">Free</p>
              <div className="flex items-end gap-1 mb-2"><span className="text-[44px] font-bold tracking-tighter leading-none">$0</span></div>
              <p className="text-[14px] text-white/30 mb-8">For your first retainer client</p>
              <ul className="space-y-3 mb-9 flex-1">
                {["1 client","Time tracking","Client portal","Manual invoicing"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-violet-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                    <span className="text-[14px] text-white/50">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup"><span className="inline-flex items-center justify-center w-full py-3 rounded-xl text-[14px] font-semibold cursor-pointer bg-white/[0.05] text-white hover:bg-white/[0.09] border border-white/[0.08] transition-colors">Get started free</span></Link>
            </div>

            {/* Pro */}
            <div data-reveal data-delay="80" style={fromBottom} className="relative flex flex-col rounded-2xl border border-white bg-white p-8 text-black">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-violet-600 text-white text-[11px] font-bold tracking-wide">Most Popular</div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-3 text-black/35">Pro</p>
              <div className="flex items-end gap-1 mb-2"><span className="text-[44px] font-bold tracking-tighter leading-none">$19</span><span className="text-[14px] mb-1.5 text-black/40">/mo</span></div>
              <p className="text-[14px] text-black/45 mb-8">For freelancers with multiple clients</p>
              <ul className="space-y-3 mb-9 flex-1">
                {["Up to 10 clients","Real-time client portal","Auto-invoicing","PDF invoices","Overage alerts","Client approval flow"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-black flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                    <span className="text-[14px] text-black/65">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?next=/dashboard/settings"><span className="inline-flex items-center justify-center w-full py-3 rounded-xl text-[14px] font-semibold cursor-pointer bg-black text-white hover:bg-black/80 transition-colors">Start Pro</span></Link>
            </div>

            {/* Business */}
            <div data-reveal data-delay="160" style={fromBottom} className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-3 text-white/25">Business</p>
              <div className="flex items-end gap-1 mb-2"><span className="text-[44px] font-bold tracking-tighter leading-none">$39</span><span className="text-[14px] mb-1.5 text-white/30">/mo</span></div>
              <p className="text-[14px] text-white/30 mb-8">For agencies and power users</p>
              <ul className="space-y-3 mb-9 flex-1">
                {["Unlimited clients","Everything in Pro","Stripe auto-charge","Analytics","Priority support"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-violet-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                    <span className="text-[14px] text-white/50">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?next=/dashboard/settings"><span className="inline-flex items-center justify-center w-full py-3 rounded-xl text-[14px] font-semibold cursor-pointer bg-white/[0.05] text-white hover:bg-white/[0.09] border border-white/[0.08] transition-colors">Start Business</span></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 py-40 border-t border-white/[0.05]">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <div className="text-center mb-16">
            <p data-reveal style={fromBottom} className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.2em] mb-4">FAQ</p>
            <h2 data-reveal data-delay="60" style={fromBottom} className="text-[clamp(30px,4vw,48px)] font-bold tracking-tight text-white">Common questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.q} data-reveal data-delay={`${i*50}`} style={i%2===0?fromLeft:fromRight} className="p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.10] transition-colors">
                <h3 className="text-[15px] font-semibold text-white mb-3">{faq.q}</h3>
                <p className="text-[14px] text-white/40 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 py-48 border-t border-white/[0.05] overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 pointer-events-none" style={{ width:"600px", height:"400px", background:"radial-gradient(ellipse 70% 60% at 50% 90%, rgba(109,40,217,0.22) 0%, transparent 70%)", filter:"blur(20px)" }} aria-hidden="true" />
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <h2 data-reveal style={fromBottom} className="text-[clamp(40px,7vw,84px)] font-bold tracking-[-0.04em] text-white leading-[1.0] mb-6 max-w-2xl mx-auto">
            Send your next invoice<br />without the call.
          </h2>
          <p data-reveal data-delay="80" style={fromBottom} className="text-[16px] text-white/30 mb-10 max-w-xs mx-auto leading-relaxed">
            Free for your first client. No credit card. 2 minutes to set up.
          </p>
          <div data-reveal data-delay="160" style={fromBottom}>
            <Link href="/signup">
              <span className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black text-[15px] font-semibold cursor-pointer hover:bg-white/90 transition-colors">
                Get started free
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.05] py-10">
        <div className="container mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Retallio" width={18} height={18} className="opacity-35" />
            <span className="text-[13px] text-white/22">© 2026 Retallio</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-[13px] text-white/22 hover:text-white/55 transition-colors">Blog</Link>
            <Link href="/privacy" className="text-[13px] text-white/22 hover:text-white/55 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[13px] text-white/22 hover:text-white/55 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}