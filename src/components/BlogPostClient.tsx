"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

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
      <p className="text-[11px] font-semibold text-black/30 uppercase tracking-[0.15em] mb-5">
        Contents
      </p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block leading-snug transition-colors py-1.5 border-l-2 ${
              item.level === 3 ? "pl-4 text-[14px]" : "pl-3 text-[16px] font-medium"
            } ${
              active === item.id
                ? "text-violet-600 border-violet-500"
                : "text-black/35 hover:text-black/70 border-transparent hover:border-black/15"
            }`}
          >
            {item.text}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default function BlogPostClient({ post }: { post: Post }) {
  const toc = extractTOC(post.contentHtml)

  return (
    <div className="min-h-screen bg-[#fafaf9]" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-70 transition-opacity">
            <img src="/logo.png" alt="Retallio" className="w-8 h-8 object-contain" />
            <span className="text-[18px] font-semibold text-black/80">Retallio</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-[15px] text-black/40 hover:text-black/70 transition-colors">
              ← All posts
            </Link>
            <Link
              href="/signup"
              className="h-10 px-6 rounded-lg bg-violet-600 text-white text-[14px] font-semibold hover:bg-violet-700 transition-colors flex items-center"
            >
              Try free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <div className="w-full bg-white border-b border-black/[0.06]">
          <div className="max-w-4xl mx-auto px-6 pt-16 pb-14 text-center">
            {/* Label row */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-[11px] font-semibold text-violet-600 uppercase tracking-[0.18em] px-3 py-1 rounded-full bg-violet-50 border border-violet-100">
                Freelancing
              </span>
              <span className="text-black/20">·</span>
              <span className="text-[13px] text-black/40">{post.date}</span>
              <span className="text-black/20">·</span>
              <span className="text-[13px] text-black/40">{post.readTime}</span>
            </div>

            {/* Title */}
            <h1
              className="text-[40px] sm:text-[54px] font-bold tracking-tight text-black leading-[1.1] mb-6"
              style={{ letterSpacing: "-0.03em" }}
            >
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-[20px] text-black/50 leading-relaxed max-w-2xl mx-auto">
              {post.excerpt}
            </p>

            {/* Author */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <div className="w-7 h-7 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-[11px] font-bold text-violet-600">
                I
              </div>
              <span className="text-[13px] text-black/40">By Ionut Diaconu</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex gap-16 items-start">

            {/* Article */}
            <div className="flex-1 min-w-0">

              {/* Hook */}
              {post.hook && (
                <p
                  className="text-[24px] sm:text-[28px] font-semibold text-black/80 leading-tight mb-8"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {post.hook}
                </p>
              )}

              {/* iMessage visual — only for first post */}
              {post.slug === "why-freelancers-lose-clients-over-invoices" && (
                <div className="rounded-2xl border border-black/[0.07] bg-white p-6 space-y-3 mb-10 shadow-sm">
                  <p className="text-[11px] font-semibold text-black/25 uppercase tracking-[0.12em] mb-4">
                    A real conversation. Every month.
                  </p>
                  <div className="flex justify-start">
                    <div className="max-w-[75%] px-4 py-2.5 rounded-[18px] rounded-bl-sm text-[14px] text-black/70 leading-snug bg-black/[0.05]">
                      Why does the invoice say 22hrs? I thought we agreed on 20?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[75%] px-4 py-2.5 rounded-[18px] rounded-br-sm text-[14px] text-white leading-snug bg-violet-600">
                      We discussed this on the call. The extra hours were approved.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[75%] px-4 py-2.5 rounded-[18px] rounded-bl-sm text-[14px] text-black/70 leading-snug bg-black/[0.05]">
                      Let me check with my team and get back to you...
                    </div>
                  </div>
                  <p className="text-[11px] text-black/25 text-center pt-2">Sound familiar?</p>
                </div>
              )}

              <article>
                <div className="prose-retallio-light" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
              </article>
            </div>

            {/* Sidebar */}
            <aside className="hidden xl:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <TableOfContents items={toc} />

                {/* CTA */}
                <div className="mt-8 rounded-xl border border-violet-200 bg-violet-50 p-5 text-center">
                  <p className="text-[15px] font-semibold text-black/75 mb-2 leading-snug">
                    Stop explaining your invoices.
                  </p>
                  <p className="text-[14px] text-black/45 mb-4 leading-relaxed">
                    Give clients a live portal. Free to start.
                  </p>
                  <Link
                    href="/signup"
                    className="block w-full h-9 rounded-lg bg-violet-600 text-white text-[13px] font-semibold hover:bg-violet-700 transition-colors flex items-center justify-center"
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
          <div className="h-px bg-black/[0.06]" />
        </div>

        {/* Bottom CTA */}
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="rounded-2xl bg-violet-600 p-14 text-center">
            <p className="text-[12px] font-semibold text-violet-200 uppercase tracking-[0.15em] mb-4">
              Retallio
            </p>
            <h3
              className="text-[34px] font-bold text-white mb-4 leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              Stop explaining your invoices.
            </h3>
            <p className="text-[17px] text-violet-200 mb-8 leading-relaxed max-w-md mx-auto">
              Give your clients a live portal. They watch your hours build in real time. By the time the invoice arrives, there are no questions.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/signup"
                className="h-12 px-8 rounded-xl bg-white text-violet-700 text-[15px] font-semibold hover:bg-violet-50 transition-colors flex items-center"
              >
                Get started free
              </Link>
              <Link
                href="/"
                className="h-12 px-8 rounded-xl border border-violet-400/40 text-violet-200 text-[15px] font-medium hover:text-white hover:border-violet-300 transition-colors flex items-center"
              >
                Learn more
              </Link>
            </div>
            <p className="text-[13px] text-violet-300 mt-5">First client free. No credit card required.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Retallio" className="w-4 h-4 object-contain opacity-40" />
            <span className="text-[12px] text-black/30">© {new Date().getFullYear()} Retallio</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/blog" className="text-[12px] text-black/30 hover:text-black/60 transition-colors">Blog</Link>
            <Link href="/privacy" className="text-[12px] text-black/30 hover:text-black/60 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[12px] text-black/30 hover:text-black/60 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}