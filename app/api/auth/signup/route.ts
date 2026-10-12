import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/schema";
import { signupSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/passwords";
import { newToken } from "@/lib/tokens";
import { sendEmail, emailHtml } from "@/lib/email";
import { verificationLink } from "@/lib/links";
import { logAudit } from "@/lib/audit";
import { rateLimited, readJson, invalid } from "@/lib/api";

export async function POST(req: Request) {
  const limited = rateLimited(req, "signup", 10, 60_000);
  if (limited) return limited;

  const parsed = signupSchema.safeParse(await readJson(req));
  if (!parsed.success) return invalid(parsed.error);

  const existing = await db.query.users.findFirst({
    where: eq(users.email, parsed.data.email),
  });
  if (existing) {
    return Response.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const [row] = await db
    .insert(users)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    })
    .returning({ id: users.id });

  await logAudit({
    actorId: row.id,
    action: "auth.signup",
    targetType: "users",
    targetId: row.id,
  });

  // Email verification token (24h). Stored always; emailed only when delivery
  // is configured — the signup page reports the honest state either way.
  const token = newToken();
  await db.insert(verificationTokens).values({
    identifier: `verify:${parsed.data.email}`,
    token,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const emailConfigured = !!process.env.RESEND_API_KEY;
  let emailSent = false;
  if (emailConfigured) {
    const link = verificationLink(token);
    const text =
      `Hi ${parsed.data.name},\n\nVerify your Qelvyn email address by opening this link (expires in 24 hours):\n\n${link}\n\nIf you didn't create this account, ignore this email.\n\n— The Qelvyn team`;
    try {
      const result = await sendEmail({
        to: parsed.data.email,
        subject: "Verify your Qelvyn email",
        text,
        html: emailHtml(
          "Verify your email",
          `<p>Hi ${parsed.data.name},</p><p><a href="${link}">Verify your email address</a> — this link expires in 24 hours.</p><p>If you didn't create this account, ignore this email.</p>`,
        ),
      });
      emailSent = result.sent;
      if (!result.sent) console.error("[signup] verification email not sent:", result.reason);
    } catch (err) {
      console.error("[signup] verification email failed", err);
    }
  }

  return Response.json({ ok: true, emailConfigured, emailSent });
}
