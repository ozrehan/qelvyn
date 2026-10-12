import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { userSessions } from "@/lib/schema";
import { logAudit } from "@/lib/audit";
import { requireUser, rateLimited } from "@/lib/api";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, { params }: Ctx) {
  const limited = rateLimited(req, "me-sessions", 20, 60_000);
  if (limited) return limited;

  const me = await requireUser();
  if (me instanceof Response) return me;

  const id = (await params).id;
  const row = await db.query.userSessions.findFirst({
    where: and(eq(userSessions.id, id), eq(userSessions.userId, me.id)),
  });
  if (!row || row.revokedAt) {
    return Response.json({ error: "Session not found." }, { status: 404 });
  }

  const session = await auth();
  const currentId = (session?.user as any)?.sessionId as string | undefined;
  if (currentId && currentId === id) {
    return Response.json(
      { error: "This is your current session. Use Sign out to end it." },
      { status: 400 },
    );
  }

  await db
    .update(userSessions)
    .set({ revokedAt: new Date() })
    .where(eq(userSessions.id, id));

  await logAudit({
    actorId: me.id,
    action: "auth.session_revoked",
    targetType: "user_sessions",
    targetId: id,
  });

  return Response.json({ ok: true });
}
