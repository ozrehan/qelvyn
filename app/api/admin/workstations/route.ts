import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { workstations, users } from "@/lib/schema";
import { requireAdmin } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;

  const rows = await db
    .select({
      id: workstations.id,
      name: workstations.name,
      plan: workstations.plan,
      region: workstations.region,
      status: workstations.status,
      providerId: workstations.providerId,
      ipAddress: workstations.ipAddress,
      createdAt: workstations.createdAt,
      ownerEmail: users.email,
      ownerName: users.name,
    })
    .from(workstations)
    .leftJoin(users, eq(users.id, workstations.userId))
    .orderBy(desc(workstations.createdAt))
    .limit(200);

  return Response.json({ workstations: rows });
}
