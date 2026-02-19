export default function PrivacyPage() {
    return (
      <div className="min-h-screen bg-background px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: February 19, 2026</p>
  
          <div className="space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Retallio (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates retallio.app (the &quot;Service&quot;). 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Account Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you create an account, we collect:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Password (encrypted)</li>
                <li>Profile information you choose to provide</li>
              </ul>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Usage Data</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We automatically collect certain information when you use our Service:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Client information you create (names, hours, rates)</li>
                <li>Time entries and descriptions</li>
                <li>Invoice data</li>
                <li>Browser type and version</li>
                <li>IP address</li>
                <li>Usage patterns and preferences</li>
              </ul>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Authentication Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                If you sign in with Google, we receive your name, email address, and profile picture from Google. 
                We do not store your Google password.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">We use your information to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide and maintain the Service</li>
                <li>Process your transactions and send invoices</li>
                <li>Send you notifications about your account</li>
                <li>Respond to your requests and provide customer support</li>
                <li>Improve and optimize our Service</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-3">We Do NOT Sell Your Data</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell, rent, or trade your personal information to third parties.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Service Providers</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We share data with trusted service providers who help us operate our Service:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Supabase</strong> - Database and authentication</li>
                <li><strong>Stripe</strong> - Payment processing</li>
                <li><strong>Vercel</strong> - Hosting and infrastructure</li>
                <li><strong>Resend</strong> - Email delivery</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                These providers are contractually obligated to protect your data and use it only for the services they provide to us.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Client Portal Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you share a client portal link, the recipient can view time entries, hours used, and invoice information 
                for that specific client only. Portal links are unique and should be kept confidential.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Legal Requirements</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may disclose your information if required by law, court order, or government request, or to protect 
                our rights, property, or safety.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Data encryption in transit (HTTPS/TLS)</li>
                <li>Data encryption at rest</li>
                <li>Secure password hashing</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your data, 
                we cannot guarantee absolute security.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your data for as long as your account is active or as needed to provide the Service. 
                If you delete your account, we will delete your personal data within 30 days, except where we are 
                required to retain it for legal, accounting, or security purposes.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Export:</strong> Download your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, contact us at privacy@retallio.app or through your account settings.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Keep you signed in</li>
                <li>Remember your preferences</li>
                <li>Analyze usage patterns (via Vercel Analytics)</li>
                <li>Improve our Service</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You can control cookies through your browser settings, but disabling them may affect functionality.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Children&apos;s Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service is not intended for users under 18 years of age. We do not knowingly collect data from children. 
                If you believe we have collected data from a child, please contact us immediately.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data may be transferred to and processed in countries other than your own. We ensure appropriate 
                safeguards are in place to protect your data in accordance with this Privacy Policy.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of significant changes by email 
                or through a notice on our Service. Your continued use of the Service after changes constitutes acceptance 
                of the updated policy.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about this Privacy Policy or our data practices, contact us:
              </p>
              <ul className="list-none text-muted-foreground space-y-2">
                <li><strong>Email:</strong> privacy@retallio.app</li>
                <li><strong>Website:</strong> https://retallio.app</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    )
  }