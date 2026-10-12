"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { fmtDate } from "../../_components/status";

type SessionRow = {
  token: string;
  tokenPrefix: string;
  expires: string;
  expired: boolean;
  current: boolean;
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/me/sessions", { cache: "no-store" });
    if (!res.ok) {
      setError("Could not load sessions.");
      return;
    }
    const body = (await res.json()) as { sessions: SessionRow[] };
    setSessions(body.sessions);
  }

  useEffect(() => {
    load();
  }, []);

  async function revoke(token: string) {
    setRevoking(token);
    setError(null);
    const res = await fetch(`/api/me/sessions/${encodeURIComponent(token)}`, {
      method: "DELETE",
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    setRevoking(null);
    if (!res.ok) {
      setError(body.error ?? "Could not revoke session.");
      return;
    }
    load();
  }

  return (
    <Container>
      <div className="py-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">Account</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Sessions</h1>
        <p className="mt-2 max-w-2xl text-smoke">
          Every device signed in to your account, straight from the database.
        </p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>Revoke any session you don&apos;t recognize.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <Alert tone="error" className="mb-4">{error}</Alert>}
          {sessions === null && !error && <p className="text-sm text-smoke">Loading…</p>}
          {sessions && sessions.length === 0 && (
            <p className="py-6 text-center text-sm text-smoke">No sessions found.</p>
          )}
          {sessions && sessions.length > 0 && (
            <ul className="divide-y divide-ink/10">
              {sessions.map((s) => (
                <li key={s.token} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-mono text-sm">
                      {s.tokenPrefix}
                      {s.current && (
                        <Badge tone="success" className="ml-2">
                          This device
                        </Badge>
                      )}
                      {s.expired && (
                        <Badge tone="error" className="ml-2">
                          Expired
                        </Badge>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-smoke">Expires {fmtDate(s.expires)}</p>
                  </div>
                  {!s.current && !s.expired && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={revoking === s.token}
                      onClick={() => revoke(s.token)}
                    >
                      {revoking === s.token ? "Revoking…" : "Revoke"}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4">
            <Button variant="ghost" href="/settings">
              ← Back to settings
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="pb-16" />
    </Container>
  );
}
