import type { Metadata } from "next";
import { UserPlus, Cpu, Rocket, Plug, MonitorPlay, OctagonX } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "How it works — Qelvyn",
  description:
    "How Qelvyn cloud workstations work: account, hardware selection, provisioning, streaming connection, and session control.",
};

const STEPS = [
  {
    icon: UserPlus,
    title: "1. Create an account",
    text: "Sign up so we can manage your workstations and billing. Account features are in development.",
    concept: true,
  },
  {
    icon: Cpu,
    title: "2. Choose your hardware",
    text: "Pick a machine configuration that fits the work you do — from a single-GPU creator machine to a multi-GPU studio machine.",
    concept: true,
  },
  {
    icon: Rocket,
    title: "3. Provisioning",
    text: "Our control plane provisions a GPU machine for you. Provisioning time depends on the underlying provider's capacity.",
    concept: true,
  },
  {
    icon: Plug,
    title: "4. Connect via a streaming client",
    text: "You connect to the machine through a low-latency streaming client, the same way remote desktops work today — but tuned for interactive creative apps.",
    concept: true,
  },
  {
    icon: MonitorPlay,
    title: "5. Work",
    text: "Your applications run on the remote machine. Your screen shows the remote pixels; your keyboard, pointer, and tablet input go back.",
    concept: true,
  },
  {
    icon: OctagonX,
    title: "6. Stop",
    text: "When you're done, stop the machine so you only pay for the time you used. Credits are metered per minute.",
    concept: true,
  },
];

export default function HowItWorksPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Technology"
        title="How it works"
        description="One idea: the machine that does the work doesn't have to be the machine in front of you."
      />

      <div className="grid gap-6 pb-16 md:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step) => (
          <Card key={step.title}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <step.icon size={24} aria-hidden />
                {step.concept && <Badge tone="concept">Concept</Badge>}
              </div>
              <CardTitle className="mt-4">{step.title}</CardTitle>
              <p className="mt-2 text-sm text-smoke">{step.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl pb-16">
        <Alert tone="info" title="Latency honesty" className="mb-8">
          <p>
            Performance depends on network latency, decoding capability, and the
            remote machine. Interactive creative work needs a low-latency
            connection: distance to the machine and your network quality
            directly affect how responsive everything feels. We will publish
            real measured latency numbers from our proof-of-concept before we
            promise anything.
          </p>
        </Alert>

        <h2 className="font-display text-2xl font-bold tracking-tight">
          Streaming technology
        </h2>
        <p className="mt-4 text-smoke">
          We are evaluating low-latency streaming options for the connection
          between your device and the remote machine, including Sunshine /
          Moonlight and WebRTC-based approaches. No decision has been made and
          nothing is in production yet.
        </p>
        <div className="mt-3">
          <Badge tone="concept">Concept</Badge>
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold tracking-tight">
          Security
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-smoke">
          <li>
            <strong className="text-ink">Isolated machines.</strong> Each
            workstation is its own machine, separate from other customers.
          </li>
          <li>
            <strong className="text-ink">Encrypted transport.</strong> The
            streaming connection between your device and the workstation is
            encrypted in transit.
          </li>
          <li>
            <strong className="text-ink">You control the session.</strong> Stop
            the machine when you&apos;re done; nothing keeps running on your
            behalf.
          </li>
        </ul>
        <div className="mt-3">
          <Badge tone="concept">Planned security properties</Badge>
        </div>
      </div>
    </Container>
  );
}
