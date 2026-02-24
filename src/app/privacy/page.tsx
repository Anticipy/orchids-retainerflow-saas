import Link from "next/link"
import Image from "next/image"

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const LAST_UPDATED = "February 2025"

const sections = [
  {
    title: "Information we collect",
    body: `We collect information you give us directly: your name, email address, and password when you create an account. If you sign in with Google, we receive your name and email from Google. We also collect information about the clients you add, the time entries you log, and the invoices you generate — this is the core data that makes Retallio work.

We automatically collect basic usage data (pages visited, features used) and technical information (browser type, IP address) to keep the service running and improve it. We do not sell any of this data.`,
  },
  {
    title: "How we use your information",
    body: `We use your data to provide and operate Retallio: showing you your dashboard, generating invoices, powering client portals, and sending transactional emails (invoice sent, hours alerts, account verification). We may use aggregate, anonymised data to understand how people use Retallio and improve the product. We never use your client data for advertising.`,
  },
  {
    title: "Client portals",
    body: `When you create a client portal, your clients can view it via a unique link without logging in. The portal shows hours, time entries, and invoices for that client. You control what appears there — we simply display the data you've entered. Client portal links are not indexed by search engines, but anyone with the link can view the portal, so treat links as you would a shared document.`,
  },
  {
    title: "Data storage and security",
    body: `Your data is stored on Supabase (hosted on AWS). We use HTTPS for all data in transit and rely on Supabase's security infrastructure for data at rest. We do not store payment card details — payments are handled entirely by Stripe, who are PCI-DSS compliant. We take reasonable precautions, but no system is 100% secure. If we discover a breach that affects your data, we will notify you promptly.`,
  },
  {
    title: "Emails we send",
    body: `We send transactional emails related to your account (verification, password reset) and your Retallio activity (invoice generated, client near hours limit). If you enable email notifications in Settings, we'll also email you when clients hit 80% or 100% of their hours. We do not send marketing newsletters unless you explicitly opt in.`,
  },
  {
    title: "Third-party services",
    body: `Retallio uses the following third-party services: Supabase (database and authentication), Stripe (payment processing), and Resend (transactional email). Each has its own privacy policy. We share only the minimum data required for each service to function — for example, we share your email with Resend to send you emails, and your billing details with Stripe to process payments.`,
  },
  {
    title: "Your rights",
    body: `You can access, export, or delete your data at any time. To delete your account and all associated data, go to Settings or email us at privacy@retallio.app. We'll process deletion requests within 30 days. If you're in the EU or UK, you have additional rights under GDPR, including the right to data portability and the right to lodge a complaint with your supervisory authority.`,
  },
  {
    title: "Cookies",
    body: `We use a small number of essential cookies to keep you logged in and remember your session. We do not use tracking cookies or third-party advertising cookies. You can disable cookies in your browser, but this will prevent you from staying logged in.`,
  },
  {
    title: "Changes to this policy",
    body: `If we make material changes to this policy, we'll notify you by email or with a notice in the app before the changes take effect. The "last updated" date at the top of this page will always reflect when it was last revised.`,
  },
  {
    title: "Contact",
    body: `Questions about privacy? Email us at privacy@retallio.app. We're a small team and will respond personally.`,
  },
]

export default function PrivacyPage() {
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
            href="/terms"
            className="text-[13px] text-white/35 hover:text-white/70 transition-colors"
          >
            Terms of Service
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
          <h1 className="text-[36px] font-bold tracking-tight text-white mb-3">Privacy Policy</h1>
          <p className="text-[14px] text-white/35">Last updated: {LAST_UPDATED}</p>
          <p className="text-[15px] text-white/50 leading-relaxed mt-4 max-w-xl">
            We believe privacy policies should be readable. This one is written in plain English. Here's exactly what we collect, how we use it, and what rights you have.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i} className="group">
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
            <Link href="/terms" className="text-[12px] text-white/25 hover:text-white/50 transition-colors">
              Terms of Service
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