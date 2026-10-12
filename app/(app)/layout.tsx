import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { AppShell } from "@/components/ui/AppShell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const isAdmin =
    (session.user as any).role === "admin" || isAdminEmail(session.user.email ?? undefined);
  return (
    <AppShell
      user={{
        name: session.user.name,
        email: session.user.email,
        isAdmin,
      }}
    >
      {children}
    </AppShell>
  );
}
