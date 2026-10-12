import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./passwords";

describe("passwords", () => {
  it("hash then verify returns true", async () => {
    const hash = await hashPassword("secret123");
    expect(await verifyPassword("secret123", hash)).toBe(true);
  });
  it("wrong password returns false", async () => {
    const hash = await hashPassword("secret123");
    expect(await verifyPassword("wrong456", hash)).toBe(false);
  });
});
