import React from "react";

type AlertTone = "error" | "success" | "info";

const tones: Record<AlertTone, string> = {
  error: "border-ink bg-ink text-paper",
  success: "border-ink/20 text-ink",
  info: "border-ink/20 text-ink",
};

export function Alert({
  tone,
  title,
  className = "",
  children,
}: {
  tone: AlertTone;
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="alert" className={`border px-4 py-3 ${tones[tone]} ${className}`}>
      {title && <p className="font-medium">{title}</p>}
      <div className="text-sm">{children}</div>
    </div>
  );
}
