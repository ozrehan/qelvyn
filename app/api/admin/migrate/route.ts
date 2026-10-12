// TEMPORARY operational route: applies pending Drizzle migrations on the
// production database using the raw postgres client (drizzle's own migrator
// hangs in this environment). Records drizzle-compatible journal rows so
// future `npm run db:migrate` calls work.
// Allowed unauthenticated only for schema catch-up (users or user_sessions
// table missing); otherwise requires admin. DELETE AFTER USE + redeploy.
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST() {
  const probe = await sql`
    SELECT to_regclass('public.users') AS users_r,
           to_regclass('public.user_sessions') AS sessions_r`;
  const row = (probe as any)[0];
  const catchup = row.users_r === null || row.sessions_r === null;
  if (!catchup) {
    const admin = await requireAdmin();
    if (admin instanceof Response) return admin;
  }

  const dir = join(process.cwd(), "drizzle");
  const journal = JSON.parse(
    readFileSync(join(dir, "meta", "_journal.json"), "utf8"),
  );

  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
  await sql`CREATE SCHEMA IF NOT EXISTS drizzle`;
  await sql`CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (id SERIAL PRIMARY KEY, hash text NOT NULL, created_at bigint)`;
  const appliedRows = await sql`SELECT hash FROM drizzle.__drizzle_migrations`;
  const applied = new Set((appliedRows as any[]).map((r) => r.hash));

  const done: string[] = [];
  for (const entry of journal.entries) {
    const content = readFileSync(join(dir, `${entry.tag}.sql`), "utf8");
    const hash = createHash("sha256").update(content).digest("hex");
    if (applied.has(hash)) continue;
    const statements = content
      .split("--> statement-breakpoint")
      .map((s: string) => s.trim())
      .filter(Boolean);
    for (const stmt of statements) {
      await sql.unsafe(stmt);
    }
    await sql`INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES (${hash}, ${entry.when})`;
    done.push(entry.tag);
  }
  return Response.json({ ok: true, applied: done, catchup });
}
