import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className = "", ...rest }: TextareaProps) {
  return (
    <textarea
      className={`w-full border border-ink/20 bg-paper px-3 py-2 text-sm text-ink placeholder:text-smoke/70 focus:border-ink disabled:opacity-50 ${className}`}
      {...rest}
    />
  );
}
