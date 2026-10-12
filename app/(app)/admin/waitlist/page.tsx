import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { waitlist } from "@/lib/schema";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { fmtDate } from "../../_components/status";

export const dynamic = "force-dynamic";

export default async function AdminWaitlistPage() {
  const rows = await db
    .select()
    .from(waitlist)
    .orderBy(desc(waitlist.createdAt))
    .limit(500);

  return (
    <Container>
      <div className="py-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">Admin</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Waitlist ({rows.length})
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Signups</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="py-6 text-center text-sm text-smoke">Nobody on the waitlist yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-[11px] uppercase tracking-widest text-smoke">
                    <th className="py-2 pr-4 font-medium">Email</th>
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Use case</th>
                    <th className="py-2 pr-4 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-ink/5">
                      <td className="py-2 pr-4">{r.email}</td>
                      <td className="py-2 pr-4">{r.name ?? "—"}</td>
                      <td className="py-2 pr-4">{r.useCase ?? "—"}</td>
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
