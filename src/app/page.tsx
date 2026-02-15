import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Timer, FileText, Eye, CheckCircle2, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">RetainerFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">For freelancers who sell retainer packages</Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
          Manage retainer clients without the spreadsheet headache
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Stop stressing about retainer hours, billing, and client questions. RetainerFlow tracks time, generates invoices, and gives your clients full transparency — all automatically.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg">
              Start Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Timer, title: "Time Tracking", desc: "Start/stop timer or log hours manually. Track every minute against retainer packages." },
            { icon: FileText, title: "Auto Invoicing", desc: "Invoices generated automatically on billing day with full hour breakdowns." },
            { icon: Eye, title: "Client Portal", desc: "Give clients a read-only view of hours used, time entries, and invoices." },
            { icon: CheckCircle2, title: "Smart Alerts", desc: "Get notified at 80% and 100% of retainer hours. No more surprise overages." },
          ].map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-16" id="pricing">
        <h2 className="text-3xl font-bold text-center mb-2">Simple pricing</h2>
        <p className="text-muted-foreground text-center mb-10">Start free, upgrade as you grow.</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Free", price: "$0", desc: "Perfect for testing with 1 client", features: ["1 retainer client", "Time tracking", "Manual invoicing", "Basic dashboard"], cta: "Get Started" },
            { name: "Pro", price: "$19", desc: "For freelancers with multiple retainers", features: ["Up to 10 clients", "Client portal", "Auto-invoicing", "PDF invoices", "Email notifications"], cta: "Start Pro", popular: true },
            { name: "Business", price: "$39", desc: "For agencies or high-volume freelancers", features: ["Unlimited clients", "Everything in Pro", "Stripe auto-charge", "Priority support", "Analytics"], cta: "Start Business" },
          ].map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg relative" : ""}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.desc}</CardDescription>
                <div className="pt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "$0" && <span className="text-muted-foreground">/mo</span>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RetainerFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
