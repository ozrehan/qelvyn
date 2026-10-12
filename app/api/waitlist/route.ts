import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { waitlist } from "@/lib/schema";
import { waitlistSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";
import { sendEmail, emailHtml } from "@/lib/email";
import { rateLimited, readJson, invalid } from "@/lib/api";

export async function POST(req: Request) {
  const limited = rateLimited(req, "waitlist", 10, 60_000);
  if (limited) return limited;

  const parsed = waitlistSchema.safeParse(await readJson(req));
  if (!parsed.success) return invalid(parsed.error);

  const existing = await db.query.waitlist.findFirst({
    where: eq(waitlist.email, parsed.data.email),
  });
  if (existing) {
    return Response.json(
      { error: "This email is already on the waitlist." },
      { status: 409 },
    );
  }

  const [row] = await db
    .insert(waitlist)
    .values({
      email: parsed.data.email,
      name: parsed.data.name ?? null,
      useCase: parsed.data.useCase ?? null,
    })
    .returning({ id: waitlist.id });

  await logAudit({
    action: "waitlist.join",
    targetType: "waitlist",
    targetId: row.id,
    meta: { email: parsed.data.email },
  });

  // Confirmation email — best effort. Never throws, never faked.
  let emailSent = false;
  const name = parsed.data.name?.trim() || "there";
  const text =
    `Hi ${name},\n\nYou're on the Qelvyn waitlist. We'll email you as soon as early access opens.\n\n— The Qelvyn team`;
  try {
    const result = await sendEmail({
      to: parsed.data.email,
      subject: "You're on the Qelvyn waitlist",
      text,
      html: emailHtml(
        "You're on the waitlist",
        `<p>Hi ${name},</p><p>You're on the Qelvyn waitlist. We'll email you as soon as early access opens.</p><p>&mdash; The Qelvyn team</p>`,
      ),
    });
    emailSent = result.sent;
    if (!result.sent) console.error("[waitlist] confirmation email not sent:", result.reason);
  } catch (err) {
    console.error("[waitlist] confirmation email failed", err);
  }

  return Response.json({ ok: true, emailSent });
}
