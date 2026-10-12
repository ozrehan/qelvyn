"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

const USE_CASES = [
  "Video editing & color grading",
  "3D rendering (Blender, etc.)",
  "ML training / fine-tuning",
  "Game development",
  "Something else",
];

type Check = {
  latencies: number[];
  downlink: string;
  screen: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [useCase, setUseCase] = useState<string | null>(null);
  const [check, setCheck] = useState<Check | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  async function runNetworkCheck() {
    setChecking(true);
    setCheckError(null);
    try {
      const latencies: number[] = [];
      for (let i = 0; i < 3; i++) {
        const t0 = performance.now();
        const res = await fetch("/api/health", { cache: "no-store" });
        if (!res.ok) throw new Error("Health check failed");
        latencies.push(Math.round(performance.now() - t0));
      }
      const conn = (navigator as any).connection;
      setCheck({
        latencies,
        downlink: conn?.downlink ? `${conn.downlink} Mbps` : "not reported by this browser",
        screen: `${window.innerWidth} × ${window.innerHeight} px`,
      });
    } catch {
      setCheckError("Could not reach the server. Check your connection and try again.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <Container>
      <PageHeader
        eyebrow={`Step ${step + 1} of 3`}
        title={
          step === 0 ? "Welcome to Qelvyn" : step === 1 ? "What will you build?" : "Check your connection"
        }
        description={
          step === 0
            ? "Cloud workstations with real GPUs, streamed to your laptop. This takes about a minute."
            : step === 1
              ? "Pick the closest match — it helps us prioritize what to build next."
              : "Measured on your device, right now — nothing guessed."
        }
      />

      <div className="max-w-2xl pb-24">
        {step === 0 && (
          <Card>
            <CardContent className="space-y-3 py-6">
              <p className="text-smoke">
                Qelvyn gives you a cloud workstation with a real GPU: launch it, connect over
                Moonlight/Sunshine, and edit, render, or train as if the machine were on your
                desk.
              </p>
              <p className="text-smoke">
                GPU access is billed in credits per minute. Billing is not live yet — nothing
                can charge you today.
              </p>
              <div className="pt-2">
                <Button onClick={() => setStep(1)}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Your use case</CardTitle>
              <CardDescription>Select one to continue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {USE_CASES.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUseCase(u)}
                  className={`block w-full border px-4 py-3 text-left text-sm transition-colors ${
                    useCase === u ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink"
                  }`}
                >
                  {u}
                </button>
              ))}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button disabled={!useCase} onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Network check</CardTitle>
              <CardDescription>
                Streaming a workstation needs a stable, low-latency connection.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!check && !checkError && !checking && (
                <Button onClick={runNetworkCheck}>Run network check</Button>
              )}
              {checking && <p className="text-sm text-smoke">Measuring…</p>}
              {checkError && (
                <div className="space-y-3">
                  <Alert tone="error">{checkError}</Alert>
                  <Button variant="outline" onClick={runNetworkCheck}>
                    Try again
                  </Button>
                </div>
              )}
              {check && (
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="border border-ink/10 px-4 py-3">
                    <dt className="text-[11px] uppercase tracking-widest text-smoke">
                      Latency to server
                    </dt>
                    <dd className="mt-1 font-display text-lg font-semibold">
                      {check.latencies.join(" / ")} ms
                    </dd>
                    <dd className="text-xs text-smoke">3 fetches, measured on your device</dd>
                  </div>
                  <div className="border border-ink/10 px-4 py-3">
                    <dt className="text-[11px] uppercase tracking-widest text-smoke">
                      Downlink estimate
                    </dt>
                    <dd className="mt-1 font-display text-lg font-semibold">{check.downlink}</dd>
                    <dd className="text-xs text-smoke">from your browser, if reported</dd>
                  </div>
                  <div className="border border-ink/10 px-4 py-3">
                    <dt className="text-[11px] uppercase tracking-widest text-smoke">
                      Screen size
                    </dt>
                    <dd className="mt-1 font-display text-lg font-semibold">{check.screen}</dd>
                    <dd className="text-xs text-smoke">measured on your device</dd>
                  </div>
                </dl>
              )}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => router.push("/dashboard")}>Complete</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
}
