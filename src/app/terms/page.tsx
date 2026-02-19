export default function TermsPage() {
    return (
      <div className="min-h-screen bg-background px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: February 19, 2026</p>
  
          <div className="space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using Retallio (&quot;Service&quot;), you agree to be bound by these Terms of Service 
                (&quot;Terms&quot;). If you disagree with any part of these Terms, you may not access the Service.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Retallio is a retainer management platform that provides time tracking, invoicing, client portals, 
                and related features for freelancers and service providers managing retainer-based clients.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Account Registration</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Eligibility</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You must be at least 18 years old to use this Service. By registering, you represent that you meet this requirement.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Account Security</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">You are responsible for:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Accurate Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                You agree to provide accurate, current, and complete information during registration and to update 
                it as necessary to maintain its accuracy.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Subscription Plans and Billing</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Free Plan</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Free plan allows management of 1 client with basic features. No credit card is required.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Paid Plans</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pro ($19/month) and Business ($39/month) plans provide additional features and client limits. 
                Paid subscriptions are billed monthly in advance.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Payment Processing</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Payments are processed securely through Stripe. By subscribing, you authorize us to charge your 
                payment method on a recurring basis.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Cancellation and Refunds</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>You may cancel your subscription at any time from your account settings</li>
                <li>Cancellations take effect at the end of the current billing period</li>
                <li>No refunds are provided for partial months</li>
                <li>You retain access to paid features until the end of your billing period</li>
              </ul>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Price Changes</h3>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We reserve the right to change subscription prices with 30 days&apos; notice. Continued use of the 
                Service after a price change constitutes acceptance of the new price.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Acceptable Use</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-3">You May:</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Use the Service for lawful business purposes</li>
                <li>Create and manage client retainer relationships</li>
                <li>Track time and generate invoices</li>
                <li>Share client portal links with your clients</li>
              </ul>
  
              <h3 className="text-xl font-medium mt-6 mb-3">You May NOT:</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious code or viruses</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the Service to send spam or unsolicited communications</li>
                <li>Resell or redistribute the Service without permission</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Use automated systems to access the Service excessively</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">User Content</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Your Content</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You retain ownership of all data you input into the Service (client names, time entries, invoices, etc.). 
                By using the Service, you grant us a license to use, store, and process your content solely to provide 
                the Service to you.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Responsibility</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You are solely responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>The accuracy of data you enter</li>
                <li>Compliance with tax and accounting regulations</li>
                <li>Client agreements and invoicing terms</li>
                <li>Backup of critical business data</li>
              </ul>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Data Export</h3>
              <p className="text-muted-foreground leading-relaxed">
                You may export your data at any time through your account settings.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Service, including its design, features, code, and content (excluding user content), is owned by 
                Retallio and protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You may not copy, modify, distribute, sell, or lease any part of the Service without our express written permission.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Uptime</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We strive to maintain high availability but do not guarantee uninterrupted access. The Service may be 
                unavailable due to maintenance, updates, or factors beyond our control.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Modifications</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time with or 
                without notice. We are not liable for any such changes.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Beta Features</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may offer beta or experimental features. These are provided &quot;as is&quot; without warranties 
                and may be changed or removed at any time.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Termination</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-3">By You</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You may terminate your account at any time by deleting it through your account settings or contacting us.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">By Us</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may suspend or terminate your account if you:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Violate these Terms</li>
                <li>Use the Service fraudulently or illegally</li>
                <li>Fail to pay subscription fees</li>
                <li>Pose a security risk</li>
              </ul>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Effect of Termination</h3>
              <p className="text-muted-foreground leading-relaxed">
                Upon termination, your access to the Service will cease immediately. We will retain your data for 
                30 days before permanent deletion, unless required by law to retain it longer.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Disclaimers</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, 
                EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                <li>Guarantees of accuracy, reliability, or availability</li>
                <li>Warranties that the Service will be error-free or secure</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We are not responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-2">
                <li>Errors in your data or invoicing</li>
                <li>Tax compliance or accounting accuracy</li>
                <li>Client disputes or non-payment</li>
                <li>Third-party service failures (Stripe, Supabase, etc.)</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, RETALLIO SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Damages resulting from use or inability to use the Service</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Our total liability for any claim arising from these Terms or the Service shall not exceed the amount 
                you paid us in the 12 months preceding the claim, or $100, whichever is greater.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless Retallio from any claims, damages, losses, or expenses 
                (including legal fees) arising from your use of the Service, violation of these Terms, or infringement 
                of any rights of others.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Governing Law</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These Terms are governed by the laws of [Your Country/State], without regard to conflict of law principles.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Arbitration</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Any disputes arising from these Terms or the Service shall be resolved through binding arbitration, 
                except that either party may seek injunctive relief in court for intellectual property violations.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Class Action Waiver</h3>
              <p className="text-muted-foreground leading-relaxed">
                You agree to resolve disputes on an individual basis and waive the right to participate in class actions 
                or class-wide arbitration.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">General Provisions</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-3">Entire Agreement</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and Retallio.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Severability</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If any provision of these Terms is found invalid, the remaining provisions remain in effect.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Waiver</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Failure to enforce any provision does not constitute a waiver of that provision.
              </p>
  
              <h3 className="text-xl font-medium mt-6 mb-3">Assignment</h3>
              <p className="text-muted-foreground leading-relaxed">
                You may not assign these Terms without our consent. We may assign these Terms without restriction.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these Terms from time to time. We will notify you of material changes by email or through 
                a notice on our Service at least 30 days before they take effect. Your continued use after changes 
                constitutes acceptance of the updated Terms.
              </p>
            </section>
  
            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about these Terms, contact us:
              </p>
              <ul className="list-none text-muted-foreground space-y-2">
                <li><strong>Email:</strong> legal@retallio.app</li>
                <li><strong>Website:</strong> https://retallio.app</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    )
  }