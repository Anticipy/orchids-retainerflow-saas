import Link from "next/link"
import { getPostBySlug, getAllPosts } from "@/lib/blog"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} – Retallio Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
    alternates: {
      canonical: `https://www.retallio.app/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      {/* Subtle top bloom */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(109,40,217,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
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
        {/* Hero section */}
        <div className="max-w-3xl mx-auto px-6 pt-16 pb-12">
          {/* Tag + date */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[11px] font-semibold text-violet-400/80 uppercase tracking-[0.15em]">
              Freelancing
            </span>
            <span className="text-white/15">·</span>
            <span className="text-[12px] text-white/30">{post.date}</span>
            <span className="text-white/15">·</span>
            <span className="text-[12px] text-white/30">{post.readTime}</span>
          </div>

          {/* Title */}
          <h1
            className="text-[40px] sm:text-[48px] font-bold tracking-tight text-white leading-[1.1] mb-6"
            style={{ letterSpacing: "-0.03em" }}
          >
            {post.title}
          </h1>

          {/* Excerpt / standfirst */}
          <p className="text-[18px] text-white/50 leading-relaxed max-w-2xl">
            {post.excerpt}
          </p>
        </div>

        {/* Divider */}
        <div className="max-w-3xl mx-auto px-6">
          <div className="h-px bg-white/[0.06]" />
        </div>

        {/* Opening hook — big pull quote style */}
        {post.hook && (
        <div className="max-w-3xl mx-auto px-6 pt-12 pb-4">
          <p
            className="text-[26px] sm:text-[30px] font-semibold text-white/85 leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            {post.hook}
          </p>
        </div>
        )}

        {/* Visual break — iMessage mockup */}
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div
            className="rounded-2xl border p-6 space-y-3"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <p className="text-[11px] font-semibold text-white/20 uppercase tracking-[0.12em] mb-4">
              A real conversation. Every month.
            </p>
            {/* Client message */}
            <div className="flex justify-start">
              <div
                className="max-w-[75%] px-4 py-2.5 rounded-[18px] rounded-bl-sm text-[14px] text-white/80 leading-snug"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                Why does the invoice say 22hrs? I thought we agreed on 20?
              </div>
            </div>
            {/* Freelancer message */}
            <div className="flex justify-end">
              <div
                className="max-w-[75%] px-4 py-2.5 rounded-[18px] rounded-br-sm text-[14px] text-white/80 leading-snug"
                style={{ background: "rgba(109,40,217,0.35)", border: "1px solid rgba(167,139,250,0.2)" }}
              >
                We discussed this on the call. The extra hours were approved.
              </div>
            </div>
            {/* Client message */}
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
        </div>

        {/* Article body */}
        <article className="max-w-3xl mx-auto px-6 pb-12">
          <div
            className="prose-retallio"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>

        {/* Divider */}
        <div className="max-w-3xl mx-auto px-6">
          <div className="h-px bg-white/[0.06]" />
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
              className="text-[28px] font-bold text-white mb-3 leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              Stop explaining your invoices.
            </h3>
            <p className="text-[15px] text-white/40 mb-8 leading-relaxed max-w-sm mx-auto">
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