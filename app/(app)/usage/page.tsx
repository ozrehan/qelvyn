import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { usageEvents } from "@/lib/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { fmtDate } from "../_components/status";

export const dynamic = "force-dynamic";

export default async function UsagePage() {
  const session = await auth();
  const userId = (session?.user as any).id as string;

  const events = await db
    .select()
    .from(usageEvents)
    .where(eq(usageEvents.userId, userId))
    .orderBy(desc(usageEvents.createdAt))
    .limit(200);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const [totals] = await db
    .select({
      minutes: sql<number>`coalesce(sum(${usageEvents.minutes}), 0)`,
      credits: sql<number>`coalesce(sum(${usageEvents.credits}), 0)`,
    })
    .from(usageEvents)
    .where(and(eq(usageEvents.userId, userId), gte(usageEvents.createdAt, monthStart)));

  return (
    <Container>
      <div className="py-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">Metering</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Usage</h1>
        <p className="mt-2 max-w-2xl text-smoke">
          Only real, metered workstation activity appears here. Nothing is estimated or
          simulated.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="py-6">
            <p className="text-[11px] uppercase tracking-widest text-smoke">Minutes this month</p>
            <p className="mt-2 font-display text-3xl font-bold">{Number(totals.minutes)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <p className="text-[11px] uppercase tracking-widest text-smoke">Credits this month</p>
            <p className="mt-2 font-display text-3xl font-bold">{Number(totals.credits)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Usage events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="py-6 text-center text-sm text-smoke">
              No usage has been metered yet. Events appear here once a workstation runs.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-[11px] uppercase tracking-widest text-smoke">
                    <th className="py-2 pr-4 font-medium">When</th>
                    <th className="py-2 pr-4 font-medium">Type</th>
                    <th className="py-2 pr-4 font-medium">Minutes</th>
                    <th className="py-2 pr-4 font-medium">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => (
                    <tr key={e.id} className="border-b border-ink/5">
                      <td className="py-2 pr-4">{fmtDate(e.createdAt)}</td>
                      <td className="py-2 pr-4">{e.type}</td>
                      <td className="py-2 pr-4">{e.minutes ?? 0}</td>
                      <td className="py-2 pr-4">{e.credits ?? 0}</td>
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
