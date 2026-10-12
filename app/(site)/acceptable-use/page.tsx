import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Acceptable Use Policy — Qelvyn",
  description: "Qelvyn's acceptable use policy.",
};

const SECTIONS = [
  {
    h: "What this covers",
    p: "This policy applies to the Qelvyn website today and to cloud workstations once they launch. By using our services, you agree not to use them in the ways described below.",
  },
  {
    h: "Don't do this",
    p: "Attack, probe, or disrupt our services or other customers' machines. Send spam or abuse contact forms. Attempt to access data that isn't yours. Use workstations to mine cryptocurrency without explicit written permission. Host or distribute malware. Engage in fraud, harassment, or any unlawful activity.",
  },
  {
    h: "Resource fairness",
    p: "Workstations are metered per minute. Don't run workloads designed to waste provider capacity or evade metering. If we detect abuse, we'll suspend the account and investigate.",
  },
  {
    h: "Content",
    p: "You're responsible for what you store and process on your workstation. Don't use our services for content that's illegal in your jurisdiction.",
  },
  {
    h: "Enforcement",
    p: "Violations may result in warnings, suspension, or termination of your account. For severe cases — attacks on the service or on other customers — we may terminate immediately and report to the appropriate authorities.",
  },
  {
    h: "Reporting abuse",
    p: "If you see abuse of Qelvyn's services, contact us and we'll look into it.",
  },
];

export default function AcceptableUsePage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Legal"
        title="Acceptable Use Policy"
        description="Last updated: October 2026."
      />
      <div className="max-w-3xl space-y-8 pb-16">
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
