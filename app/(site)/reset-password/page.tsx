"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        password: String(form.get("password") ?? ""),
      }),
    });
    const body = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
    };
    setPending(false);
    if (!res.ok || !body.ok) {
      setError(body.error ?? "Could not reset your password.");
      return;
    }
    setDone(true);
  }

  return (
    <Container>
      <PageHeader
        eyebrow="Account"
        title="Reset password"
        description="Choose a new password for your account."
      />
      <div className="max-w-sm pb-24">
        {!token ? (
          <Alert tone="error" title="Missing reset token">
            This page needs a reset link. Use the link from your email, or{" "}
            <Link href="/forgot-password" className="underline underline-offset-4">
              request a new one
            </Link>
            .
          </Alert>
        ) : done ? (
          <div className="space-y-4">
            <Alert tone="success" title="Password updated">
              Your password has been changed. All other sessions were signed out.
            </Alert>
            <p className="text-sm text-smoke">
              <Link href="/login" className="underline underline-offset-4">
                Log in with your new password
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && <Alert tone="error">{error}</Alert>}
            <FormField
              label="New password"
              name="password"
              hint="At least 8 characters, with a letter and a number."
            >
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
              />
            </FormField>
            <Button type="submit" disabled={pending}>
              {pending ? "Updating…" : "Reset password"}
            </Button>
          </form>
        )}
      </div>
    </Container>
  );
}
