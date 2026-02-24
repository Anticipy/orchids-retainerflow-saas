import Link from "next/link"
import Image from "next/image"

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const LAST_UPDATED = "February 2025"

const sections = [
  {
    title: "Who we are and what these terms cover",
    body: `Retallio is a retainer management tool for freelancers and agencies. These Terms of Service govern your use of retallio.app and any related services. By creating an account, you agree to these terms. If you don't agree, please don't use Retallio.

"You" means the freelancer or agency using Retallio to manage client retainers. "Your clients" means the people who access client portals you create through Retallio.`,
  },
  {
    title: "Your account",
    body: `You must be at least 16 years old to use Retallio. You're responsible for keeping your account credentials secure. If you suspect unauthorised access to your account, contact us immediately at support@retallio.app.

You may only create one free account. Creating multiple free accounts to circumvent plan limits is a violation of these terms and may result in account termination.`,
  },
  {
    title: "What you can and can't do",
    body: `You can use Retallio to manage your legitimate client retainer relationships, log your time, generate invoices, and share client portals. You can invite your own clients to view their portal.

You may not: use Retallio for any unlawful purpose; attempt to access other users' accounts or data; reverse engineer, copy, or resell Retallio; upload malicious content; or use automated scripts to scrape or abuse the service. We reserve the right to terminate accounts that violate these terms.`,
  },
  {
    title: "Free plan and paid plans",
    body: `The Free plan allows you to manage one active client retainer. Paid plans (Pro and Business) unlock additional clients and features, as described on our pricing page.

Plan limits are enforced per account. If you're on the Free plan and need more than one client, you'll need to upgrade. We'll always show you your current usage and what you'd get on a higher plan.`,
  },
  {
    title: "Payments and refunds",
    body: `Paid plans are billed monthly or annually, as selected at checkout. Payments are processed by Stripe. By subscribing, you authorise recurring charges to your payment method.

You can cancel anytime from Settings. Cancellation takes effect at the end of your current billing period — you retain access until then. We don't offer refunds for partial billing periods, but if you believe you've been incorrectly charged, contact us and we'll make it right.`,
  },
  {
    title: "Your data",
    body: `You own your data. The time entries, clients, invoices, and other content you create in Retallio belong to you. We don't claim any rights to it beyond what's necessary to provide the service.

If you delete your account, we'll delete your data within 30 days, except where we're legally required to retain records (e.g. for accounting purposes). You can export your data at any time — contact us at support@retallio.app if you need an export in a specific format.`,
  },
  {
    title: "Client portals",
    body: `When you create a client portal, you take responsibility for what's shared there. Don't share portals containing confidential information you don't have the right to share. Your clients' use of the portal is subject to your own client relationship, not these terms.

We're not a party to your agreements with your clients. Any disputes between you and your clients are your responsibility to resolve.`,
  },
  {
    title: "Availability and changes",
    body: `We aim to keep Retallio available 24/7, but we can't guarantee uninterrupted access. We perform maintenance, fix bugs, and occasionally have unexpected outages. We'll notify you of planned downtime where possible.

We may change or discontinue features at any time. For material changes that affect paid functionality, we'll give you at least 30 days' notice. If we discontinue Retallio entirely, we'll give you at least 90 days' notice and a way to export your data.`,
  },
  {
    title: "Limitation of liability",
    body: `Retallio is provided "as is." To the fullest extent permitted by law, we're not liable for indirect, incidental, or consequential damages arising from your use of the service — including lost revenue, lost clients, or data loss. Our total liability to you for any claim will not exceed the amount you've paid us in the 12 months before the claim.

This doesn't affect any rights you have that can't be limited by contract under applicable law.`,
  },
  {
    title: "Governing law",
    body: `These terms are governed by the laws of the jurisdiction in which Retallio is registered. Any disputes that can't be resolved informally will be handled through binding arbitration or the courts of that jurisdiction, at our election.`,
  },
  {
    title: "Contact",
    body: `Questions about these terms? Email us at support@retallio.app. We're real people and will respond personally.`,
  },
]

export default function TermsPage() {
  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      {/* Grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.028] mix-blend-screen"
        style={{ backgroundImage: GRAIN, backgroundSize: "200px 200px" }}
        aria-hidden
      />

      {/* Top bloom */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(109,40,217,0.18) 0%, transparent 75%)",
        }}
        aria-hidden
      />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Image src="/logo.png" alt="Retallio" width={22} height={22} className="object-contain" />
            <span className="text-[14px] font-semibold tracking-tight">Retallio</span>
          </Link>
          <Link
            href="/privacy"
            className="text-[13px] text-white/35 hover:text-white/70 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.2em] mb-3">
            Legal
          </p>
          <h1 className="text-[36px] font-bold tracking-tight text-white mb-3">Terms of Service</h1>
          <p className="text-[14px] text-white/35">Last updated: {LAST_UPDATED}</p>
          <p className="text-[15px] text-white/50 leading-relaxed mt-4 max-w-xl">
            Plain English, as much as possible. These terms explain what you can do with Retallio, what we're responsible for, and what happens if things go wrong.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i}>
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 mt-1 text-[11px] font-semibold text-white/15 tabular-nums w-5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[16px] font-semibold text-white mb-2 leading-snug">
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.body.split("\n\n").map((para, j) => (
                      <p key={j} className="text-[14px] text-white/45 leading-[1.75]">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              {i < sections.length - 1 && (
                <div className="mt-10 ml-9 h-px bg-white/[0.04]" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-4">
          <p className="text-[12px] text-white/20">© {new Date().getFullYear()} Retallio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-[12px] text-white/25 hover:text-white/50 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="text-[12px] text-white/25 hover:text-white/50 transition-colors">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}