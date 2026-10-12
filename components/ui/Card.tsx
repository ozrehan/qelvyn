import React from "react";

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`border border-ink/10 bg-paper ${className}`}>{children}</div>;
}

export function CardHeader({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`border-b border-ink/10 px-6 py-4 ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={`font-display text-lg font-semibold tracking-tight ${className}`}>{children}</h3>;
}

export function CardDescription({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <p className={`mt-1 text-sm text-smoke ${className}`}>{children}</p>;
}

export function CardContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`border-t border-ink/10 px-6 py-4 ${className}`}>{children}</div>;
}
