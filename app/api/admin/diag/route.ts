// TEMPORARY diagnostic route. DELETE after use.
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const t0 = Date.now();
  const rows = await db.execute(
    sql`SELECT to_regclass('public.users') AS users_regclass`,
  );
  return Response.json({ ok: true, ms: Date.now() - t0, rows });
}
