"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function SettingsPage() {
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, setPending] = useState<"profile" | "password" | null>(null);

  async function onProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileMsg(null);
    setPending("profile");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: String(form.get("name") ?? "") }),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    setPending(null);
    setProfileMsg(
      res.ok
        ? { ok: true, text: "Profile updated." }
        : { ok: false, text: body.error ?? "Could not update profile." },
    );
  }

  async function onPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwMsg(null);
    setPending("password");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/me/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: String(form.get("currentPassword") ?? ""),
        password: String(form.get("password") ?? ""),
      }),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    setPending(null);
    if (res.ok) {
      (e.target as HTMLFormElement).reset();
      setPwMsg({ ok: true, text: "Password changed." });
    } else {
      setPwMsg({ ok: false, text: body.error ?? "Could not change password." });
    }
  }

  return (
    <Container>
      <div className="py-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">Account</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="max-w-xl space-y-6 pb-16">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onProfile} className="space-y-4">
              {profileMsg && (
                <Alert tone={profileMsg.ok ? "success" : "error"}>{profileMsg.text}</Alert>
              )}
              <FormField label="Name" name="name">
                <Input id="name" name="name" type="text" autoComplete="name" required minLength={2} />
              </FormField>
              <Button type="submit" disabled={pending === "profile"}>
                {pending === "profile" ? "Saving…" : "Save"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onPassword} className="space-y-4">
              {pwMsg && <Alert tone={pwMsg.ok ? "success" : "error"}>{pwMsg.text}</Alert>}
              <FormField label="Current password" name="currentPassword">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </FormField>
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
              <Button type="submit" disabled={pending === "password"}>
                {pending === "password" ? "Changing…" : "Change password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-smoke">
              See every signed-in session and revoke the ones you don&apos;t recognize.
            </p>
            <div className="mt-3">
              <Button variant="outline" href="/settings/sessions">
                Manage sessions
              </Button>
            </div>
            <p className="mt-4 text-sm text-smoke">
              <Link href="/api/auth/signout" className="underline underline-offset-4">
                Or sign out of this device
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
