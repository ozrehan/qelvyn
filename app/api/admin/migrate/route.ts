// TEMPORARY operational route: applies pending Drizzle migrations on the
// production database using the raw postgres client (drizzle's own migrator
// hangs in this environment; root cause still under investigation).
// Applies each .sql in journal order, split on statement-breakpoints, and
// records drizzle-compatible journal rows (hash = sha256 of file content,
// created_at = journal `when`) so future `npm run db:migrate` calls work.
// Bootstrap rule: fresh DB (no users table) may call once unauthenticated;
// afterwards requires admin. DELETE THIS FILE (and redeploy) after use.
import { createHash } from "crypto";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST() {
  const probe = await sql`SELECT to_regclass('public.users') AS r`;
  const fresh = (probe as any)[0].r === null;
  if (!fresh) {
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
    const file = join(dir, `${entry.tag}.sql`);
    const content = readFileSync(file, "utf8");
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
  return Response.json({ ok: true, applied: done, bootstrapped: fresh });
}
