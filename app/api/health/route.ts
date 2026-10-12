import { sql } from "@/lib/db";
import { getProvider } from "@/lib/providers";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbOk = false;
  try {
    await sql`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }
  const provider = getProvider();
  return Response.json({
    status: "ok",
    time: new Date().toISOString(),
    db: dbOk,
    gpuProvider: { name: provider.name, configured: provider.isConfigured() },
  });
}
