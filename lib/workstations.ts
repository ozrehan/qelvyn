import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { workstations } from "./schema";

export async function getOwnWorkstation(userId: string, id: string) {
  return db.query.workstations.findFirst({
    where: and(eq(workstations.id, id), eq(workstations.userId, userId)),
  });
}

export function notFound() {
  return Response.json({ error: "Workstation not found." }, { status: 404 });
}
