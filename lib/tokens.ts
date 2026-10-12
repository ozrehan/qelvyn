import { randomBytes, createHash } from "crypto";

export function newToken(): string {
  return randomBytes(32).toString("hex");
}

export function sha256(str: string): string {
  return createHash("sha256").update(str).digest("hex");
}
