export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
}

export function verificationLink(token: string): string {
  return `${siteUrl()}/verify-email?token=${token}`;
}

export function resetLink(token: string): string {
  return `${siteUrl()}/reset-password?token=${token}`;
}
