import type { Metadata } from "next";
import { Clapperboard, Box, DraftingCompass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Use cases — Qelvyn",
  description:
    "Who Qelvyn cloud workstations are for: video editing, 3D and VFX, CAD and simulation. Compatibility verification is pending.",
};

const CASES = [
  {
    icon: Clapperboard,
    title: "Video editing",
    who: "Independent editors and small production studios working with 4K or higher footage.",
    why: "High-resolution timelines, effects, and renders are GPU-hungry. A remote GPU machine can scrub, grade, and export footage that would choke a thin laptop.",
    apps: ["DaVinci Resolve", "Premiere Pro"],
  },
  {
    icon: Box,
    title: "3D & VFX",
    who: "3D artists and small VFX teams who need rendering power without buying render nodes.",
    why: "GPU rendering scales with the machine, not your desk. A remote multi-GPU machine can chew through frames your local machine would take all night on.",
    apps: ["Blender"],
  },
  {
    icon: DraftingCompass,
    title: "CAD & simulation",
    who: "Engineers and designers working with heavy models and simulation workloads.",
    why: "Complex assemblies and simulations benefit from workstation-class GPUs and large memory — rentable by the hour instead of bought outright.",
    apps: [],
    concept: true,
  },
];

export default function UseCasesPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Use cases"
        title="Built for work your laptop can't handle"
        description="Creative and engineering applications that benefit from remote GPU power."
      />
      <div className="grid gap-6 pb-16 md:grid-cols-2 lg:grid-cols-3">
        {CASES.map((c) => (
          <Card key={c.title}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <c.icon size={24} aria-hidden />
                {c.concept && <Badge tone="concept">Concept</Badge>}
              </div>
              <CardTitle className="mt-4">{c.title}</CardTitle>
              <CardDescription>Who it&apos;s for</CardDescription>
              <p className="mt-2 text-sm text-smoke">{c.who}</p>
              <h3 className="mt-4 text-sm font-medium">Why remote GPUs help</h3>
              <p className="mt-1 text-sm text-smoke">{c.why}</p>
              {c.apps.length > 0 && (
                <>
                  <h3 className="mt-4 text-sm font-medium">Example software</h3>
                  <ul className="mt-1 space-y-1">
                    {c.apps.map((app) => (
                      <li key={app} className="flex flex-wrap items-center gap-2 text-sm text-smoke">
                        {app} <Badge tone="concept">Compatibility verification pending</Badge>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="max-w-3xl pb-16">
        <p className="text-sm text-smoke">
          We name software only as examples of the kind of applications cloud
          workstations could run. We do not claim support for any of them — each
          application will need to be tested and verified on our workstations
          before we say it works.
        </p>
      </div>
    </Container>
  );
}
