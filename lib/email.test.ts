import { describe, it, expect } from "vitest";
import { sendEmail } from "./email";

describe("sendEmail", () => {
  it("reports sent:false (honestly) when no RESEND_API_KEY is set", async () => {
    const saved = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;
    try {
      const r = await sendEmail({
        to: "a@b.com",
        subject: "s",
        text: "plain",
        html: "<p>plain</p>",
      });
      expect(r.sent).toBe(false);
      expect(r.reason).toMatch(/not configured/i);
    } finally {
      if (saved !== undefined) process.env.RESEND_API_KEY = saved;
    }
  });
});
