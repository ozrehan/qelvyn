import React from "react";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-paper hover:bg-charcoal",
  outline: "border border-ink/20 hover:border-ink",
  ghost: "underline underline-offset-4 decoration-ink/30 hover:decoration-ink",
};

const sizes: Record<ButtonSize, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  type = "button",
  disabled,
  className = "",
  children,
  onClick,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type} disabled={disabled} className={classes} onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}>
      {children}
    </button>
  );
}
