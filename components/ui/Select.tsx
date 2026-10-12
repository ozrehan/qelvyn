import React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className = "", children, ...rest }: SelectProps) {
  return (
    <select
      className={`w-full border border-ink/20 bg-paper px-3 py-2 text-sm text-ink focus:border-ink disabled:opacity-50 ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}
