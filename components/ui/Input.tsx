import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...rest }: InputProps) {
  return (
    <input
      className={`w-full border border-ink/20 bg-paper px-3 py-2 text-sm text-ink placeholder:text-smoke/70 focus:border-ink disabled:opacity-50 ${className}`}
      {...rest}
    />
  );
}
