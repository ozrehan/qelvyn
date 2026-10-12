import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Compatibility — Qelvyn",
  description:
    "What your device needs to use Qelvyn, and what the remote workstations will run. Unverified — compatibility testing is pending.",
};

function Table({
  caption,
  rows,
}: {
  caption: string;
  rows: Array<{ item: string; requirement: string }>;
}) {
  return (
    <div className="overflow-x-auto border border-ink/10">
      <table className="w-full text-left text-sm">
        <caption className="border-b border-ink/10 px-4 py-3 text-left font-display font-semibold">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-ink/10">
            <th scope="col" className="px-4 py-3 font-medium text-smoke">Item</th>
            <th scope="col" className="px-4 py-3 font-medium text-smoke">Requirement</th>
            <th scope="col" className="px-4 py-3 font-medium text-smoke">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.item} className="border-b border-ink/10 last:border-0">
              <td className="px-4 py-3 font-medium">{row.item}</td>
              <td className="px-4 py-3 text-smoke">{row.requirement}</td>
              <td className="px-4 py-3">
                <Badge tone="concept">Unverified</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const DEVICE_ROWS = [
  { item: "Operating system", requirement: "Any modern OS that can run the streaming client" },
  { item: "Browser", requirement: "A current version of Chrome, Edge, Firefox, or Safari for the web experience" },
  { item: "Network", requirement: "≥ 25 Mbps recommended, low latency preferred; wired or strong Wi-Fi" },
  { item: "Hardware video decode", requirement: "GPU or chip with hardware video decoding for smooth playback" },
];

const REMOTE_ROWS = [
  { item: "Operating system", requirement: "Linux GPU VM option" },
  { item: "Operating system", requirement: "Windows GPU VM option" },
  { item: "Creative applications", requirement: "Compatibility verification pending per application" },
];

export default function CompatibilityPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Compatibility"
        title="Will it work on my setup?"
        description="Two sides of the equation: your device, and the remote workstation."
      />
      <div className="max-w-4xl space-y-10 pb-16">
        <Table caption="Your device" rows={DEVICE_ROWS} />
        <Table caption="Remote workstation" rows={REMOTE_ROWS} />
        <p className="text-sm text-smoke">
          Nothing here is verified yet. Each row is a target, not a tested
          claim — compatibility testing is part of our first milestone, and
          this page will be updated with real results as they come in.
        </p>
      </div>
    </Container>
  );
}
