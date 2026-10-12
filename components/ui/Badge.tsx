import React from "react";

type BadgeTone = "default" | "concept" | "success" | "warning" | "error";

const tones: Record<BadgeTone, string> = {
  default: "border border-ink/20 text-ink",
  concept: "border border-dashed border-smoke text-smoke uppercase text-[11px] tracking-widest",
  success: "border border-ink text-ink",
  warning: "border border-ink/40 text-ink",
  error: "bg-ink text-paper",
};

export function Badge({
  tone = "default",
  className = "",
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  const label = tone === "concept" ? "Concept" : children;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}>
      {label}
    </span>
  );
}
