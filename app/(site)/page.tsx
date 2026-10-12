import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Cpu, Plug, MonitorPlay } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { WORKSTATION_PLANS } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Qelvyn — Cloud Workstations",
  description:
    "Run demanding creative applications on powerful remote machines, controlled from the device you already own.",
};

const STEPS = [
  {
    icon: Cpu,
    title: "Launch",
    text: "Pick the hardware you need. We provision a GPU machine for it.",
  },
  {
    icon: Plug,
    title: "Connect",
    text: "A secure, low-latency stream connects the machine to your laptop.",
  },
  {
    icon: MonitorPlay,
    title: "Work",
    text: "Your applications run remotely. You see pixels; your laptop sends input.",
  },
];

const FAQS = [
  {
    q: "What is Qelvyn?",
    a: "A cloud workstation platform for creative work: powerful remote machines with GPUs, streamed to the device you already own.",
  },
  {
    q: "When will Qelvyn be available?",
    a: "We are pre-launch. Our first milestone is proving one real workstation works end to end before we build the wider platform.",
  },
  {
    q: "How much will it cost?",
    a: "Pricing is not final. Billing is not enabled yet. Concept pricing is shown on our pricing page as estimates only.",
  },
  {
    q: "How do I get access?",
    a: "Join the waitlist and we will invite people in waves as capacity becomes available.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-ink/10">
        <Container className="py-20 sm:py-28">
          <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">
            Qelvyn — Cloud Workstations
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold tracking-tight sm:text-7xl">
            <span className="sr-only">Qelvyn — </span>
            Your workstation.
            <br />
            Beyond your hardware.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-smoke">
            Run demanding creative applications on powerful remote machines,
            controlled from the device you already own.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/waitlist" size="lg">
              Join the waitlist <ArrowRight size={18} />
            </Button>
            <Button href="/how-it-works" variant="outline" size="lg">
              Explore the technology
            </Button>
          </div>
          <div className="mt-10">
            <Badge tone="concept">Concept direction only</Badge>
            <p className="mt-2 text-sm text-smoke">
              Unbuilt features are labeled Concept.
            </p>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-b border-ink/10">
        <Container className="py-16 sm:py-24">
          <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">
            The idea
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <Card key={step.title}>
                <CardContent className="pt-6">
                  <step.icon size={24} aria-hidden />
                  <CardTitle className="mt-4">{step.title}</CardTitle>
                  <p className="mt-2 text-sm text-smoke">{step.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Architecture diagram */}
          <div className="mt-12">
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <div className="flex-1 border border-ink/20 px-6 py-5 text-center">
                <p className="font-display font-semibold">Your laptop</p>
                <p className="mt-1 text-sm text-smoke">
                  Decodes video, sends keyboard and pointer input
                </p>
              </div>
              <ArrowRight size={20} className="mx-auto rotate-90 text-smoke sm:rotate-0" aria-hidden />
              <div className="flex-1 border border-ink/20 px-6 py-5 text-center">
                <p className="font-display font-semibold">Qelvyn control plane</p>
                <p className="mt-1 text-sm text-smoke">
                  Provisions and manages machines
                </p>
              </div>
              <ArrowRight size={20} className="mx-auto rotate-90 text-smoke sm:rotate-0" aria-hidden />
              <div className="flex-1 border border-ink/20 px-6 py-5 text-center">
                <p className="font-display font-semibold">Remote GPU workstation</p>
                <p className="mt-1 text-sm text-smoke">
                  Runs your applications and does the heavy computing
                </p>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-smoke">
              The remote machine does the heavy computing. Your laptop decodes
              video and sends input.
            </p>
          </div>

          <div className="mt-10">
            <Link href="/how-it-works" className="text-sm font-medium underline underline-offset-4">
              Read the full technical overview
            </Link>
          </div>
        </Container>
      </section>

      {/* What we're proving first */}
      <section className="border-b border-ink/10">
        <Container className="py-16 sm:py-24">
          <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">
            Stage honesty
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            What we&apos;re proving first
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-smoke">
            Before we build any platform, we have to prove three things with one
            real workstation:
          </p>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              "A real cloud workstation a person can actually use",
              "Acceptable latency from an ordinary laptop over a normal connection",
              "Known operating cost per hour of use",
            ].map((item, i) => (
              <li key={item} className="border-t border-ink/20 pt-4">
                <p className="font-display text-2xl font-bold">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-2 text-sm text-smoke">{item}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Plans teaser */}
      <section className="border-b border-ink/10">
        <Container className="py-16 sm:py-24">
          <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">
            Plans
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Choose your hardware
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {WORKSTATION_PLANS.map((plan) => (
              <Card key={plan.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    <Badge tone="concept">Concept pricing</Badge>
                  </div>
                  <p className="mt-2 font-display text-3xl font-bold">
                    {plan.creditsPerMin}
                    <span className="text-base font-normal text-smoke"> credits/min</span>
                  </p>
                  <p className="mt-2 text-sm text-smoke">
                    {plan.vcpu} vCPU · {plan.ramGb} GB RAM · {plan.gpu}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10">
            <Button href="/pricing" variant="outline">
              Estimate your costs <ArrowRight size={16} />
            </Button>
          </div>
        </Container>
      </section>

      {/* FAQ teaser */}
      <section className="border-b border-ink/10">
        <Container className="py-16 sm:py-24">
          <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">FAQ</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Questions, answered honestly
          </h2>
          <dl className="mt-10 grid gap-6 md:grid-cols-2">
            {FAQS.map((item) => (
              <div key={item.q} className="border-t border-ink/20 pt-4">
                <dt className="font-display font-semibold">{item.q}</dt>
                <dd className="mt-2 text-sm text-smoke">{item.a}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10">
            <Link href="/faq" className="text-sm font-medium underline underline-offset-4">
              Read all frequently asked questions
            </Link>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section>
        <Container className="py-16 sm:py-24">
          <div className="border border-ink/20 px-8 py-12 text-center sm:px-16">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Your workstation. Beyond your hardware.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-smoke">
              We are proving one real workstation first. Join the waitlist and
              we&apos;ll let you know when we&apos;re ready for early users.
            </p>
            <div className="mt-8">
              <Button href="/waitlist" size="lg">
                Join the waitlist <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
