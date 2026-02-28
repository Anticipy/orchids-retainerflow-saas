import Link from "next/link"
import { getAllPosts } from "@/lib/blog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog – Retallio",
  description:
    "Thoughts on freelancing, retainer clients, and building transparent client relationships.",
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      {/* Bloom */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(109,40,217,0.09) 0%, transparent 70%)",
        }}
      />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <img src="/logo.png" alt="Retallio" className="w-6 h-6 object-contain" />
            <span className="text-[14px] font-semibold text-white/80">Retallio</span>
          </Link>
          <Link
            href="/signup"
            className="h-8 px-4 rounded-lg bg-white text-black text-[12px] font-semibold hover:bg-white/90 transition-colors flex items-center"
          >
            Try free
          </Link>
        </div>
      </header>

      {/* Hero — full width with background, matches BlogPostClient */}
      <div
        className="w-full border-b border-white/[0.05]"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(109,40,217,0.13) 0%, transparent 70%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-14 text-center">
          {/* Label row */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span
              className="text-[11px] font-semibold text-violet-400/90 uppercase tracking-[0.18em] px-3 py-1 rounded-full border border-violet-400/20"
              style={{ background: "rgba(109,40,217,0.1)" }}
            >
              Blog
            </span>
          </div>

          {/* Big centered title */}
          <h1
            className="font-bold text-white leading-[1.08] mb-6"
            style={{
              fontSize: "clamp(36px, 5vw, 52px)",
              letterSpacing: "-0.03em",
            }}
          >
            Thoughts on freelancing
            <br />
            and client relationships.
          </h1>

          {/* Excerpt */}
          <p
            className="text-white/45 leading-relaxed max-w-2xl mx-auto mb-8"
            style={{ fontSize: "18px", lineHeight: "1.75" }}
          >
            Real talk about running a freelance business, managing retainer
            clients, and getting paid without the awkward conversations.
          </p>

          {/* Author row */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-500/30 border border-violet-400/30 flex items-center justify-center text-[11px] font-bold text-violet-300">
              I
            </div>
            <span className="text-[13px] text-white/35">By Ionut M. Diaconu</span>
          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16">

        {/* Featured post */}
        {posts.length > 0 && (
          <Link
            href={`/blog/${posts[0].slug}`}
            className="group block mb-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.035] hover:border-white/[0.1] transition-all p-8 sm:p-10"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-semibold text-violet-400/80 uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border border-violet-400/20 bg-violet-400/[0.06]">
                Latest
              </span>
              <span className="text-[12px] text-white/25">{posts[0].date}</span>
              <span className="text-white/15">·</span>
              <span className="text-[12px] text-white/25">
                {posts[0].readTime}
              </span>
            </div>
            <h2
              className="font-bold text-white/85 group-hover:text-white transition-colors leading-tight mb-4"
              style={{ fontSize: "clamp(22px, 3vw, 30px)", letterSpacing: "-0.02em" }}
            >
              {posts[0].title}
            </h2>
            <p
              className="text-white/40 leading-relaxed mb-6 max-w-2xl"
              style={{ fontSize: "16px", lineHeight: "1.75" }}
            >
              {posts[0].excerpt}
            </p>
            <span className="text-[13px] font-medium text-violet-400/70 group-hover:text-violet-400 transition-colors">
              Read article →
            </span>
          </Link>
        )}

        {/* Rest of posts */}
        {posts.length > 1 && (
          <div className="grid gap-px">
            {posts.slice(1).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex items-start justify-between py-7 border-b border-white/[0.05] hover:border-white/[0.09] transition-colors"
              >
                <div className="pr-8 max-w-2xl">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-[11px] text-white/25">{post.date}</span>
                    <span className="text-white/15">·</span>
                    <span className="text-[11px] text-white/25">{post.readTime}</span>
                  </div>
                  <h2
                    className="font-semibold text-white/75 group-hover:text-white transition-colors leading-snug mb-2"
                    style={{ fontSize: "19px", letterSpacing: "-0.015em", lineHeight: "1.4" }}
                  >
                    {post.title}
                  </h2>
                  <p
                    className="text-white/30 leading-relaxed"
                    style={{ fontSize: "14px", lineHeight: "1.7" }}
                  >
                    {post.excerpt}
                  </p>
                </div>
                <span className="text-white/20 group-hover:text-violet-400/60 transition-colors mt-1 flex-shrink-0 text-[20px]">
                  →
                </span>
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[14px] text-white/25">First post coming soon.</p>
          </div>
        )}
        </main>
    </div>
  )
}