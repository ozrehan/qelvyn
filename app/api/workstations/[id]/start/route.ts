import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { workstations } from "@/lib/schema";
import { getProvider } from "@/lib/providers";
import { ProviderNotConfiguredError } from "@/lib/providers/types";
import { logAudit } from "@/lib/audit";
import { getOwnWorkstation, notFound } from "@/lib/workstations";
import { requireUser, rateLimited } from "@/lib/api";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const limited = rateLimited(req, "workstation-start", 10, 60_000);
  if (limited) return limited;

  const me = await requireUser();
  if (me instanceof Response) return me;
  const row = await getOwnWorkstation(me.id, (await params).id);
  if (!row) return notFound();

  if (!row.providerId) {
    return Response.json(
      { error: "This workstation has not been launched yet." },
      { status: 400 },
    );
  }

  try {
    await getProvider().start(row.providerId);
    const [updated] = await db
      .update(workstations)
      .set({ status: "running", updatedAt: new Date() })
      .where(eq(workstations.id, row.id))
      .returning();

    await logAudit({
      actorId: me.id,
      action: "workstation.start",
      targetType: "workstations",
      targetId: row.id,
    });

    return Response.json({ workstation: updated });
  } catch (err) {
    if (err instanceof ProviderNotConfiguredError) {
      return Response.json({ error: err.message }, { status: 503 });
    }
    console.error("[workstations] start failed", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Start failed." },
      { status: 502 },
    );
  }
}
