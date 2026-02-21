export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-4 py-16 relative">
      {/* Top glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)" }}
      />

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.15em] mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-sm text-white/30">Last updated: February 19, 2026</p>
        </div>

        <div className="space-y-10">
          {[
            {
              title: "Introduction",
              content: `Retallio ("we," "our," or "us") operates retallio.app (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.`,
            },
            {
              title: "Information We Collect",
              subsections: [
                {
                  subtitle: "Account Information",
                  text: "When you create an account, we collect: name, email address, password (encrypted), and profile information you choose to provide.",
                },
                {
                  subtitle: "Usage Data",
                  text: "We automatically collect: client information you create (names, hours, rates), time entries and descriptions, invoice data, browser type and version, IP address, and usage patterns.",
                },
                {
                  subtitle: "Authentication Data",
                  text: "If you sign in with Google, we receive your name, email address, and profile picture. We do not store your Google password.",
                },
              ],
            },
            {
              title: "How We Use Your Information",
              text: "We use your information to: provide and maintain the Service, process transactions and send invoices, send account notifications, respond to support requests, improve the Service, detect and prevent fraud, and comply with legal obligations.",
            },
            {
              title: "Data Sharing and Disclosure",
              subsections: [
                {
                  subtitle: "We Do NOT Sell Your Data",
                  text: "We do not sell, rent, or trade your personal information to third parties.",
                },
                {
                  subtitle: "Service Providers",
                  text: "We share data with: Supabase (database and authentication), Stripe (payment processing), Vercel (hosting), and Resend (email delivery). These providers are contractually obligated to protect your data.",
                },
                {
                  subtitle: "Client Portal Data",
                  text: "When you share a client portal link, the recipient can view time entries, hours, and invoices for that specific client only. Keep portal links confidential.",
                },
              ],
            },
            {
              title: "Data Security",
              text: "We implement industry-standard security: data encryption in transit (HTTPS/TLS), encryption at rest, secure password hashing, regular security audits, and access controls. No method of transmission is 100% secure — we cannot guarantee absolute security.",
            },
            {
              title: "Data Retention",
              text: "We retain your data for as long as your account is active or needed to provide the Service. If you delete your account, we'll delete your personal data within 30 days, except where legally required to retain it.",
            },
            {
              title: "Your Rights",
              text: "You have the right to: access a copy of your personal data, correct inaccurate data, request deletion of your account and data, download your data in a portable format, and unsubscribe from marketing emails. Contact us at privacy@retallio.app to exercise these rights.",
            },
            {
              title: "Cookies and Tracking",
              text: "We use cookies to: keep you signed in, remember preferences, and analyze usage patterns (via Vercel Analytics). You can control cookies through browser settings, but disabling them may affect functionality.",
            },
            {
              title: "Children's Privacy",
              text: "Our Service is not intended for users under 18. We do not knowingly collect data from children. If you believe we have, please contact us immediately.",
            },
            {
              title: "Changes to This Policy",
              text: "We may update this Privacy Policy from time to time. We'll notify you of significant changes by email or notice on our Service. Continued use constitutes acceptance.",
            },
            {
              title: "Contact Us",
              text: "Questions about this Privacy Policy? Email: privacy@retallio.app · Website: retallio.app",
            },
          ].map((section, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">{section.title}</h2>
              {"text" in section && section.text && (
                <p className="text-white/45 leading-relaxed text-sm">{section.text}</p>
              )}
              {"content" in section && section.content && (
                <p className="text-white/45 leading-relaxed text-sm">{section.content}</p>
              )}
              {"subsections" in section && section.subsections && (
                <div className="space-y-4">
                  {section.subsections.map((sub, j) => (
                    <div key={j}>
                      <h3 className="text-sm font-semibold text-white/70 mb-1.5">{sub.subtitle}</h3>
                      <p className="text-white/40 leading-relaxed text-sm">{sub.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}