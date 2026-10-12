import { eq, desc, sql, gte } from "drizzle-orm";
import { db } from "@/lib/db";
import { usageEvents } from "@/lib/schema";
import { requireUser } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const me = await requireUser();
  if (me instanceof Response) return me;

  const events = await db
    .select()
    .from(usageEvents)
    .where(eq(usageEvents.userId, me.id))
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
    .where(
      sql`${usageEvents.userId} = ${me.id} and ${usageEvents.createdAt} >= ${monthStart}`,
    );

  return Response.json({
    events,
    totals: {
      minutes: Number(totals.minutes),
      credits: Number(totals.credits),
    },
    note: "Usage events are recorded from real workstation activity. No events yet means no usage has been metered.",
  });
}
