import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/schema";
import { requireAdmin } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  const rows = await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(200);

  return Response.json({ auditLogs: rows });
}
