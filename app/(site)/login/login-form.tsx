"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export function LoginForm({
  callbackUrl,
  initialError,
}: {
  callbackUrl: string;
  initialError: string | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(initialError);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      redirect: false,
      callbackUrl,
    });
    setPending(false);
    if (!result || result.error) {
      setError("Email or password is incorrect.");
      return;
    }
    router.push(result.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm space-y-4 pb-24">
      {error && (
        <Alert tone="error" title="Could not sign in">
          {error}
        </Alert>
      )}
      <FormField label="Email" name="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </FormField>
      <FormField label="Password" name="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </FormField>
      <Button type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Login"}
      </Button>
      <p className="text-sm text-smoke">
        No account yet?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          Sign up
        </Link>{" "}
        ·{" "}
        <Link href="/forgot-password" className="underline underline-offset-4">
          Forgot password?
        </Link>
      </p>
    </form>
  );
}
