import { readFile } from "fs/promises";
import { join } from "path";
import { getProvider } from "@/lib/providers";
import { ProviderNotConfiguredError } from "@/lib/providers/types";

export const dynamic = "force-dynamic";

type CatalogFile = {
  fetchedAt: string;
  gpuTypes: Array<{ id: string; displayName: string; memoryInGb: number }>;
};

async function readCatalog(): Promise<CatalogFile | null> {
  try {
    const raw = await readFile(join(process.cwd(), "data", "gpu-catalog.json"), "utf8");
    const parsed = JSON.parse(raw) as CatalogFile;
    if (!Array.isArray(parsed.gpuTypes) || typeof parsed.fetchedAt !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function GET() {
  const provider = getProvider();

  // Live: read-only catalog query against the real control plane. Never faked.
  if (provider.isConfigured()) {
    try {
      const gpuTypes = await provider.getGpuTypes();
      return Response.json({ live: true, gpuTypes });
    } catch (err) {
      return Response.json(
        {
          error:
            err instanceof Error
              ? err.message
              : "Failed to fetch the GPU catalog from the provider.",
        },
        { status: 502 },
      );
    }
  }

  // Stale: an operator-captured catalog from a validated read-only check.
  const catalog = await readCatalog();
  if (catalog) {
    return Response.json({
      live: false,
      fetchedAt: catalog.fetchedAt,
      gpuTypes: catalog.gpuTypes,
      note: "Catalog from a validated read-only check; refresh before quoting.",
    });
  }

  const err = new ProviderNotConfiguredError();
  return Response.json({ error: err.message }, { status: 503 });
}
