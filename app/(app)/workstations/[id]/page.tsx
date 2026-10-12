import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getOwnWorkstation } from "@/lib/workstations";
import { WORKSTATION_PLANS, estimateCost } from "@/lib/providers";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge, fmtDate } from "../../_components/status";
import { WorkstationActions } from "./actions";

export const dynamic = "force-dynamic";

export default async function WorkstationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const userId = (session?.user as any).id as string;
  const ws = await getOwnWorkstation(userId, (await params).id);
  if (!ws) notFound();

  const plan = WORKSTATION_PLANS.find((p) => p.id === ws.plan);

  return (
    <Container>
      <div className="py-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">
          <Link href="/workstations" className="hover:underline">
            Workstations
          </Link>{" "}
          / Detail
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <h1 className="font-display text-3xl font-bold tracking-tight">{ws.name}</h1>
          <StatusBadge status={ws.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-16 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-smoke">Plan</dt>
                <dd className="mt-1 text-sm font-medium">{plan?.name ?? ws.plan}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-smoke">Region</dt>
                <dd className="mt-1 text-sm font-medium">{ws.region}</dd>
              </div>
              {plan && (
                <>
                  <div>
                    <dt className="text-[11px] uppercase tracking-widest text-smoke">GPU</dt>
                    <dd className="mt-1 text-sm font-medium">{plan.gpu}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-widest text-smoke">CPU / RAM</dt>
                    <dd className="mt-1 text-sm font-medium">
                      {plan.vcpu} vCPU / {plan.ramGb} GB RAM
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-widest text-smoke">Disk</dt>
                    <dd className="mt-1 text-sm font-medium">{plan.storageGb} GB</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-widest text-smoke">
                      Cost estimate
                    </dt>
                    <dd className="mt-1 text-sm font-medium">
                      {plan.creditsPerMin} credits/min ≈ {estimateCost(ws.plan, 60)}/hour
                    </dd>
                  </div>
                </>
              )}
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-smoke">Provider ID</dt>
                <dd className="mt-1 font-mono text-sm">{ws.providerId ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-smoke">IP address</dt>
                <dd className="mt-1 font-mono text-sm">{ws.ipAddress ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-smoke">Created</dt>
                <dd className="mt-1 text-sm">{fmtDate(ws.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-smoke">Updated</dt>
                <dd className="mt-1 text-sm">{fmtDate(ws.updatedAt)}</dd>
              </div>
            </dl>
            {!ws.providerId && (
              <p className="mt-6 border-t border-ink/10 pt-4 text-sm text-smoke">
                Not launched yet. Launching provisions a real GPU machine and spends real
                money — you&apos;ll be asked to confirm first.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkstationActions
              workstation={{
                id: ws.id,
                name: ws.name,
                plan: ws.plan,
                status: ws.status,
                providerId: ws.providerId,
                ipAddress: ws.ipAddress,
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="pb-16">
        <Button variant="ghost" href="/workstations">
          ← Back to workstations
        </Button>
      </div>
    </Container>
  );
}
