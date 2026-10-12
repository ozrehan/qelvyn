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

/**
 * Launch = provision a real GPU pod on the provider. This SPENDS REAL MONEY
 * when a provider key is configured. The UI must show a plain confirmation
 * explaining the real charges before calling this endpoint.
 */
export async function POST(req: Request, { params }: Ctx) {
  const limited = rateLimited(req, "workstation-launch", 10, 60_000);
  if (limited) return limited;

  const me = await requireUser();
  if (me instanceof Response) return me;
  const row = await getOwnWorkstation(me.id, (await params).id);
  if (!row) return notFound();

  if (row.providerId) {
    return Response.json(
      { error: "This workstation is already launched." },
      { status: 400 },
    );
  }

  try {
    const provider = getProvider();
    const result = await provider.launch({
      name: row.name,
      plan: row.plan,
      region: row.region,
    });
    const [updated] = await db
      .update(workstations)
      .set({
        providerId: result.providerId,
        ipAddress: result.ipAddress ?? null,
        status: "provisioning",
        updatedAt: new Date(),
      })
      .where(eq(workstations.id, row.id))
      .returning();

    await logAudit({
      actorId: me.id,
      action: "workstation.launch",
      targetType: "workstations",
      targetId: row.id,
      meta: { providerId: result.providerId },
    });

    return Response.json({ workstation: updated });
  } catch (err) {
    if (err instanceof ProviderNotConfiguredError) {
      return Response.json({ error: err.message }, { status: 503 });
    }
    console.error("[workstations] launch failed", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Launch failed." },
      { status: 502 },
    );
  }
}
