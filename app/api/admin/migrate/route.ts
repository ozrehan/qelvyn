// TEMPORARY operational route: applies pending Drizzle migrations on the
// production database. It exists only because one-off Render jobs are not
// available on the free tier and the DB is unreachable from outside.
// DELETE THIS FILE (and redeploy) after migrations have been applied.
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST() {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  await migrate(db, { migrationsFolder: "./drizzle" });
  return Response.json({ ok: true });
}
