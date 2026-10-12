import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "About — Qelvyn",
  description:
    "Qelvyn's mission and current stage: proving one real cloud workstation before building a platform.",
};

export default function AboutPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="About"
        title="Your workstation. Beyond your hardware."
        description="We're building cloud workstations for people whose work outgrew their machines."
      />
      <div className="max-w-3xl pb-16">
        <h2 className="font-display text-2xl font-bold tracking-tight">Mission</h2>
        <p className="mt-4 text-smoke">
          Creative professionals shouldn&apos;t need a workstation under their
          desk to do workstation-class work. Qelvyn exists to rent that power by
          the minute: powerful remote machines with real GPUs, streamed to
          whatever device you already own, for as long as your project needs
          them.
        </p>

        <h2 className="mt-10 font-display text-2xl font-bold tracking-tight">
          What we&apos;re building
        </h2>
        <p className="mt-4 text-smoke">
          A control plane that provisions GPU machines on demand, a streaming
          connection that makes a remote desktop feel local, and per-minute
          credit metering so you pay for the time you use. The pieces are in
          development; the site you&apos;re reading is our public roadmap and
          our record of honesty.
        </p>
        <div className="mt-3">
          <Badge tone="concept">Concept</Badge>
        </div>

        <h2 className="mt-10 font-display text-2xl font-bold tracking-tight">
          Where we are
        </h2>
        <p className="mt-4 text-smoke">
          We are early. Our first milestone is one working workstation: a real
          cloud machine, usable from an ordinary laptop, with acceptable latency
          and a known operating cost. Until that milestone is proven, everything
          else on this site is a labeled plan — not a product.
        </p>

        <div className="mt-10">
          <Button href="/waitlist">Join the waitlist</Button>
        </div>
        <p className="mt-4 text-sm text-smoke">
          Want to follow along? Read our <Link href="/docs" className="underline underline-offset-4">docs</Link>{" "}
          or <Link href="/contact" className="underline underline-offset-4">get in touch</Link>.
        </p>
      </div>
    </Container>
  );
}
