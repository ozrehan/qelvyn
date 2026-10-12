import type { Metadata } from "next";
import { headers } from "next/headers";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Status — Qelvyn",
  description: "Live service status for Qelvyn. This page reports live values.",
};

export const dynamic = "force-dynamic";

type Row = { label: string; status: "ok" | "down" | "unknown"; detail: string };

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as unknown;
  } catch {
    return null;
  }
}

function StatusBadge({ status }: { status: Row["status"] }) {
  if (status === "ok")
    return <Badge tone="success">Operational</Badge>;
  if (status === "down") return <Badge tone="error">Down</Badge>;
  return <Badge tone="warning">Unknown</Badge>;
}

export default async function StatusPage() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const base = `${proto}://${host}`;

  const health = (await fetchJson(`${base}/api/health`)) as {
    status?: string;
    db?: boolean;
  } | null;

  const provider = (await fetchJson(`${base}/api/provider/status`)) as {
    provider?: string;
    configured?: boolean;
  } | null;

  const rows: Row[] = [
    {
      label: "Website",
      status: health?.status === "ok" ? "ok" : "down",
      detail: health?.status === "ok" ? "Responding normally" : "Health check failed",
    },
    {
      label: "Database",
      status: health ? (health.db ? "ok" : "down") : "unknown",
      detail: health ? (health.db ? "Up" : "Down") : "Could not check",
    },
    {
      label: "GPU provider",
      status: provider ? (provider.configured ? "ok" : "down") : "unknown",
      detail: provider
        ? provider.configured
          ? `Live (${provider.provider ?? "unknown"})`
          : "Not connected"
        : "Could not check",
    },
  ];

  // Email delivery is configured via RESEND_API_KEY; check at runtime without leaking.
  const emailConfigured = Boolean(process.env.RESEND_API_KEY);
  rows.push({
    label: "Email delivery",
    status: emailConfigured ? "ok" : "down",
    detail: emailConfigured ? "Configured" : "Not configured",
  });

  return (
    <Container>
      <PageHeader
        eyebrow="Status"
        title="Service status"
        description="This page reports live values."
      />
      <div className="max-w-3xl pb-16">
        <div className="overflow-x-auto border border-ink/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10">
                <th scope="col" className="px-4 py-3 font-medium text-smoke">Service</th>
                <th scope="col" className="px-4 py-3 font-medium text-smoke">Status</th>
                <th scope="col" className="px-4 py-3 font-medium text-smoke">Detail</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-ink/10 last:border-0">
                  <td className="px-4 py-3 font-medium">{row.label}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-smoke">{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-smoke">
          Values above are checked when this page loads. GPU provider status
          shows &ldquo;Not connected&rdquo; until a provider API key is
          configured; email shows &ldquo;Not configured&rdquo; until an email
          service key is set. Qelvyn is pre-launch, so some services being
          unconnected is expected.
        </p>
      </div>
    </Container>
  );
}
