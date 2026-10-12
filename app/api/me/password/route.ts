import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { passwordChangeSchema } from "@/lib/validators";
import { verifyPassword, hashPassword } from "@/lib/passwords";
import { logAudit } from "@/lib/audit";
import { requireUser, rateLimited, readJson, invalid } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const limited = rateLimited(req, "me-password", 10, 60_000);
  if (limited) return limited;

  const me = await requireUser();
  if (me instanceof Response) return me;

  const parsed = passwordChangeSchema.safeParse(await readJson(req));
  if (!parsed.success) return invalid(parsed.error);

  const user = await db.query.users.findFirst({
    where: eq(users.id, me.id),
  });
  if (!user?.passwordHash) {
    return Response.json(
      { error: "This account has no password set." },
      { status: 400 },
    );
  }

  const ok = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!ok) {
    return Response.json(
      { error: "Current password is incorrect." },
      { status: 400 },
    );
  }

  await db
    .update(users)
    .set({ passwordHash: await hashPassword(parsed.data.password) })
    .where(eq(users.id, me.id));

  // Note: sessions are intentionally left intact here so the user stays
  // signed in after changing their password. Any session can be revoked
  // individually from Settings → Sessions.
  await logAudit({
    actorId: me.id,
    action: "auth.password_changed",
    targetType: "users",
    targetId: me.id,
  });

  return Response.json({ ok: true });
}
