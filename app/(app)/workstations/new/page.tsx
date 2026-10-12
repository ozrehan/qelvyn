"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WORKSTATION_PLANS, estimateCost } from "@/lib/providers";
import { Container } from "@/components/ui/Container";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

type GpuState =
  | { kind: "loading" }
  | { kind: "live"; gpuTypes: Array<{ id: string; displayName: string; memoryInGb: number }> }
  | {
      kind: "catalog";
      fetchedAt: string;
      gpuTypes: Array<{ id: string; displayName: string; memoryInGb: number }>;
      note: string;
    }
  | { kind: "unavailable"; message: string };

const REGIONS = [
  { id: "sin", label: "Singapore (sin)" },
  { id: "EU-CZ-1", label: "EU — Czechia (EU-CZ-1)" },
  { id: "US-TX-2", label: "US — Texas (US-TX-2)" },
];

export default function NewWorkstationPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [plan, setPlan] = useState("creator");
  const [region, setRegion] = useState("sin");
  const [gpu, setGpu] = useState<GpuState>({ kind: "loading" });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/provider/gpus", { cache: "no-store" });
        const body = (await res.json()) as {
          live?: boolean;
          gpuTypes?: Array<{ id: string; displayName: string; memoryInGb: number }>;
          fetchedAt?: string;
          note?: string;
          error?: string;
        };
        if (cancelled) return;
        if (res.ok && body.live && body.gpuTypes) {
          setGpu({ kind: "live", gpuTypes: body.gpuTypes });
        } else if (res.ok && body.gpuTypes) {
          setGpu({
            kind: "catalog",
            fetchedAt: body.fetchedAt ?? "unknown",
            gpuTypes: body.gpuTypes,
            note: body.note ?? "",
          });
        } else {
          setGpu({ kind: "unavailable", message: body.error ?? "GPU catalog unavailable." });
        }
      } catch {
        if (!cancelled) setGpu({ kind: "unavailable", message: "Could not reach the GPU catalog." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await fetch("/api/workstations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, plan, region }),
    });
    const body = (await res.json().catch(() => ({}))) as {
      workstation?: { id: string };
      error?: string;
    };
    setPending(false);
    if (!res.ok || !body.workstation) {
      setError(body.error ?? "Could not create the workstation.");
      return;
    }
    router.push(`/workstations/${body.workstation.id}`);
  }

  const selectedPlan = WORKSTATION_PLANS.find((p) => p.id === plan)!;

  return (
    <Container>
      <div className="py-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">Compute</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">New workstation</h1>
        <p className="mt-2 max-w-2xl text-smoke">
          Creating a workstation saves its configuration. Nothing is provisioned — and
          nothing is charged — until you launch it.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-16 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="py-6">
            {gpu.kind === "unavailable" && (
              <Alert tone="info" title="GPU provider not connected" className="mb-6">
                {gpu.message} You can still save this workstation&apos;s configuration now;
                launching it will need a connected provider.{" "}
                <Link href="/waitlist" className="underline underline-offset-4">
                  Join the waitlist
                </Link>{" "}
                to get early access.
              </Alert>
            )}
            <form onSubmit={onSubmit} className="space-y-4">
              {error && <Alert tone="error">{error}</Alert>}
              <FormField label="Name" name="name">
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={40}
                  placeholder="e.g. Edit box 01"
                />
              </FormField>
              <FormField label="Plan" name="plan" hint={`${selectedPlan.creditsPerMin} credits/min ≈ ${estimateCost(plan, 60)} credits/hour when running.`}>
                <Select id="plan" name="plan" value={plan} onChange={(e) => setPlan(e.target.value)}>
                  {WORKSTATION_PLANS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.gpu}, {p.vcpu} vCPU, {p.ramGb} GB RAM, {p.storageGb} GB disk
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField
                label="Region"
                name="region"
                hint="Preferred provider data center. Actual availability depends on the provider."
              >
                <Select
                  id="region"
                  name="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </Select>
              </FormField>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={pending}>
                  {pending ? "Creating…" : "Create workstation"}
                </Button>
                <Button variant="outline" href="/workstations">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available GPUs</CardTitle>
            <CardDescription>
              {gpu.kind === "live" && "Live from the connected provider."}
              {gpu.kind === "catalog" && "From a saved catalog — not live."}
              {gpu.kind === "loading" && "Loading…"}
              {gpu.kind === "unavailable" && "Not available."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {gpu.kind === "live" && (
              <ul className="space-y-2">
                {gpu.gpuTypes.map((g) => (
                  <li key={g.id} className="border border-ink/10 px-3 py-2 text-sm">
                    <span className="font-medium">{g.displayName}</span>
                    <span className="text-smoke"> · {g.memoryInGb} GB</span>
                  </li>
                ))}
              </ul>
            )}
            {gpu.kind === "catalog" && (
              <div className="space-y-3">
                <Alert tone="info">{gpu.note}</Alert>
                <p className="text-xs text-smoke">Captured {gpu.fetchedAt}.</p>
                <ul className="space-y-2">
                  {gpu.gpuTypes.map((g) => (
                    <li key={g.id} className="border border-ink/10 px-3 py-2 text-sm">
                      <span className="font-medium">{g.displayName}</span>
                      <span className="text-smoke"> · {g.memoryInGb} GB</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {gpu.kind === "unavailable" && (
              <div className="space-y-2">
                <Badge tone="concept">Concept</Badge>
                <p className="text-sm text-smoke">{gpu.message}</p>
              </div>
            )}
            {gpu.kind === "loading" && <p className="text-sm text-smoke">Loading…</p>}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
