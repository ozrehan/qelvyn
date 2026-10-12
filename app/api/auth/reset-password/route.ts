import { eq, and, isNull, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, passwordResetTokens, sessions } from "@/lib/schema";
import { resetSchema } from "@/lib/validators";
import { sha256 } from "@/lib/tokens";
import { hashPassword } from "@/lib/passwords";
import { logAudit } from "@/lib/audit";
import { rateLimited, readJson, invalid } from "@/lib/api";

export async function POST(req: Request) {
  const limited = rateLimited(req, "reset", 10, 60_000);
  if (limited) return limited;

  const parsed = resetSchema.safeParse(await readJson(req));
  if (!parsed.success) return invalid(parsed.error);

  const row = await db.query.passwordResetTokens.findFirst({
    where: and(
      eq(passwordResetTokens.tokenHash, sha256(parsed.data.token)),
      isNull(passwordResetTokens.usedAt),
      gt(passwordResetTokens.expiresAt, new Date()),
    ),
  });

  if (!row) {
    return Response.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 },
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, row.userId));
  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.id, row.id));
  // Invalidate every session so a stolen session cannot linger.
  await db.delete(sessions).where(eq(sessions.userId, row.userId));

  await logAudit({
    actorId: row.userId,
    action: "auth.password_reset_completed",
    targetType: "users",
    targetId: row.userId,
  });

  return Response.json({ ok: true });
}
