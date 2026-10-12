import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { workstations } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { WORKSTATION_PLANS } from "@/lib/providers";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { StatusBadge } from "../_components/status";

export const dynamic = "force-dynamic";

export default async function StoragePage() {
  const session = await auth();
  const userId = (session?.user as any).id as string;

  const rows = await db
    .select()
    .from(workstations)
    .where(eq(workstations.userId, userId))
    .orderBy(desc(workstations.createdAt));

  const totalGb = rows.reduce((sum, ws) => {
    const plan = WORKSTATION_PLANS.find((p) => p.id === ws.plan);
    return sum + (plan?.storageGb ?? 0);
  }, 0);

  return (
    <Container>
      <div className="py-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">Data</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Storage</h1>
        <p className="mt-2 max-w-2xl text-smoke">
          Disk attached to each workstation comes from its plan. Figures below are the
          plan allocations, not live disk measurements.
        </p>
      </div>

      <Card>
        <CardContent className="py-6">
          <p className="text-[11px] uppercase tracking-widest text-smoke">
            Total allocated disk (all workstations)
          </p>
          <p className="mt-2 font-display text-3xl font-bold">{totalGb} GB</p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Per-workstation disk</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="py-6 text-center text-sm text-smoke">
              No workstations yet — nothing to show.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-[11px] uppercase tracking-widest text-smoke">
                    <th className="py-2 pr-4 font-medium">Workstation</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Plan disk</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((ws) => {
                    const plan = WORKSTATION_PLANS.find((p) => p.id === ws.plan);
                    return (
                      <tr key={ws.id} className="border-b border-ink/5">
                        <td className="py-2 pr-4 font-medium">{ws.name}</td>
                        <td className="py-2 pr-4">
                          <StatusBadge status={ws.status} />
                        </td>
                        <td className="py-2 pr-4">{plan ? `${plan.storageGb} GB` : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>File sync</CardTitle>
          <CardDescription>Moving files between your laptop and workstations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge tone="concept">Concept</Badge>
          <p className="mt-3 text-sm text-smoke">
            Automatic file sync between your devices and workstation disks is not built
            yet. For now, transfer files over the remote session or your own tooling.
          </p>
        </CardContent>
      </Card>
      <div className="pb-16" />
    </Container>
  );
}
