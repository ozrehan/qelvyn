import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { WORKSTATION_PLANS } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Specifications — Qelvyn",
  description:
    "Planned workstation specifications: Creator, Pro, and Studio configurations.",
};

export default function SpecsPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Specifications"
        title="Workstation configurations"
        description="The hardware configurations we're planning to offer."
      />
      <div className="max-w-4xl pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="concept">Planned specifications</Badge>
          <p className="text-sm text-smoke">
            Subject to provider availability; verified before launch.
          </p>
        </div>
      </div>
      <div className="max-w-4xl pb-16">
        <div className="overflow-x-auto border border-ink/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10">
                <th scope="col" className="px-4 py-3 font-medium text-smoke">Plan</th>
                <th scope="col" className="px-4 py-3 font-medium text-smoke">vCPU</th>
                <th scope="col" className="px-4 py-3 font-medium text-smoke">RAM</th>
                <th scope="col" className="px-4 py-3 font-medium text-smoke">GPU</th>
                <th scope="col" className="px-4 py-3 font-medium text-smoke">Storage</th>
                <th scope="col" className="px-4 py-3 font-medium text-smoke">Credits / min</th>
              </tr>
            </thead>
            <tbody>
              {WORKSTATION_PLANS.map((plan) => (
                <tr key={plan.id} className="border-b border-ink/10 last:border-0">
                  <td className="px-4 py-3 font-display font-semibold">{plan.name}</td>
                  <td className="px-4 py-3">{plan.vcpu}</td>
                  <td className="px-4 py-3">{plan.ramGb} GB</td>
                  <td className="px-4 py-3">{plan.gpu}</td>
                  <td className="px-4 py-3">{plan.storageGb} GB</td>
                  <td className="px-4 py-3">{plan.creditsPerMin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-smoke">
          These configurations describe what we intend to provision. Real
          availability depends on our GPU provider&apos;s inventory at launch
          time — we will verify every configuration works before making it
          available.
        </p>
      </div>
    </Container>
  );
}
