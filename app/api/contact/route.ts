import { db } from "@/lib/db";
import { contactMessages } from "@/lib/schema";
import { contactSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";
import { rateLimited, readJson, invalid } from "@/lib/api";

export async function POST(req: Request) {
  const limited = rateLimited(req, "contact", 10, 60_000);
  if (limited) return limited;

  const parsed = contactSchema.safeParse(await readJson(req));
  if (!parsed.success) return invalid(parsed.error);

  const [row] = await db
    .insert(contactMessages)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      topic: parsed.data.topic,
    })
    .returning({ id: contactMessages.id });

  await logAudit({
    action: "contact.submit",
    targetType: "contact_messages",
    targetId: row.id,
    meta: { email: parsed.data.email, topic: parsed.data.topic },
  });

  return Response.json({ ok: true });
}
