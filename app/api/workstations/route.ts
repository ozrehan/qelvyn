import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { workstations } from "@/lib/schema";
import { workstationCreateSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";
import { requireUser, rateLimited, readJson, invalid } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const me = await requireUser();
  if (me instanceof Response) return me;

  const rows = await db
    .select()
    .from(workstations)
    .where(eq(workstations.userId, me.id))
    .orderBy(desc(workstations.createdAt));
  return Response.json({ workstations: rows });
}

export async function POST(req: Request) {
  const limited = rateLimited(req, "workstations", 20, 60_000);
  if (limited) return limited;

  const me = await requireUser();
  if (me instanceof Response) return me;

  const parsed = workstationCreateSchema.safeParse(await readJson(req));
  if (!parsed.success) return invalid(parsed.error);

  const [row] = await db
    .insert(workstations)
    .values({
      userId: me.id,
      name: parsed.data.name,
      plan: parsed.data.plan,
      region: parsed.data.region,
      status: "pending",
    })
    .returning();

  await logAudit({
    actorId: me.id,
    action: "workstation.create",
    targetType: "workstations",
    targetId: row.id,
    meta: { plan: row.plan, region: row.region },
  });

  return Response.json({ workstation: row }, { status: 201 });
}
