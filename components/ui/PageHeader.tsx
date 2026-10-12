import React from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <header className={`py-12 ${className}`}>
      {eyebrow && (
        <p className="text-[11px] font-medium uppercase tracking-widest text-smoke">{eyebrow}</p>
      )}
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-lg text-smoke">{description}</p>}
    </header>
  );
}
