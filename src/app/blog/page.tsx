import Link from "next/link"
import Image from "next/image"
import { getAllPosts } from "@/lib/blog"

export const metadata = {
  title: "Blog – Retallio",
  description: "Real talk about freelancing, retainer clients, and getting paid without the awkward conversations.",
  alternates: {
    canonical: "https://www.retallio.app/blog",
  },
  openGraph: {
    title: "The Retallio Blog",
    description: "Real talk about freelancing, retainer clients, and getting paid without the awkward conversations.",
    url: "https://www.retallio.app/blog",
    siteName: "Retallio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Retallio Blog",
    description: "Real talk about freelancing, retainer clients, and getting paid without the awkward conversations.",
    site: "@retallioapp",
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()
  const [featured, ...rest] = posts

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
            <Link href="/" className="text-[15px] text-black/40 hover:text-black/70 transition-colors">← Home</Link>
            <Link
              href="/signup"
              className="h-10 px-6 rounded-lg bg-violet-600 text-white text-[14px] font-semibold hover:bg-violet-700 transition-colors flex items-center"
            >
              Try free
            </Link>
          </div>
        </div>
      </header>

      {/* Blog header */}
      <div className="border-b border-black/[0.06] bg-white">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <p className="text-[11px] font-semibold text-violet-600 uppercase tracking-[0.18em] mb-5">
            The Retallio Blog
          </p>
          <h1 className="text-[42px] sm:text-[54px] font-bold tracking-tight text-black leading-[1.1] mb-5" style={{ letterSpacing: "-0.03em" }}>
            Freelancing, retainers, and<br className="hidden sm:block" /> getting paid without the drama.
          </h1>
          <p className="text-[18px] text-black/45 max-w-2xl mx-auto leading-relaxed">
            Real talk about running a freelance business, managing retainer clients, and building trust with the people who pay you.
          </p>
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="w-8 h-8 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-[12px] font-bold text-violet-600">
              I
            </div>
            <span className="text-[14px] text-black/40">By Ionut M. Diaconu</span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-14">

        {/* Featured post */}
        {featured && (
          <div className="mb-14">
            <p className="text-[11px] font-semibold text-black/30 uppercase tracking-[0.15em] mb-5">Latest</p>
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden hover:border-violet-300 hover:shadow-[0_8px_40px_rgba(109,40,217,0.08)] transition-all duration-300">
                <div className="p-8 sm:p-10">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[11px] font-semibold text-violet-600 uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-violet-50 border border-violet-100">
                      Freelancing
                    </span>
                    <span className="text-black/20">·</span>
                    <span className="text-[14px] text-black/35">{featured.date}</span>
                    <span className="text-black/20">·</span>
                    <span className="text-[14px] text-black/35">{featured.readTime}</span>
                  </div>
                  <h2 className="text-[28px] sm:text-[36px] font-bold tracking-tight text-black leading-[1.2] mb-4 group-hover:text-violet-700 transition-colors" style={{ letterSpacing: "-0.02em" }}>
                    {featured.title}
                  </h2>
                  <p className="text-[18px] text-black/50 leading-relaxed max-w-2xl mb-6">
                    {featured.excerpt}
                  </p>
                  <span className="text-[13px] font-semibold text-violet-600 group-hover:text-violet-700 transition-colors">
                    Read article →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <>
            <p className="text-[11px] font-semibold text-black/30 uppercase tracking-[0.15em] mb-6">All posts</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden hover:border-violet-300 hover:shadow-[0_4px_24px_rgba(109,40,217,0.07)] transition-all duration-300 h-full flex flex-col">
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-semibold text-violet-600 uppercase tracking-[0.15em]">
                          Freelancing
                        </span>
                        <span className="text-black/15">·</span>
                        <span className="text-[12px] text-black/30">{post.date}</span>
                      </div>
                      <h3 className="text-[19px] font-bold tracking-tight text-black leading-[1.3] mb-3 group-hover:text-violet-700 transition-colors flex-1" style={{ letterSpacing: "-0.01em" }}>
                        {post.title}
                      </h3>
                      <p className="text-[15px] text-black/45 leading-relaxed mb-5 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[12px] text-black/30">{post.readTime}</span>
                        <span className="text-[13px] font-semibold text-violet-600 group-hover:text-violet-700 transition-colors">
                          Read →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 rounded-2xl bg-violet-600 p-10 text-center">
          <p className="text-[11px] font-semibold text-violet-200 uppercase tracking-[0.18em] mb-3">Retallio</p>
          <h3 className="text-[28px] font-bold text-white mb-3 leading-tight" style={{ letterSpacing: "-0.02em" }}>
            Stop explaining your invoices.
          </h3>
          <p className="text-[16px] text-violet-200 mb-7 leading-relaxed max-w-sm mx-auto">
            Give clients a live portal. They watch your hours build all month. Invoice arrives — no questions.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center h-10 px-6 rounded-xl bg-white text-violet-700 text-[13px] font-semibold hover:bg-violet-50 transition-colors"
          >
            Get started free →
          </Link>
          <p className="text-[11px] text-violet-300 mt-4">First client free. No credit card required.</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] py-8 mt-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Retallio" className="w-4 h-4 object-contain opacity-40" />
            <span className="text-[12px] text-black/30">© {new Date().getFullYear()} Retallio</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-[12px] text-black/30 hover:text-black/60 transition-colors">Home</Link>
            <Link href="/privacy" className="text-[12px] text-black/30 hover:text-black/60 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[12px] text-black/30 hover:text-black/60 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}