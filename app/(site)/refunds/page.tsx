import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Refund Policy — Qelvyn",
  description:
    "Qelvyn's refund policy. Billing is not enabled yet — you cannot be charged.",
};

export default function RefundsPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Legal"
        title="Refund Policy"
        description="Last updated: October 2026."
      />
      <div className="max-w-3xl space-y-8 pb-16">
        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">
            Billing is not enabled yet
          </h2>
          <p className="mt-2 text-smoke">
            There is no way to pay us right now, and no charges can be made.
            There is nothing to refund.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold tracking-tight">
            The policy that will apply
          </h2>
          <p className="mt-2 text-smoke">
            When billing launches, this policy will apply to credit purchases:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-smoke">
            <li>
              Unused credits are refundable within 14 days of purchase, as long
              as no workstation session has consumed them.
            </li>
            <li>
              Credits consumed by running workstations are not refundable —
              you pay for the machine time you use.
            </li>
            <li>
              If a session fails because of a fault on our side, we will credit
              or refund the affected minutes.
            </li>
            <li>
              Refund requests are handled through support, and we aim to
              resolve them within 7 business days.
            </li>
          </ul>
          <div className="mt-3">
            <Badge tone="concept">Future policy</Badge>
          </div>
        </section>
      </div>
    </Container>
  );
}
