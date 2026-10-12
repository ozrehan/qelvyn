import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Getting started — Qelvyn Docs",
  description:
    "Qelvyn concepts: cloud workstations, streaming, network requirements. Product in development.",
};

export default function GettingStartedPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Docs"
        title="Getting started"
        description="The core concepts behind Qelvyn cloud workstations."
      />
      <div className="max-w-3xl space-y-8 pb-16">
        <div className="flex items-center gap-3">
          <Badge tone="concept">Product in development</Badge>
        </div>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">
            What is a cloud workstation?
          </h2>
          <p className="mt-2 text-smoke">
            A cloud workstation is a computer with a powerful GPU that lives in
            a data center instead of under your desk. You rent it by the
            minute, use it for your work, and stop it when you&apos;re done.
            The applications run on the remote machine; your own device is
            effectively a smart terminal.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">
            How the streaming works
          </h2>
          <p className="mt-2 text-smoke">
            The remote machine captures its display as video, encodes it, and
            sends it to your device over an encrypted connection. Your device
            decodes the video and displays it, while your keyboard and pointer
            input travel back. The remote machine does the heavy computing —
            your laptop&apos;s main job is decoding video and sending input.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">
            Network requirements
          </h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-smoke">
            <li>
              <strong className="text-ink">Bandwidth:</strong> at least 25
              Mbps recommended for interactive creative work. More helps with
              high resolutions and frame rates.
            </li>
            <li>
              <strong className="text-ink">Latency:</strong> lower is better.
              Round-trip latency to the machine directly affects how responsive
              everything feels. A wired connection or strong Wi-Fi helps.
            </li>
            <li>
              <strong className="text-ink">Stability:</strong> a stable
              connection matters more than peak speed. Packet loss causes
              stuttering.
            </li>
            <li>
              <strong className="text-ink">Hardware decoding:</strong> your
              device should support hardware video decoding (most modern
              laptops, desktops, and tablets do).
            </li>
          </ul>
          <div className="mt-3">
            <Badge tone="concept">Unverified targets</Badge>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">
            The workflow, end to end
          </h2>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-smoke">
            <li>Create an account and join the waitlist for early access.</li>
            <li>When invited, choose a hardware configuration.</li>
            <li>Launch a workstation and wait for provisioning to complete.</li>
            <li>Connect through the streaming client.</li>
            <li>Work — your apps run remotely, you see pixels.</li>
            <li>Stop the machine when you&apos;re done to stop metering.</li>
          </ol>
          <div className="mt-3">
            <Badge tone="concept">Intended workflow</Badge>
          </div>
        </section>
      </div>
    </Container>
  );
}
