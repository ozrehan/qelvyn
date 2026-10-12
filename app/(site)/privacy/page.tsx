import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy — Qelvyn",
  description: "Qelvyn's privacy policy for a pre-launch product.",
};

const SECTIONS = [
  {
    h: "What we collect",
    p: "Today, the Qelvyn website collects only what you give us: waitlist signups (name, email, stated use case) and contact form messages. We don't run analytics trackers, advertising cookies, or behavioral profiling on this site.",
  },
  {
    h: "How we use it",
    p: "We use waitlist information to invite people to early access and to plan capacity. We use contact messages to respond to you. We don't sell personal information, and we don't share it with advertisers.",
  },
  {
    h: "Where it's stored",
    p: "Website data is stored in our application database. When the product launches and workstations store user data, we will document retention, deletion, and data location before launch.",
  },
  {
    h: "Your rights",
    p: "You can ask us to see, correct, or delete your personal information at any time by contacting us. We'll act on your request within a reasonable time.",
  },
  {
    h: "Changes",
    p: "This policy will change as the product grows. When the product launches, we'll publish a fuller policy covering workstation usage data, billing, and data retention — and we'll note the date of the latest update here.",
  },
];

export default function PrivacyPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last updated: October 2026. This policy is written for a pre-launch product."
      />
      <div className="max-w-3xl space-y-8 pb-16">
        <p className="text-smoke">
          Qelvyn is pre-launch. This policy describes what our website collects
          today, honestly — nothing more.
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
