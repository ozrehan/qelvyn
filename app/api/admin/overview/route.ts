import { count } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, workstations, waitlist, usageEvents, contactMessages } from "@/lib/schema";
import { requireAdmin } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  // Simple, honest aggregates straight from the DB.
  const [[u], [w], [wl], [cm], [ue]] = await Promise.all([
    db.select({ c: count() }).from(users),
    db.select({ c: count() }).from(workstations),
    db.select({ c: count() }).from(waitlist),
    db.select({ c: count() }).from(contactMessages),
    db.select({ c: count() }).from(usageEvents),
  ]);

  return Response.json({
    users: u.c,
    workstations: w.c,
    waitlist: wl.c,
    contactMessages: cm.c,
    usageEvents: ue.c,
  });
}
