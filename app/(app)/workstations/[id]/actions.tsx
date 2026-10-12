"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { estimateCost } from "@/lib/providers";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

type Ws = {
  id: string;
  name: string;
  plan: string;
  status: string;
  providerId: string | null;
  ipAddress: string | null;
};

export function WorkstationActions({ workstation }: { workstation: Ws }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [showLaunchConfirm, setShowLaunchConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function call(action: "launch" | "start" | "stop", method = "POST") {
    setError(null);
    setBusy(action);
    try {
      const res = await fetch(`/api/workstations/${workstation.id}/${action}`, { method });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(body.error ?? `${action} failed.`);
      } else {
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  async function onDelete() {
    setError(null);
    setBusy("delete");
    try {
      const res = await fetch(`/api/workstations/${workstation.id}`, { method: "DELETE" });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(body.error ?? "Delete failed.");
        setBusy(null);
      } else {
        router.push("/workstations");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
      setBusy(null);
    }
  }

  const launched = !!workstation.providerId;
  const canLaunch = !launched && workstation.status !== "terminated";
  const canStart = launched && workstation.status !== "running" && workstation.status !== "terminated";
  const canStop = launched && workstation.status === "running";
  const isTerminated = workstation.status === "terminated";

  return (
    <div className="space-y-4">
      {error && <Alert tone="error">{error}</Alert>}

      <div className="flex flex-wrap gap-3">
        {canLaunch && (
          <Button disabled={busy !== null} onClick={() => setShowLaunchConfirm(true)}>
            {busy === "launch" ? "Launching…" : "Launch"}
          </Button>
        )}
        {canStart && (
          <Button variant="outline" disabled={busy !== null} onClick={() => call("start")}>
            {busy === "start" ? "Starting…" : "Start"}
          </Button>
        )}
        {canStop && (
          <Button variant="outline" disabled={busy !== null} onClick={() => call("stop")}>
            {busy === "stop" ? "Stopping…" : "Stop"}
          </Button>
        )}
        <Button variant="outline" href={`/workstations/${workstation.id}/connect`}>
          Connect
        </Button>
        {!isTerminated && (
          <Button variant="ghost" disabled={busy !== null} onClick={() => setShowDeleteConfirm(true)}>
            {busy === "delete" ? "Deleting…" : "Delete"}
          </Button>
        )}
      </div>

      {showLaunchConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm launch"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={() => setShowLaunchConfirm(false)}
        >
          <div
            className="max-w-md border border-ink bg-paper p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-xl font-bold">Launch this workstation?</h2>
            <div className="mt-3 space-y-2 text-sm text-smoke">
              <p>
                Launching provisions a <strong className="text-ink">real GPU machine</strong>{" "}
                on the provider and <strong className="text-ink">spends real money</strong>.
              </p>
              <p>
                Estimated cost: <strong className="text-ink">{estimateCost(workstation.plan, 60)} credits/hour</strong>{" "}
                while it runs. Stopping the workstation stops further charges, but time
                already used is billed.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                disabled={busy !== null}
                onClick={() => {
                  setShowLaunchConfirm(false);
                  call("launch");
                }}
              >
                {busy === "launch" ? "Launching…" : "Launch and start spending"}
              </Button>
              <Button variant="outline" onClick={() => setShowLaunchConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm delete"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="max-w-md border border-ink bg-paper p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-xl font-bold">Delete this workstation?</h2>
            <p className="mt-3 text-sm text-smoke">
              The provider machine will be terminated if one exists, and the workstation
              will be marked terminated. This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <Button disabled={busy !== null} onClick={() => {
                setShowDeleteConfirm(false);
                onDelete();
              }}>
                {busy === "delete" ? "Deleting…" : "Delete workstation"}
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
