import { Resend } from "resend";

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<{ sent: boolean; reason?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { sent: false, reason: "Email delivery is not configured yet." };
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "Qelvyn <onboarding@resend.dev>",
      to,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (err) {
    // Never throw from the mailer: callers decide how to surface a failure.
    console.error("[email] send failed", err);
    return {
      sent: false,
      reason: err instanceof Error ? err.message : "Email send failed.",
    };
  }
}

/** Minimal black-and-white HTML wrapper for transactional mail. No images. */
export function emailHtml(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;padding:32px;background:#ffffff;color:#000000;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:560px;margin:0 auto;border:1px solid #111111;padding:32px;">
<h1 style="font-size:20px;margin:0 0 16px 0;letter-spacing:2px;">QELVYN</h1>
<h2 style="font-size:18px;margin:0 0 16px 0;">${title}</h2>
<div style="font-size:14px;line-height:1.6;color:#111111;">${bodyHtml}</div>
<hr style="border:none;border-top:1px solid #111111;margin:24px 0;" />
<p style="font-size:12px;color:#777777;margin:0;">Qelvyn — cloud workstations.</p>
</div></body></html>`;
}
