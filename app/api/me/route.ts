import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { settingsSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";
import { requireUser, rateLimited, readJson, invalid } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  const limited = rateLimited(req, "me", 20, 60_000);
  if (limited) return limited;

  const me = await requireUser();
  if (me instanceof Response) return me;

  const parsed = settingsSchema.safeParse(await readJson(req));
  if (!parsed.success) return invalid(parsed.error);

  const [updated] = await db
    .update(users)
    .set({ name: parsed.data.name })
    .where(eq(users.id, me.id))
    .returning({ id: users.id, name: users.name, email: users.email });

  await logAudit({
    actorId: me.id,
    action: "user.profile_update",
    targetType: "users",
    targetId: me.id,
  });

  return Response.json({ user: updated });
}
