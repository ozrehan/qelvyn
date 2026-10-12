"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function ForgotPasswordPage() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setState("sending");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: String(form.get("email") ?? "") }),
    });
    const body = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      sent?: boolean;
      notice?: string;
    };
    setState("done");
    if (!res.ok || !body.ok) {
      setError(body.error ?? "Could not process the request.");
      setState("idle");
      return;
    }
    if (body.sent === false && body.notice) setNotice(body.notice);
  }

  return (
    <Container>
      <PageHeader
        eyebrow="Account"
        title="Forgot password"
        description="Enter your email and we will send you a reset link."
      />
      <div className="max-w-sm pb-24">
        {state === "done" && !error ? (
          <div className="space-y-4">
            <Alert tone="success" title="Check your inbox">
              If an account exists for that email, a reset link is on its way. The link
              expires in 1 hour.
            </Alert>
            {notice && (
              <Alert tone="info" title="Email delivery not configured">
                {notice}
              </Alert>
            )}
            <p className="text-sm text-smoke">
              <Link href="/login" className="underline underline-offset-4">
                Back to login
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && <Alert tone="error">{error}</Alert>}
            <FormField label="Email" name="email">
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </FormField>
            <Button type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        )}
      </div>
    </Container>
  );
}
