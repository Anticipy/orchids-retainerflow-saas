import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retainer Management Software for Freelancers — Retallio",
  description:
    "Retallio is retainer management software built for solo freelancers. Give clients a live portal to see your hours in real time. No invoice disputes. No awkward conversations.",
  alternates: {
    canonical: "/retainer-management-software",
  },
  openGraph: {
    title: "Retainer Management Software for Freelancers — Retallio",
    description:
      "Give your retainer clients a live portal. They watch hours build in real time. By the time the invoice lands, there are no questions.",
    url: "https://www.retallio.app/retainer-management-software",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}