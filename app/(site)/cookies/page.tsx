import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Cookie Policy — Qelvyn",
  description: "Qelvyn's cookie policy: this site uses no tracking cookies.",
};

export default function CookiesPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Legal"
        title="Cookie Policy"
        description="Last updated: October 2026."
      />
      <div className="max-w-3xl space-y-8 pb-16">
        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">
            No tracking cookies
          </h2>
          <p className="mt-2 text-smoke">
            The Qelvyn website does not use tracking, advertising, or analytics
            cookies. We don&apos;t follow you around the web and we don&apos;t
            build behavioral profiles.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">
            What we do use
          </h2>
          <p className="mt-2 text-smoke">
            We use only cookies strictly necessary for the site to work — for
            example, a session cookie when you log in, and security-related
            cookies that protect forms from abuse. These can&apos;t be turned
            off without breaking the site.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">
            The future
          </h2>
          <p className="mt-2 text-smoke">
            If we ever add optional analytics or marketing cookies, we&apos;ll
            update this policy first and ask for your consent before setting
            them. That day is not today.
          </p>
        </section>
      </div>
    </Container>
  );
}
