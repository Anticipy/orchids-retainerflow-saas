import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "sonner";
import { VisualEditsMessenger } from "orchids-visual-edits";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // ── Core ────────────────────────────────────────────────────────────
  title: {
    default: "Retallio – Retainer Management for Freelancers & Consultants",
    template: "%s | Retallio",
  },
  description:
    "Retallio gives every retainer client a live portal to track hours, view work logs, and watch their invoice build in real time. No more invoice disputes. No more explaining your hours.",
  keywords: [
    "retainer management",
    "freelancer retainer tool",
    "client portal freelance",
    "time tracking for clients",
    "invoice transparency",
    "retainer client management",
    "freelance billing software",
    "consultant retainer tool",
    "client hour tracking",
    "retainer invoice software",
    "toggl alternative",
    "harvest alternative",
    "freelance client management",
  ],
  authors: [{ name: "Retallio", url: "https://www.retallio.app" }],
  creator: "Retallio",
  publisher: "Retallio",
  applicationName: "Retallio",
  category: "Business Software",

  // ── Canonical & robots ──────────────────────────────────────────────
  metadataBase: new URL("https://www.retallio.app"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Open Graph ──────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.retallio.app",
    siteName: "Retallio",
    title: "Retallio – Retainer Management for Freelancers & Consultants",
    description:
      "Give every retainer client a live portal. They watch your hours build in real time. By the time the invoice lands, there are no questions.",
    images: [
      {
        url: "/og-image.png", // create a 1200x630 image and put it in /public
        width: 1200,
        height: 630,
        alt: "Retallio – Live client portal for retainer management",
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X ─────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@retallioapp",
    creator: "@retallioapp",
    title: "Retallio – Retainer Management for Freelancers & Consultants",
    description:
      "Give every retainer client a live portal. They watch your hours build in real time. By the time the invoice lands, there are no questions.",
    images: ["/og-image.png"],
  },

  // ── Icons / favicon ─────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

// ── Structured data (JSON-LD) ──────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Retallio",
  url: "https://www.retallio.app",
  logo: "https://www.retallio.app/logo.png",
  description:
    "Retallio gives every retainer client a live portal to track hours, view work logs, and watch their invoice build in real time. No more invoice disputes.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "19",
    priceCurrency: "USD",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "19",
      priceCurrency: "USD",
      unitText: "MONTH",
    },
  },
  featureList: [
    "Live client portal",
    "Real-time hour tracking",
    "Automatic invoice generation",
    "Retainer management",
    "Client transparency dashboard",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Explicit canonical for www */}
        <link rel="canonical" href="https://www.retallio.app" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0c0c0c",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "#fff",
              fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
              fontSize: "13px",
            },
          }}
        />
        <Analytics />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
