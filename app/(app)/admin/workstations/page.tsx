import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { workstations, users } from "@/lib/schema";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge, fmtDate } from "../../_components/status";

export const dynamic = "force-dynamic";

export default async function AdminWorkstationsPage() {
  const rows = await db
    .select({
      id: workstations.id,
      name: workstations.name,
      plan: workstations.plan,
      region: workstations.region,
      status: workstations.status,
      providerId: workstations.providerId,
      ipAddress: workstations.ipAddress,
      createdAt: workstations.createdAt,
      ownerEmail: users.email,
      ownerName: users.name,
    })
    .from(workstations)
    .leftJoin(users, eq(users.id, workstations.userId))
    .orderBy(desc(workstations.createdAt))
    .limit(200);

  return (
    <Container>
      <div className="py-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">Admin</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Workstations ({rows.length})
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All workstations</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="py-6 text-center text-sm text-smoke">No workstations yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-[11px] uppercase tracking-widest text-smoke">
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Owner</th>
                    <th className="py-2 pr-4 font-medium">Plan</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Provider ID</th>
                    <th className="py-2 pr-4 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-ink/5">
                      <td className="py-2 pr-4 font-medium">{r.name}</td>
                      <td className="py-2 pr-4">{r.ownerEmail ?? "—"}</td>
                      <td className="py-2 pr-4">{r.plan}</td>
                      <td className="py-2 pr-4">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="py-2 pr-4 font-mono text-xs">{r.providerId ?? "—"}</td>
                      <td className="py-2 pr-4">{fmtDate(r.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="pb-16" />
    </Container>
  );
}
