// The AppShell admin nav links to /admin/audit-logs; the canonical page lives
// at /admin/audit. This alias renders the same table so the nav never 404s.
import AdminAuditPage from "../audit/page";

export const dynamic = "force-dynamic";

export default function AdminAuditLogsAliasPage() {
  return <AdminAuditPage />;
}
