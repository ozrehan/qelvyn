"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { StatusBadge } from "../../../_components/status";

type Ws = {
  id: string;
  name: string;
  status: string;
  ipAddress: string | null;
  providerId: string | null;
};

const RESOLUTIONS = ["1280×720", "1920×1080", "2560×1440", "3840×2160"];
const BITRATES = ["10 Mbps", "20 Mbps", "40 Mbps", "80 Mbps"];

function loadPref(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export default function ConnectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [ws, setWs] = useState<Ws | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resolution, setResolution] = useState("1920×1080");
  const [bitrate, setBitrate] = useState("20 Mbps");
  const [latency, setLatency] = useState<number[] | null>(null);
  const [checking, setChecking] = useState(false);

  const fetchWs = useCallback(async () => {
    const res = await fetch(`/api/workstations/${params.id}`, { cache: "no-store" });
    if (!res.ok) {
      setError("Could not load this workstation.");
      return;
    }
    const body = (await res.json()) as { workstation: Ws };
    setWs(body.workstation);
  }, [params.id]);

  useEffect(() => {
    setResolution(loadPref("qelvyn.stream.resolution", "1920×1080"));
    setBitrate(loadPref("qelvyn.stream.bitrate", "20 Mbps"));
    fetchWs();
  }, [fetchWs]);

  function savePref(key: string, value: string, setter: (v: string) => void) {
    setter(value);
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage unavailable — preference just won't persist */
    }
  }

  async function runNetworkCheck() {
    setChecking(true);
    try {
      const out: number[] = [];
      for (let i = 0; i < 3; i++) {
        const t0 = performance.now();
        await fetch("/api/health", { cache: "no-store" });
        out.push(Math.round(performance.now() - t0));
      }
      setLatency(out);
    } finally {
      setChecking(false);
    }
  }

  async function stopWorkstation() {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/workstations/${params.id}/stop`, { method: "POST" });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!res.ok) setError(body.error ?? "Stop failed.");
    else fetchWs();
  }

  async function startWorkstation() {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/workstations/${params.id}/start`, { method: "POST" });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    if (!res.ok) setError(body.error ?? "Start failed.");
    else fetchWs();
  }

  return (
    <Container>
      <div className="py-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">
          <Link href={`/workstations/${params.id}`} className="hover:underline">
            Workstation
          </Link>{" "}
          / Connect
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {ws ? ws.name : "Connect"}
          </h1>
          {ws && <StatusBadge status={ws.status} />}
        </div>
      </div>

      <div className="max-w-3xl space-y-6 pb-16">
        {error && <Alert tone="error">{error}</Alert>}
        {!ws && !error && <p className="text-sm text-smoke">Loading…</p>}

        {ws && (ws.status === "pending" || ws.status === "provisioning") && (
          <Card>
            <CardContent className="space-y-4 py-8 text-center">
              <p className="font-display text-xl font-semibold">Your workstation is being prepared</p>
              <p className="mx-auto max-w-md text-sm text-smoke">
                Provisioning takes a few minutes. This page doesn&apos;t auto-refresh — check
                back and reload the status.
              </p>
              <Button variant="outline" onClick={fetchWs}>
                Refresh status
              </Button>
            </CardContent>
          </Card>
        )}

        {ws && ws.status === "stopped" && (
          <Card>
            <CardContent className="space-y-4 py-8 text-center">
              <p className="font-display text-xl font-semibold">This workstation is stopped</p>
              <p className="mx-auto max-w-md text-sm text-smoke">
                Start it first, then come back here to connect.
              </p>
              <Button disabled={busy} onClick={startWorkstation}>
                {busy ? "Starting…" : "Start workstation"}
              </Button>
            </CardContent>
          </Card>
        )}

        {ws && ws.status === "terminated" && (
          <Alert tone="error" title="Workstation terminated">
            This workstation has been terminated and can no longer be connected to.
          </Alert>
        )}

        {ws && ws.status === "running" && !ws.ipAddress && (
          <Alert tone="info" title="No address yet">
            The workstation reports as running, but no public IP is available yet. Wait a
            moment and refresh — a connection is only possible once an address is assigned.{" "}
            <Button size="sm" variant="outline" onClick={fetchWs} className="ml-2">
              Refresh
            </Button>
          </Alert>
        )}

        {ws && ws.status === "running" && ws.ipAddress && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Connect with Moonlight</CardTitle>
                <CardDescription>
                  Qelvyn workstations stream over Sunshine (host) + Moonlight (client) — the
                  same protocol as NVIDIA GameStream.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal space-y-2 pl-5 text-sm text-smoke">
                  <li>Install Moonlight on this device (moonlight-stream.org).</li>
                  <li>
                    Add a host manually with address{" "}
                    <code className="border border-ink/20 bg-ink/5 px-1 font-mono text-ink">
                      {ws.ipAddress}
                    </code>
                    .
                  </li>
                  <li>
                    Make sure UDP ports <strong className="text-ink">47984–48010</strong> are
                    reachable from your network to the host.
                  </li>
                  <li>
                    On first connect, the host shows a <strong className="text-ink">pairing PIN</strong> —
                    enter it in Moonlight to pair this device. Pairing is per-device and
                    stays until you unpair it on the host.
                  </li>
                  <li>Pick the desktop session and connect.</li>
                </ol>
                <Alert tone="info">
                  This page gives you the address and settings — the actual stream opens in
                  the Moonlight app, not in this browser tab.
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Streaming quality</CardTitle>
                <CardDescription>Saved on this device only.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Resolution" name="resolution">
                  <Select
                    id="resolution"
                    value={resolution}
                    onChange={(e) => savePref("qelvyn.stream.resolution", e.target.value, setResolution)}
                  >
                    {RESOLUTIONS.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Bitrate" name="bitrate">
                  <Select
                    id="bitrate"
                    value={bitrate}
                    onChange={(e) => savePref("qelvyn.stream.bitrate", e.target.value, setBitrate)}
                  >
                    {BITRATES.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </Select>
                </FormField>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network check</CardTitle>
                <CardDescription>Latency from this device to Qelvyn, measured live.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" onClick={runNetworkCheck} disabled={checking}>
                  {checking ? "Measuring…" : "Run network check"}
                </Button>
                {latency && (
                  <p className="text-sm">
                    Latency: <strong>{latency.join(" / ")} ms</strong> (3 fetches, measured on
                    your device)
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disconnect & shutdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-smoke">
                  Closing Moonlight only disconnects your stream — the workstation keeps
                  running (and billing). Stop it to end the session and stop charges.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => router.push("/workstations")}>
                    Disconnect (back to list)
                  </Button>
                  <Button variant="ghost" disabled={busy} onClick={stopWorkstation}>
                    {busy ? "Stopping…" : "Stop workstation"}
                  </Button>
                </div>
                <p className="text-xs text-smoke">
                  <Badge tone="concept" className="mr-2">Concept</Badge> One-click shutdown from the
                  Moonlight session is not built yet — stop from here.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Container>
  );
}
