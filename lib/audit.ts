import { db } from "./db";
import { auditLogs } from "./schema";

export async function logAudit({
  actorId,
  action,
  targetType,
  targetId,
  meta,
}: {
  actorId?: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  meta?: unknown;
}): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      actorId: actorId ?? null,
      action,
      targetType,
      targetId,
      meta: (meta ?? null) as any,
    });
  } catch (err) {
    console.error("logAudit failed", err);
  }
}
