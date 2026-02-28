"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Image from "next/image"

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  hook?: string
  readTime: string
  contentHtml: string
}

interface TOCItem {
  id: string
  text: string
  level: number
}

function extractTOC(html: string): TOCItem[] {
  const matches = [...html.matchAll(/<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi)]
  return matches.map((m) => ({
    level: parseInt(m[1]),
    id: m[2],
    text: m[3].replace(/<[^>]+>/g, ""),
  }))
}

function TableOfContents({ items }: { items: TOCItem[] }) {
  const [active, setActive] = useState("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: "-20% 0px -70% 0px" }
    )
    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav>
      <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-5">
        Contents
      </p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block leading-snug transition-colors py-1.5 border-l-2 ${
              item.level === 3 ? "pl-4 text-[13px]" : "pl-3 text-[15px] font-medium"
            } ${
              active === item.id
                ? "text-violet-400 border-violet-400"
                : "text-white/40 hover:text-white/75 border-transparent hover:border-white/20"
            }`}
          >
            {item.text}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default function BlogPostClient({
  post,
}: {
  post: Post
}) {
  const toc = extractTOC(post.contentHtml)

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      {/* Bloom */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(109,40,217,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo.png"
              alt="Retallio"
              className="w-6 h-6 object-contain"
            />
            <span className="text-[14px] font-semibold text-white/80">
              Retallio
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/blog"
              className="text-[13px] text-white/40 hover:text-white/70 transition-colors"
            >
              ← All posts
            </Link>
            <Link
              href="/signup"
              className="h-8 px-4 rounded-lg bg-white text-black text-[12px] font-semibold hover:bg-white/90 transition-colors flex items-center"
            >
              Try free
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero — full width with background */}
        <div
          className="w-full border-b border-white/[0.05]"
          style={{
            background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(109,40,217,0.13) 0%, transparent 70%)",
          }}
        >
          <div className="max-w-4xl mx-auto px-6 pt-16 pb-14 text-center">
            {/* Label row */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span
                className="text-[11px] font-semibold text-violet-400/90 uppercase tracking-[0.18em] px-3 py-1 rounded-full border border-violet-400/20"
                style={{ background: "rgba(109,40,217,0.1)" }}
              >
                Freelancing
              </span>
              <span className="text-white/20">·</span>
              <span className="text-[13px] text-white/35">{post.date}</span>
              <span className="text-white/20">·</span>
              <span className="text-[13px] text-white/35">{post.readTime}</span>
            </div>

            {/* Big centred title */}
            <h1
              className="text-[40px] sm:text-[52px] font-bold tracking-tight text-white leading-[1.1] mb-6"
              style={{ letterSpacing: "-0.03em" }}
            >
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-[18px] text-white/45 leading-relaxed max-w-2xl mx-auto">
              {post.excerpt}
            </p>

            {/* Author row */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <div className="w-7 h-7 rounded-full bg-violet-500/30 border border-violet-400/30 flex items-center justify-center text-[11px] font-bold text-violet-300">
                I
              </div>
              <span className="text-[13px] text-white/35">By Ionut M. Diaconu</span>
            </div>
          </div>
        </div>

        {/* Body — two column on desktop */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex gap-16 items-start">

            {/* Article */}
            <div className="flex-1 min-w-0">
              {/* Hook */}
              {post.hook && (
                <p
                  className="text-[24px] sm:text-[28px] font-semibold text-white/85 leading-tight mb-8"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {post.hook}
                </p>
              )}

              {/* iMessage visual — only for first post */}
              {post.slug === "why-freelancers-lose-clients-over-invoices" && (
                <div
                  className="rounded-2xl border p-6 space-y-3 mb-10"
                  style={{
                    borderColor: "rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <p className="text-[11px] font-semibold text-white/20 uppercase tracking-[0.12em] mb-4">
                    A real conversation. Every month.
                  </p>
                  <div className="flex justify-start">
                    <div
                      className="max-w-[75%] px-4 py-2.5 rounded-[18px] rounded-bl-sm text-[14px] text-white/80 leading-snug"
                      style={{ background: "rgba(255,255,255,0.07)" }}
                    >
                      Why does the invoice say 22hrs? I thought we agreed on 20?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div
                      className="max-w-[75%] px-4 py-2.5 rounded-[18px] rounded-br-sm text-[14px] text-white/80 leading-snug"
                      style={{
                        background: "rgba(109,40,217,0.35)",
                        border: "1px solid rgba(167,139,250,0.2)",
                      }}
                    >
                      We discussed this on the call. The extra hours were approved.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div
                      className="max-w-[75%] px-4 py-2.5 rounded-[18px] rounded-bl-sm text-[14px] text-white/80 leading-snug"
                      style={{ background: "rgba(255,255,255,0.07)" }}
                    >
                      Let me check with my team and get back to you...
                    </div>
                  </div>
                  <p className="text-[11px] text-white/20 text-center pt-2">
                    Sound familiar?
                  </p>
                </div>
              )}

              <article>
                <div
                  className="prose-retallio"
                  dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />
              </article>
            </div>

            {/* Sidebar — sticky TOC */}
            <aside className="hidden xl:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <TableOfContents items={toc} />

                {/* CTA in sidebar */}
                <div
                  className="mt-8 rounded-xl border p-5 text-center"
                  style={{
                    borderColor: "rgba(167,139,250,0.15)",
                    background: "rgba(109,40,217,0.07)",
                  }}
                >
                  <p className="text-[14px] font-semibold text-white/80 mb-2 leading-snug">
                    Stop explaining your invoices.
                  </p>
                  <p className="text-[13px] text-white/40 mb-4 leading-relaxed">
                    Give clients a live portal. Free to start.
                  </p>
                  <Link
                    href="/signup"
                    className="block w-full h-9 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors flex items-center justify-center"
                  >
                    Try free →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-white/[0.05]" />
        </div>

        {/* CTA block */}
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div
            className="rounded-2xl border p-10 text-center"
            style={{
              borderColor: "rgba(167,139,250,0.12)",
              background:
                "radial-gradient(ellipse 80% 80% at 50% 0%, rgba(109,40,217,0.07) 0%, transparent 100%)",
            }}
          >
            <p className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.15em] mb-3">
              Retallio
            </p>
            <h3
              className="text-[26px] font-bold text-white mb-3 leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              Stop explaining your invoices.
            </h3>
            <p className="text-[14px] text-white/40 mb-7 leading-relaxed max-w-sm mx-auto">
              Give your clients a live portal. They watch your hours build in
              real time. By the time the invoice arrives, there are no
              questions.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/signup"
                className="h-10 px-6 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors flex items-center"
              >
                Get started free
              </Link>
              <Link
                href="/"
                className="h-10 px-6 rounded-xl border border-white/[0.08] text-white/50 text-[13px] font-medium hover:text-white hover:border-white/[0.15] transition-colors flex items-center"
              >
                Learn more
              </Link>
            </div>
            <p className="text-[11px] text-white/20 mt-4">
              First client free. No credit card required.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}