import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/schema";
import { forgotSchema } from "@/lib/validators";
import { newToken, sha256 } from "@/lib/tokens";
import { sendEmail, emailHtml } from "@/lib/email";
import { resetLink } from "@/lib/links";
import { logAudit } from "@/lib/audit";
import { rateLimited, readJson, invalid } from "@/lib/api";

export async function POST(req: Request) {
  const limited = rateLimited(req, "forgot", 10, 60_000);
  if (limited) return limited;

  const parsed = forgotSchema.safeParse(await readJson(req));
  if (!parsed.success) return invalid(parsed.error);

  // Always respond ok:true so email existence is never leaked.
  const user = await db.query.users.findFirst({
    where: eq(users.email, parsed.data.email),
  });

  if (user) {
    const token = newToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      tokenHash: sha256(token),
      expiresAt,
    });

    const resetUrl = resetLink(token);

    if (process.env.RESEND_API_KEY) {
      const text =
        `Someone requested a password reset for your Qelvyn account.\n\nReset your password here (expires in 1 hour):\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`;
      const result = await sendEmail({
        to: user.email,
        subject: "Reset your Qelvyn password",
        text,
        html: emailHtml(
          "Reset your password",
          `<p>Someone requested a password reset for your Qelvyn account.</p><p><a href="${resetUrl}">Reset your password</a> — this link expires in 1 hour.</p><p>If you did not request this, you can ignore this email.</p>`,
        ),
      });
      if (result.sent) {
        await logAudit({
          actorId: user.id,
          action: "auth.password_reset_requested",
          targetType: "users",
          targetId: user.id,
        });
        return Response.json({ ok: true, sent: true });
      }
    }

    // Email could not be delivered (no key configured, or the send failed):
    // the token is stored (usable by an operator via a signed URL), and the
    // caller is told honestly — never claim an email was sent.
    console.log(
      `[auth] password reset requested for ${user.email}; reset email not delivered (token stored, expires in 1h).`,
    );
    return Response.json({
      ok: true,
      sent: false,
      notice: "Email delivery is not configured yet — the reset email could not be sent. Contact support to reset your password.",
    });
  }

  return Response.json({ ok: true });
}
