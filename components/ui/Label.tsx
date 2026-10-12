import React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className = "", children, ...rest }: LabelProps) {
  return (
    <label className={`block text-sm font-medium text-ink ${className}`} {...rest}>
      {children}
    </label>
  );
}
