import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/schema";
import { forgotSchema } from "@/lib/validators";
import { newToken } from "@/lib/tokens";
import { sendEmail, emailHtml } from "@/lib/email";
import { verificationLink } from "@/lib/links";
import { logAudit } from "@/lib/audit";
import { rateLimited, readJson, invalid } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const limited = rateLimited(req, "verify-email-resend", 5, 60_000);
  if (limited) return limited;

  const parsed = forgotSchema.safeParse(await readJson(req));
  if (!parsed.success) return invalid(parsed.error);

  // Always ok:true — never leak whether the email has an account.
  const user = await db.query.users.findFirst({
    where: eq(users.email, parsed.data.email),
  });

  if (user && !user.emailVerified) {
    const identifier = `verify:${user.email}`;
    // Fresh token: drop any older unused ones first.
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, identifier));
    const token = newToken();
    await db.insert(verificationTokens).values({
      identifier,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    if (process.env.RESEND_API_KEY) {
      const link = verificationLink(token);
      const text =
        `Hi ${user.name ?? "there"},\n\nVerify your Qelvyn email address by opening this link (expires in 24 hours):\n\n${link}\n\nIf you didn't request this, ignore this email.\n\n— The Qelvyn team`;
      try {
        const result = await sendEmail({
          to: user.email,
          subject: "Verify your Qelvyn email",
          text,
          html: emailHtml(
            "Verify your email",
            `<p>Hi ${user.name ?? "there"},</p><p><a href="${link}">Verify your email address</a> — this link expires in 24 hours.</p><p>If you didn't request this, ignore this email.</p>`,
          ),
        });
        if (!result.sent) console.error("[verify-email] resend not sent:", result.reason);
      } catch (err) {
        console.error("[verify-email] resend failed", err);
      }
    }

    await logAudit({
      actorId: user.id,
      action: "auth.email_verification_resent",
      targetType: "users",
      targetId: user.id,
    });
  }

  return Response.json({ ok: true });
}
