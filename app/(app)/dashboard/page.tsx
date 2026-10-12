import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { workstations, usageEvents } from "@/lib/schema";
import { eq, and, gte, count, sql } from "drizzle-orm";
import { getProvider } from "@/lib/providers";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user as any;
  const userId = user.id as string;

  const [[total], [running]] = await Promise.all([
    db.select({ c: count() }).from(workstations).where(eq(workstations.userId, userId)),
    db
      .select({ c: count() })
      .from(workstations)
      .where(and(eq(workstations.userId, userId), eq(workstations.status, "running"))),
  ]);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const [credits] = await db
    .select({ c: sql<number>`coalesce(sum(${usageEvents.credits}), 0)` })
    .from(usageEvents)
    .where(and(eq(usageEvents.userId, userId), gte(usageEvents.createdAt, monthStart)));

  const provider = getProvider();
  const providerConfigured = provider.isConfigured();

  const cards = [
    { label: "My workstations", value: String(total.c) },
    { label: "Running now", value: String(running.c) },
    { label: "Credits used this month", value: String(Number(credits.c)) },
  ];

  return (
    <Container>
      <div className="flex flex-wrap items-end justify-between gap-4 py-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">Overview</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            Welcome{user?.name ? `, ${user.name}` : ""}
          </h1>
        </div>
        <Button href="/workstations/new">New workstation</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="py-6">
              <p className="text-[11px] uppercase tracking-widest text-smoke">{c.label}</p>
              <p className="mt-2 font-display text-3xl font-bold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardContent className="py-6">
            <p className="text-[11px] uppercase tracking-widest text-smoke">GPU provider</p>
            <p className="mt-2">
              <Badge tone={providerConfigured ? "success" : "warning"}>
                {providerConfigured ? "Connected" : "Not connected"}
              </Badge>
            </p>
            <p className="mt-2 text-xs text-smoke">
              {providerConfigured
                ? "Live GPU provisioning is available."
                : "Join the waitlist to get early access."}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Things you can do right now.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button href="/workstations/new">New workstation</Button>
            <Button variant="outline" href="/workstations">
              View workstations
            </Button>
            <Button variant="outline" href="/usage">
              View usage
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Getting started</CardTitle>
          </CardHeader>
          <CardContent>
            {total.c === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-smoke">
                  You don&apos;t have any workstations yet. Create one, launch it when
                  you&apos;re ready, and connect over Moonlight.
                </p>
                <Button href="/workstations/new">Create your first workstation</Button>
              </div>
            ) : (
              <p className="text-sm text-smoke">
                You have {total.c} workstation{total.c === 1 ? "" : "s"}.{" "}
                <Link href="/workstations" className="underline underline-offset-4">
                  Manage them
                </Link>
                .
              </p>
            )}
            {!providerConfigured && (
              <Alert tone="info" title="GPU provider not connected" className="mt-4">
                Workstations can be created and saved, but launching one needs a connected
                GPU provider.{" "}
                <Link href="/waitlist" className="underline underline-offset-4">
                  Join the waitlist
                </Link>{" "}
                to get early access.
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
