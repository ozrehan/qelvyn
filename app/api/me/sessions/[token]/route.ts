import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { sessions } from "@/lib/schema";
import { logAudit } from "@/lib/audit";
import { requireUser, rateLimited } from "@/lib/api";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ token: string }> };

export async function DELETE(req: Request, { params }: Ctx) {
  const limited = rateLimited(req, "me-sessions", 20, 60_000);
  if (limited) return limited;

  const me = await requireUser();
  if (me instanceof Response) return me;

  const token = (await params).token;
  const row = await db.query.sessions.findFirst({
    where: and(eq(sessions.sessionToken, token), eq(sessions.userId, me.id)),
  });
  if (!row) {
    return Response.json({ error: "Session not found." }, { status: 404 });
  }

  const jar = await cookies();
  const current =
    jar.get("authjs.session-token")?.value ??
    jar.get("__Secure-authjs.session-token")?.value;
  if (current && current === token) {
    return Response.json(
      { error: "This is your current session. Use Sign out to end it." },
      { status: 400 },
    );
  }

  await db.delete(sessions).where(eq(sessions.sessionToken, token));

  await logAudit({
    actorId: me.id,
    action: "auth.session_revoked",
    targetType: "sessions",
    targetId: token.slice(0, 12),
  });

  return Response.json({ ok: true });
}
