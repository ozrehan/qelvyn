import { cookies } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { sessions } from "@/lib/schema";
import { logAudit } from "@/lib/audit";
import { requireUser } from "@/lib/api";

export const dynamic = "force-dynamic";

async function currentSessionToken(): Promise<string | null> {
  const jar = await cookies();
  return (
    jar.get("authjs.session-token")?.value ??
    jar.get("__Secure-authjs.session-token")?.value ??
    null
  );
}

export async function GET() {
  const me = await requireUser();
  if (me instanceof Response) return me;

  const rows = await db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, me.id))
    .orderBy(desc(sessions.expires));

  const current = await currentSessionToken();
  const now = new Date();

  return Response.json({
    sessions: rows.map((s) => ({
      token: s.sessionToken,
      tokenPrefix: `${s.sessionToken.slice(0, 8)}…`,
      expires: s.expires,
      expired: s.expires <= now,
      current: current !== null && s.sessionToken === current,
    })),
  });
}
