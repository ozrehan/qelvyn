import { Badge } from "@/components/ui/Badge";

const toneFor: Record<string, "default" | "success" | "warning" | "error"> = {
  pending: "default",
  provisioning: "warning",
  running: "success",
  stopped: "default",
  terminated: "error",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={toneFor[status] ?? "default"}>{status}</Badge>;
}

export function fmtDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
