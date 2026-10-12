import { auth } from "@/lib/auth";
import { isAdminUser, type AuthedUser } from "@/lib/api";
import { Container } from "@/components/ui/Container";
import { Alert } from "@/components/ui/Alert";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const u = session?.user as any;
  const user: AuthedUser | null =
    u?.id != null
      ? { id: u.id as string, email: (u.email ?? null) as string | null, name: (u.name ?? null) as string | null, role: (u.role ?? "user") as string }
      : null;

  if (!user || !isAdminUser(user)) {
    return (
      <Container>
        <div className="py-24">
          <Alert tone="error" title="403 — Forbidden">
            You don&apos;t have access to the admin area.
          </Alert>
        </div>
      </Container>
    );
  }

  return <>{children}</>;
}
