import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Terms of Service — Qelvyn",
  description: "Qelvyn's terms of service for a pre-launch product.",
};

const SECTIONS = [
  {
    h: "The service",
    p: "Qelvyn provides cloud workstations. Today the product is pre-launch: this website, the waitlist, and documentation are the only things we operate. Nothing here is a promise that a specific feature or launch date exists.",
  },
  {
    h: "Acceptable use",
    p: "When the product launches, use of workstations will be governed by our Acceptable Use Policy. Until then, don't use our website or forms to send spam, probe other customers' data, or attempt to disrupt the service.",
  },
  {
    h: "Accounts",
    p: "Accounts don't exist yet. When they do, you'll be responsible for keeping your credentials private and for activity under your account.",
  },
  {
    h: "Billing",
    p: "Billing is not enabled. You cannot be charged. Pricing shown anywhere on this site is concept pricing — estimates only, subject to change before launch.",
  },
  {
    h: "Availability",
    p: "We aim for reliability, but a pre-launch service comes with no uptime guarantees. We won't promise availability we haven't measured.",
  },
  {
    h: "Liability",
    p: "To the maximum extent permitted by law, Qelvyn is not liable for indirect or consequential damages. Our total liability is limited to amounts you've actually paid us — which, pre-launch, is zero.",
  },
  {
    h: "Changes",
    p: "These terms will be updated before launch to cover the actual service. Continued use after an update means you accept the new terms.",
  },
];

export default function TermsPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        description="Last updated: October 2026. Written for a pre-launch product."
      />
      <div className="max-w-3xl space-y-8 pb-16">
        <p className="text-smoke">
          By using the Qelvyn website, you agree to these terms. They&apos;re
          short because there&apos;s not much service yet.
        </p>
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-xl font-bold tracking-tight">{s.h}</h2>
            <p className="mt-2 text-smoke">{s.p}</p>
          </section>
        ))}
      </div>
    </Container>
  );
}
