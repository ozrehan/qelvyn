import React from "react";
import { Label } from "./Label";

export function FormField({
  label,
  name,
  error,
  hint,
  children,
  className = "",
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p role="alert" className="mt-1.5 text-sm text-ink">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-smoke">{hint}</p>
      ) : null}
    </div>
  );
}
