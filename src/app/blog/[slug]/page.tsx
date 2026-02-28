import { getPostBySlug, getAllPosts } from "@/lib/blog"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import BlogPostClient from "@/components/BlogPostClient"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

// Per-article keyword map — each article targets its own specific searches
const articleKeywords: Record<string, string[]> = {
  "why-freelancers-lose-clients-over-invoices": [
    "freelance invoice dispute",
    "client questioning invoice",
    "why clients dispute invoices",
    "freelancer invoice problems",
    "client invoice conversation",
    "retainer invoice dispute",
    "freelance billing problems",
    "client transparency freelance",
  ],
  "how-to-manage-retainer-clients-without-spreadsheets": [
    "retainer client management",
    "manage retainer clients",
    "freelance retainer tracking",
    "retainer management without spreadsheets",
    "track retainer hours",
    "retainer billing software",
    "freelance client management tool",
    "retainer management tool",
  ],
  "7-best-retainer-management-tools-for-freelancers-2026": [
    "best retainer management tools",
    "retainer management software freelancers",
    "best retainer software 2026",
    "retainer tools for freelancers",
    "freelance retainer software",
    "retainer billing tools",
    "harvest alternative freelancers",
    "toggl alternative retainer",
    "bonsai alternative",
    "retainable alternative",
    "client portal software freelancers",
  ],
  "what-clients-actually-think": [
    "why clients question invoices",
    "client invoice questions",
    "freelance client trust",
    "invoice transparency freelance",
    "client invoice anxiety",
    "stop invoice disputes",
    "freelance billing transparency",
  ],
  "retainer-vs-project-billing": [
    "retainer vs project billing",
    "freelance retainer vs project",
    "is retainer better than project billing",
    "freelance billing model",
    "retainer income freelance",
    "project vs retainer freelancer",
    "best billing model freelancers",
  ],
  "how-to-price-a-retainer": [
    "how to price a retainer",
    "freelance retainer pricing",
    "retainer pricing formula",
    "how much to charge for retainer",
    "retainer rate freelance",
    "freelance retainer price calculator",
    "retainer pricing guide",
    "how to quote a retainer",
  ],
  "how-to-raise-retainer-rates": [
    "how to raise freelance rates",
    "raise retainer rate",
    "increase freelance retainer price",
    "how to increase freelance rates",
    "freelance rate increase",
    "raising rates retainer client",
    "how to charge more freelance",
  ],
  "what-is-a-client-portal": [
    "what is a client portal",
    "client portal freelancers",
    "freelance client portal",
    "best client portal for freelancers",
    "client portal software",
    "client portal retainer",
    "freelancer client access portal",
    "client visibility tool freelance",
  ],
  "how-to-stop-scope-creep": [
    "scope creep retainer",
    "stop scope creep freelance",
    "how to prevent scope creep",
    "retainer scope creep",
    "freelance scope management",
    "scope creep billing",
    "managing scope freelance retainer",
  ],
  "freelance-retainer-agreement": [
    "freelance retainer agreement",
    "retainer agreement template",
    "best retainer contract template",
    "freelance retainer contract",
    "retainer agreement what to include",
    "retainer agreement freelancer",
    "monthly retainer contract template",
    "retainer contract terms",
  ],
  "toggl-alternatives-freelancers": [
    "toggl alternatives",
    "best toggl alternative",
    "toggl alternative freelancers",
    "toggl alternative with invoicing",
    "toggl alternative client portal",
    "time tracking alternative toggl",
    "harvest vs toggl",
    "clockify vs toggl",
    "best time tracker freelancers 2026",
  ],
  "how-to-get-retainer-clients": [
    "how to get retainer clients",
    "find retainer clients",
    "get freelance retainer clients",
    "convert project clients to retainer",
    "freelance retainer clients",
    "how to land retainer clients",
    "retainer client acquisition",
  ],
  "freelance-invoice-best-practices": [
    "freelance invoice best practices",
    "get paid faster freelance",
    "freelance invoicing tips",
    "best freelance invoicing",
    "invoice faster freelance",
    "how to invoice retainer clients",
    "freelance payment terms",
    "reduce invoice payment time",
  ],
  "retainer-management-for-designers": [
    "retainer management for designers",
    "freelance designer retainer",
    "design retainer pricing",
    "graphic designer retainer",
    "design retainer structure",
    "designer retainer agreement",
    "best retainer setup designers",
    "design agency retainer management",
  ],
  "how-to-onboard-retainer-clients": [
    "how to onboard retainer clients",
    "freelance client onboarding",
    "retainer client onboarding",
    "onboard new retainer client",
    "freelance onboarding process",
    "retainer onboarding template",
    "client onboarding freelancer",
  ],
}

// Base keywords that apply to every article
const baseKeywords = [
  "Retallio",
  "retainer management",
  "freelance retainer tool",
  "client portal freelance",
  "retainer billing software",
  "freelancer retainer management",
]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const specific = articleKeywords[slug] ?? []
  const keywords = [...specific, ...baseKeywords]

  return {
    title: `${post.title} – Retallio Blog`,
    description: post.excerpt,
    keywords: keywords,
    alternates: {
      canonical: `https://www.retallio.app/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      siteName: "Retallio Blog",
      url: `https://www.retallio.app/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      site: "@retallioapp",
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return <BlogPostClient post={post} />
}