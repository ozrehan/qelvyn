import { z } from "zod";
import { eq, and, like, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/schema";
import { logAudit } from "@/lib/audit";
import { rateLimited, readJson, invalid } from "@/lib/api";

export const dynamic = "force-dynamic";

const bodySchema = z.object({ token: z.string().min(1) });

export async function POST(req: Request) {
  const limited = rateLimited(req, "verify-email", 20, 60_000);
  if (limited) return limited;

  const parsed = bodySchema.safeParse(await readJson(req));
  if (!parsed.success) return invalid(parsed.error);

  const row = await db.query.verificationTokens.findFirst({
    where: and(
      like(verificationTokens.identifier, "verify:%"),
      eq(verificationTokens.token, parsed.data.token),
      gt(verificationTokens.expires, new Date()),
    ),
  });

  if (!row) {
    return Response.json(
      { error: "Invalid or expired verification link." },
      { status: 400 },
    );
  }

  const email = row.identifier.slice("verify:".length);
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) {
    return Response.json(
      { error: "Invalid or expired verification link." },
      { status: 400 },
    );
  }

  await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, user.id));
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.identifier, row.identifier));

  await logAudit({
    actorId: user.id,
    action: "auth.email_verified",
    targetType: "users",
    targetId: user.id,
  });

  return Response.json({ ok: true });
}
