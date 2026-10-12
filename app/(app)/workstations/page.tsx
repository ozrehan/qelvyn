import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { workstations } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { WORKSTATION_PLANS, estimateCost } from "@/lib/providers";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "../_components/status";

export const dynamic = "force-dynamic";

function planLabel(planId: string): string {
  return WORKSTATION_PLANS.find((p) => p.id === planId)?.name ?? planId;
}

export default async function WorkstationsPage() {
  const session = await auth();
  const userId = (session?.user as any).id as string;

  const rows = await db
    .select()
    .from(workstations)
    .where(eq(workstations.userId, userId))
    .orderBy(desc(workstations.createdAt));

  return (
    <Container>
      <div className="flex flex-wrap items-end justify-between gap-4 py-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">
            Compute
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Workstations</h1>
        </div>
        <Button href="/workstations/new">New workstation</Button>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="space-y-4 py-10 text-center">
            <p className="font-display text-xl font-semibold">No workstations yet</p>
            <p className="mx-auto max-w-md text-sm text-smoke">
              Create a workstation to get started. You can save its configuration now and
              launch it when you&apos;re ready.
            </p>
            <Button href="/workstations/new">New workstation</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 pb-16 md:grid-cols-2">
          {rows.map((ws) => (
            <Card key={ws.id}>
              <CardContent className="space-y-3 py-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/workstations/${ws.id}`}
                      className="font-display text-lg font-semibold hover:underline"
                    >
                      {ws.name}
                    </Link>
                    <p className="mt-1 text-sm text-smoke">
                      {planLabel(ws.plan)} · {ws.region}
                    </p>
                  </div>
                  <StatusBadge status={ws.status} />
                </div>
                <p className="text-sm text-smoke">
                  ≈ {estimateCost(ws.plan, 60)} credits/hour when running
                </p>
                <div className="flex gap-3 pt-1">
                  <Button size="sm" variant="outline" href={`/workstations/${ws.id}`}>
                    Details
                  </Button>
                  <Button size="sm" variant="outline" href={`/workstations/${ws.id}/connect`}>
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
