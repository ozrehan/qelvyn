import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Rocket, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Documentation — Qelvyn",
  description:
    "Qelvyn documentation: concepts, network requirements, and troubleshooting. The product is in development.",
};

const GUIDES = [
  {
    icon: Rocket,
    title: "Getting started",
    href: "/docs/getting-started",
    text: "Core concepts: what a cloud workstation is, how streaming works, and what you'll need on your device.",
  },
  {
    icon: Wrench,
    title: "Troubleshooting",
    href: "/docs/troubleshooting",
    text: "Connection problems, latency issues, and display glitches — what to check and in what order.",
  },
];

export default function DocsPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Documentation"
        title="Docs"
        description="Honest documentation for a product in development."
      />
      <div className="max-w-3xl pb-6">
        <div className="flex items-center gap-3">
          <Badge tone="concept">Product in development</Badge>
          <p className="text-sm text-smoke">
            These docs describe how Qelvyn is intended to work, not how it works today.
          </p>
        </div>
      </div>
      <div className="grid gap-6 pb-16 md:grid-cols-2">
        {GUIDES.map((g) => (
          <Link key={g.href} href={g.href} className="block">
            <Card className="h-full transition-colors hover:border-ink/30">
              <CardContent className="pt-6">
                <g.icon size={24} aria-hidden />
                <CardTitle className="mt-4">{g.title}</CardTitle>
                <CardDescription>{g.text}</CardDescription>
                <p className="mt-4 text-sm font-medium underline underline-offset-4">
                  Read the guide
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="max-w-3xl pb-16">
        <div className="flex items-center gap-3">
          <BookOpen size={20} aria-hidden className="text-smoke" />
          <p className="text-sm text-smoke">
            These docs will grow as the product does. Every claim here will be
            backed by the real thing before launch.
          </p>
        </div>
      </div>
    </Container>
  );
}
