import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { waitlist } from "@/lib/schema";
import { requireAdmin } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  const rows = await db
    .select()
    .from(waitlist)
    .orderBy(desc(waitlist.createdAt))
    .limit(500);

  return Response.json({ waitlist: rows });
}
