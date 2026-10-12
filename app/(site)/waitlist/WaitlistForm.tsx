"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

type Status = "idle" | "loading" | "success" | "error";

export function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [useCase, setUseCase] = useState("Video editing");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = "Please enter a valid email address.";
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), useCase }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data && (data as { ok?: boolean }).ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(
          (data as { error?: string } | null)?.error ??
            "Something went wrong. Please try again later."
        );
      }
    } catch {
      setStatus("error");
      setError("Could not reach the server. Please try again later.");
    }
  }

  if (status === "success") {
    return (
      <Alert tone="success" title="You're on the list.">
        <p>
          Thanks for joining the Qelvyn waitlist. We&apos;ll email you when
          we&apos;re ready to invite early users.
        </p>
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {status === "error" && error && (
        <Alert tone="error" title="Could not join the waitlist">
          <p>{error}</p>
        </Alert>
      )}
      <FormField label="Name" name="name" error={fieldErrors.name}>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormField>
      <FormField label="Email" name="email" error={fieldErrors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <FormField label="What will you use it for?" name="useCase">
        <Select
          id="useCase"
          name="useCase"
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
        >
          <option value="Video editing">Video editing</option>
          <option value="3D & VFX">3D &amp; VFX</option>
          <option value="Other">Other</option>
        </Select>
      </FormField>
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Joining…" : "Join the waitlist"}
      </Button>
    </form>
  );
}
