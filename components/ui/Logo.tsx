export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      className={className}
      aria-label="Qelvyn logo"
      role="img"
    >
      <rect x="4" y="4" width="17" height="17" />
      <rect x="11" y="11" width="17" height="17" />
    </svg>
  );
}
