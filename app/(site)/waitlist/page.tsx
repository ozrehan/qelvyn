"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function WaitlistPage() {
  const [done, setDone] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") ?? "") || undefined,
        email: String(form.get("email") ?? ""),
        useCase: String(form.get("useCase") ?? "") || undefined,
      }),
    });
    const body = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      emailSent?: boolean;
    };
    setPending(false);
    if (!res.ok || !body.ok) {
      setError(body.error ?? "Could not join the waitlist.");
      return;
    }
    setEmailSent(!!body.emailSent);
    setDone(true);
  }

  return (
    <Container>
      <PageHeader
        eyebrow="Early access"
        title="Join the waitlist"
        description="Get early access to Qelvyn cloud workstations."
      />
      <div className="max-w-sm pb-24">
        {done ? (
          <div className="space-y-4">
            <Alert tone="success" title="You're on the waitlist">
              {emailSent
                ? "We sent a confirmation email — check your inbox."
                : "We'll email you as soon as early access opens."}
            </Alert>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && <Alert tone="error">{error}</Alert>}
            <FormField label="Name" name="name">
              <Input id="name" name="name" type="text" autoComplete="name" />
            </FormField>
            <FormField label="Email" name="email">
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </FormField>
            <FormField label="Use case" name="useCase" hint="Optional — what would you use it for?">
              <Textarea id="useCase" name="useCase" rows={3} />
            </FormField>
            <Button type="submit" disabled={pending}>
              {pending ? "Joining…" : "Join waitlist"}
            </Button>
          </form>
        )}
      </div>
    </Container>
  );
}
