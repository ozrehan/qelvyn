import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { workstations } from "@/lib/schema";
import { workstationNameSchema } from "@/lib/validators";
import { getProvider } from "@/lib/providers";
import { logAudit } from "@/lib/audit";
import { getOwnWorkstation, notFound } from "@/lib/workstations";
import { requireUser, rateLimited, readJson, invalid } from "@/lib/api";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const me = await requireUser();
  if (me instanceof Response) return me;
  const row = await getOwnWorkstation(me.id, (await params).id);
  if (!row) return notFound();
  return Response.json({ workstation: row });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const limited = rateLimited(req, "workstations", 20, 60_000);
  if (limited) return limited;

  const me = await requireUser();
  if (me instanceof Response) return me;
  const row = await getOwnWorkstation(me.id, (await params).id);
  if (!row) return notFound();

  const parsed = workstationNameSchema.safeParse(await readJson(req));
  if (!parsed.success) return invalid(parsed.error);

  const [updated] = await db
    .update(workstations)
    .set({ name: parsed.data.name, updatedAt: new Date() })
    .where(eq(workstations.id, row.id))
    .returning();

  await logAudit({
    actorId: me.id,
    action: "workstation.rename",
    targetType: "workstations",
    targetId: row.id,
    meta: { name: updated.name },
  });

  return Response.json({ workstation: updated });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const limited = rateLimited(req, "workstations", 20, 60_000);
  if (limited) return limited;

  const me = await requireUser();
  if (me instanceof Response) return me;
  const row = await getOwnWorkstation(me.id, (await params).id);
  if (!row) return notFound();

  // Best-effort provider terminate, then mark terminated either way.
  if (row.providerId && getProvider().isConfigured()) {
    try {
      await getProvider().terminate(row.providerId);
    } catch (err) {
      console.error("[workstations] provider terminate failed", err);
      await logAudit({
        actorId: me.id,
        action: "workstation.terminate_failed",
        targetType: "workstations",
        targetId: row.id,
        meta: { error: err instanceof Error ? err.message : String(err) },
      });
    }
  }

  const [updated] = await db
    .update(workstations)
    .set({ status: "terminated", updatedAt: new Date() })
    .where(eq(workstations.id, row.id))
    .returning();

  await logAudit({
    actorId: me.id,
    action: "workstation.delete",
    targetType: "workstations",
    targetId: row.id,
  });

  return Response.json({ workstation: updated });
}
