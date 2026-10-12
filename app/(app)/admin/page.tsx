import Link from "next/link";
import { count } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, workstations, waitlist, usageEvents, contactMessages } from "@/lib/schema";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/admin/users", label: "Users", desc: "Every account on the platform." },
  { href: "/admin/workstations", label: "Workstations", desc: "All workstations and their owners." },
  { href: "/admin/audit", label: "Audit log", desc: "Every recorded action." },
  { href: "/admin/waitlist", label: "Waitlist", desc: "Early-access signups." },
  { href: "/admin/contact", label: "Contact messages", desc: "Messages from the contact form." },
];

export default async function AdminOverviewPage() {
  const [[u], [w], [wl], [cm], [ue]] = await Promise.all([
    db.select({ c: count() }).from(users),
    db.select({ c: count() }).from(workstations),
    db.select({ c: count() }).from(waitlist),
    db.select({ c: count() }).from(contactMessages),
    db.select({ c: count() }).from(usageEvents),
  ]);

  const stats = [
    { label: "Users", value: u.c },
    { label: "Workstations", value: w.c },
    { label: "Waitlist", value: wl.c },
    { label: "Contact messages", value: cm.c },
    { label: "Usage events", value: ue.c },
  ];

  return (
    <Container>
      <div className="py-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">Admin</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Overview</h1>
        <p className="mt-2 text-smoke">Real counts, straight from the database.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="py-6">
              <p className="text-[11px] uppercase tracking-widest text-smoke">{s.label}</p>
              <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 pb-16 md:grid-cols-2">
        {LINKS.map((l) => (
          <Card key={l.href}>
            <CardHeader>
              <CardTitle>{l.label}</CardTitle>
              <CardDescription>{l.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" href={l.href}>
                Open
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
