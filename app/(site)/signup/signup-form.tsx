"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export function SignupForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setEmailNotice(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      emailConfigured?: boolean;
      emailSent?: boolean;
    };
    if (!res.ok || !body.ok) {
      setError(body.error ?? "Could not create your account.");
      setPending(false);
      return;
    }

    if (body.emailSent) {
      setEmailNotice(
        "Account created — check your inbox to verify your email. The link expires in 24 hours.",
      );
    } else if (!body.emailConfigured) {
      setEmailNotice(
        "Email verification arrives when email delivery is configured — your account is ready to use now.",
      );
    }

    const result = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
      callbackUrl,
    });
    setPending(false);
    if (!result || result.error) {
      setError("Account created, but automatic sign-in failed. Please log in.");
      return;
    }
    router.push(result.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm space-y-4 pb-24">
      {error && (
        <Alert tone="error" title="Could not sign up">
          {error}
        </Alert>
      )}
      {emailNotice && <Alert tone="info">{emailNotice}</Alert>}
      <FormField label="Name" name="name">
        <Input id="name" name="name" type="text" autoComplete="name" required minLength={2} />
      </FormField>
      <FormField label="Email" name="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </FormField>
      <FormField
        label="Password"
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
        {pending ? "Creating account…" : "Sign up"}
      </Button>
      <p className="text-sm text-smoke">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Log in
        </Link>
      </p>
    </form>
  );
}
