"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

type VerifyState = "checking" | "ok" | "bad";

export function VerifyEmailForm({ token }: { token: string }) {
  const [state, setState] = useState<VerifyState>(token ? "checking" : "bad");
  const [error, setError] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState("");
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (cancelled) return;
      if (res.ok && body.ok) {
        setState("ok");
      } else {
        setState("bad");
        setError(body.error ?? "This verification link didn't work.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function onResend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResending(true);
    await fetch("/api/auth/verify-email/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resendEmail }),
    });
    setResending(false);
    setResent(true);
  }

  return (
    <div className="max-w-sm space-y-4 pb-24">
      {state === "checking" && <p className="text-sm text-smoke">Verifying your email…</p>}

      {state === "ok" && (
        <>
          <Alert tone="success" title="Email verified">
            Your email address is confirmed. You can now log in.
          </Alert>
          <Button href="/login">Log in</Button>
        </>
      )}

      {state === "bad" && (
        <>
          <Alert tone="error" title="Verification failed">
            {error ?? "This link is invalid or has expired. Request a new one below."}
          </Alert>
          {resent ? (
            <Alert tone="success">
              If an unverified account exists for that email, a new link is on its way.
            </Alert>
          ) : (
            <form onSubmit={onResend} className="space-y-4 border border-ink/10 p-4">
              <p className="text-sm font-medium">Didn&apos;t get the email? Resend it.</p>
              <FormField label="Email" name="resend-email">
                <Input
                  id="resend-email"
                  name="resend-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                />
              </FormField>
              <Button type="submit" variant="outline" disabled={resending}>
                {resending ? "Sending…" : "Resend verification email"}
              </Button>
            </form>
          )}
          <p className="text-sm text-smoke">
            <Link href="/login" className="underline underline-offset-4">
              Back to login
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
