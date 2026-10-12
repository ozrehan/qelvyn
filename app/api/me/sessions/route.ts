import { eq, desc, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { userSessions } from "@/lib/schema";
import { requireUser } from "@/lib/api";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const me = await requireUser();
  if (me instanceof Response) return me;

  const session = await auth();
  const currentId = (session?.user as any)?.sessionId as string | undefined;

  const rows = await db
    .select()
    .from(userSessions)
    .where(eq(userSessions.userId, me.id))
    .orderBy(desc(userSessions.createdAt));

  const now = new Date();
  return Response.json({
    sessions: rows
      .filter((s) => !s.revokedAt)
      .map((s) => ({
        id: s.id,
        createdAt: s.createdAt,
        lastSeenAt: s.lastSeenAt,
        expiresAt: s.expiresAt,
        ipAddress: s.ipAddress,
        userAgent: s.userAgent,
        expired: s.expiresAt <= now,
        current: currentId !== undefined && s.id === currentId,
      })),
  });
}
