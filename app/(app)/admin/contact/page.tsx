import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/schema";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { fmtDate } from "../../_components/status";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const rows = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt))
    .limit(500);

  return (
    <Container>
      <div className="py-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">Admin</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Contact messages ({rows.length})
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="py-6 text-center text-sm text-smoke">No contact messages yet.</p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {rows.map((r) => (
                <li key={r.id} className="py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">
                      {r.name} <span className="font-normal text-smoke">&lt;{r.email}&gt;</span>
                    </p>
                    <p className="text-xs text-smoke">
                      {r.topic} · {fmtDate(r.createdAt)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-smoke">{r.message}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <div className="pb-16" />
    </Container>
  );
}
