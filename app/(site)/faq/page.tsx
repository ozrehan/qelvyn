import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "FAQ — Qelvyn",
  description:
    "Frequently asked questions about Qelvyn cloud workstations, answered honestly.",
};

const FAQS = [
  {
    q: "What is Qelvyn?",
    a: "Qelvyn is a cloud workstation platform for creative work. You rent a powerful remote machine with a GPU, and stream your desktop to the device you already own — so heavy applications run on the remote machine while you work from your laptop.",
  },
  {
    q: "When will Qelvyn be available?",
    a: "We are pre-launch. Our first milestone is proving that one real workstation works end to end — real GPU machine, usable from an ordinary laptop, with acceptable latency and a known operating cost. We won't open broader access until we've proven that.",
  },
  {
    q: "How much will it cost?",
    a: "Pricing is not finalized and billing is not enabled yet — you cannot be charged for anything. Our pricing page shows concept estimates in credits per minute so you can think through what usage might look like.",
  },
  {
    q: "What hardware do I need on my end?",
    a: "An ordinary laptop or desktop with a modern browser, a reasonably fast connection (we recommend at least 25 Mbps), and hardware video decoding. You don't need a powerful local machine — that's the point.",
  },
  {
    q: "Is my data safe?",
    a: "We're planning isolated machines per customer and encrypted transport for the streaming connection. Our security page covers what we're building and how to report vulnerabilities. That said, we are pre-launch: don't put anything irreplaceable on the platform until we've published our data-handling documentation.",
  },
  {
    q: "Which applications are supported?",
    a: "None are verified yet. Our use-cases page names example software like DaVinci Resolve, Premiere Pro, and Blender, but compatibility verification is pending for each. We won't claim an application works until we've tested it on our workstations.",
  },
  {
    q: "How is this different from cloud gaming?",
    a: "Cloud gaming streams games tuned for low input lag and controller input. Qelvyn targets creative production: desktop applications with precise pointer and keyboard (and eventually tablet) input, high-resolution timelines, and color-accurate output. The streaming challenge is similar, but the use case is work, not play.",
  },
  {
    q: "How do I get access?",
    a: "Join the waitlist. As capacity becomes available we'll invite people in waves, starting with the use cases we're proving first.",
  },
];

export default function FaqPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Straight answers about where Qelvyn is and what it can do."
      />
      <div className="max-w-3xl pb-16">
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="cursor-pointer list-none font-display font-semibold [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span aria-hidden className="text-smoke transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-smoke">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Container>
  );
}
