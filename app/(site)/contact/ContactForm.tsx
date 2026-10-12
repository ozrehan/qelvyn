"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm({ topic }: { topic?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = "Please enter a valid email address.";
    if (message.trim().length < 10)
      errs.message = "Please write a message of at least 10 characters.";
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          ...(topic ? { topic } : {}),
        }),
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
      <Alert tone="success" title="Message sent.">
        <p>Thanks for getting in touch — we&apos;ll reply to your email.</p>
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {status === "error" && error && (
        <Alert tone="error" title="Could not send your message">
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
      <FormField label="Message" name="message" error={fieldErrors.message}>
        <Textarea
          id="message"
          name="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </FormField>
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

