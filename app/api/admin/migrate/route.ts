// TEMPORARY operational route: applies pending Drizzle migrations on the
// production database. It exists only because one-off Render jobs are not
// available on the free tier and the DB is unreachable from outside.
// Bootstrap rule: if the database has no tables yet (fresh install), the
// migrate is allowed once without a session; afterwards it requires admin.
// DELETE THIS FILE (and redeploy) after migrations have been applied.
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST() {
  const [{ exists }] = await db.execute(
    sql`SELECT to_regclass('public.users') IS NOT NULL AS exists`,
  );
  if (exists) {
    const admin = await requireAdmin();
    if (admin instanceof Response) return admin;
  }
  await migrate(db, { migrationsFolder: "./drizzle" });
  return Response.json({ ok: true, bootstrapped: !exists });
}
