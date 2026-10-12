import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { ContactForm } from "../contact/ContactForm";

export const metadata: Metadata = {
  title: "Security — Qelvyn",
  description:
    "Qelvyn's planned security properties and vulnerability reporting policy.",
};

export default function SecurityPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Security"
        title="Security"
        description="How we think about security, and how to report a vulnerability."
      />
      <div className="max-w-3xl pb-16">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Planned security properties
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-smoke">
          <li>
            <strong className="text-ink">Isolated machines.</strong> Each
            customer workstation is its own machine, separate from other
            customers&apos; machines.
          </li>
          <li>
            <strong className="text-ink">Encrypted transport.</strong> The
            streaming connection between your device and your workstation is
            encrypted in transit.
          </li>
          <li>
            <strong className="text-ink">Least privilege by default.</strong>
            Services only get the access they need to do their job.
          </li>
          <li>
            <strong className="text-ink">You control the session.</strong>{" "}
            Stopping your machine stops the metering and the running instance.
          </li>
        </ul>
        <div className="mt-3">
          <Badge tone="concept">Planned properties</Badge>
        </div>

        <h2 className="mt-10 font-display text-2xl font-bold tracking-tight">
          Vulnerability reporting
        </h2>
        <p className="mt-4 text-smoke">
          If you find a security vulnerability in Qelvyn&apos;s website or
          services, we want to hear about it. Here&apos;s how we work:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-smoke">
          <li>
            Report the issue privately using the form below. Please don&apos;t
            publish it until we&apos;ve had a chance to fix it.
          </li>
          <li>Include what you found, where, and steps to reproduce.</li>
          <li>
            We will acknowledge your report and keep you updated on the fix.
          </li>
          <li>
            We will not take legal action against researchers who follow this
            policy and act in good faith.
          </li>
        </ul>
        <p className="mt-4 text-smoke">
          Please don&apos;t test the security of other customers&apos; data or
          machines, and don&apos;t perform denial-of-service testing against our
          services.
        </p>

        <h2 className="mt-10 font-display text-2xl font-bold tracking-tight">
          Report a vulnerability
        </h2>
        <p className="mt-2 text-sm text-smoke">
          Use this form and mention &ldquo;security&rdquo; in your message.
        </p>
        <div className="mt-6">
          <ContactForm topic="security" />
        </div>
      </div>
    </Container>
  );
}
