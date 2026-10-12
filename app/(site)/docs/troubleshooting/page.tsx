import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";

export const metadata: Metadata = {
  title: "Troubleshooting — Qelvyn Docs",
  description:
    "Troubleshooting connection, latency, and display issues with Qelvyn cloud workstations. Product in development.",
};

const STEPS = [
  {
    h: "Can't connect to the workstation",
    steps: [
      "Check that the workstation is still running — stopped machines can't be connected to.",
      "Verify your internet connection is up and stable.",
      "Confirm you're signed in to the correct account.",
      "Try reconnecting once; if it persists, note the exact error message and contact support.",
    ],
  },
  {
    h: "High latency / everything feels laggy",
    steps: [
      "Run a speed test and confirm you're getting at least 25 Mbps down.",
      "Switch to a wired connection or move closer to your Wi-Fi router.",
      "Close bandwidth-heavy applications (large downloads, video calls) on your network.",
      "Lower the stream resolution in the client settings to reduce the data being decoded.",
      "If latency stays high, the machine may be far from you — region selection will matter once it's available.",
    ],
  },
  {
    h: "Stuttering or frozen frames",
    steps: [
      "Stuttering usually means packet loss, not low bandwidth — check connection stability.",
      "Make sure your device is using hardware video decoding (check the client's settings panel).",
      "Lower the frame rate or resolution temporarily to see if it clears.",
      "Restart the streaming client; reconnecting re-establishes the video pipeline.",
    ],
  },
  {
    h: "Colors look wrong",
    steps: [
      "Check the client's color settings — the remote machine and your display should use matching profiles.",
      "On your local machine, confirm you're not running a night-shift or color-filter overlay.",
      "Color accuracy will be validated during our proof-of-concept; exact calibration workflows are still being defined.",
    ],
  },
  {
    h: "Input feels delayed or drops keys",
    steps: [
      "This is almost always network latency — see the high-latency steps above.",
      "If you're on a shared network, QoS or a wired connection helps more than raw speed.",
    ],
  },
];

export default function TroubleshootingPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Docs"
        title="Troubleshooting"
        description="Connection problems, step by step. Check in order."
      />
      <div className="max-w-3xl pb-16">
        <div className="mb-8 flex items-center gap-3">
          <Badge tone="concept">Product in development</Badge>
        </div>
        <Alert tone="info" title="These steps are written ahead of launch" className="mb-10">
          <p>
            This guide describes how we expect troubleshooting to work based on
            how streaming desktop technology behaves. It will be updated with
            real findings from our proof-of-concept.
          </p>
        </Alert>
        <div className="space-y-10">
          {STEPS.map((section) => (
            <section key={section.h}>
              <h2 className="font-display text-xl font-bold tracking-tight">
                {section.h}
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-smoke">
                {section.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm text-smoke">
          Still stuck? <a href="/contact" className="underline underline-offset-4">Contact us</a> with
          what you tried and the exact error you saw.
        </p>
      </div>
    </Container>
  );
}
