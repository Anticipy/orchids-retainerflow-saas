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

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <p className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.15em] mb-4">
            Blog
          </p>
          <h1
            className="text-[44px] font-bold tracking-tight text-white leading-[1.1] mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            Thoughts on freelancing
            <br />
            and client relationships.
          </h1>
          <p className="text-[16px] text-white/35 leading-relaxed">
            Real talk about running a freelance business, managing retainer
            clients, and getting paid without the awkward conversations.
          </p>
        </div>

        {/* Featured post — first one, bigger */}
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
              className="text-[26px] sm:text-[30px] font-bold text-white/85 group-hover:text-white transition-colors leading-tight mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              {posts[0].title}
            </h2>
            <p className="text-[15px] text-white/40 leading-relaxed mb-6 max-w-2xl">
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
                    <span className="text-[11px] text-white/25">
                      {post.date}
                    </span>
                    <span className="text-white/15">·</span>
                    <span className="text-[11px] text-white/25">
                      {post.readTime}
                    </span>
                  </div>
                  <h2
                    className="text-[18px] font-semibold text-white/75 group-hover:text-white transition-colors leading-snug mb-2"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {post.title}
                  </h2>
                  <p className="text-[13px] text-white/30 leading-relaxed">
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
            <p className="text-[14px] text-white/25">
              First post coming soon.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}