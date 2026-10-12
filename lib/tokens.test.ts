import { describe, it, expect } from "vitest";
import { newToken, sha256 } from "./tokens";

describe("tokens", () => {
  it("sha256 is deterministic", () => {
    expect(sha256("hello")).toBe(sha256("hello"));
    expect(sha256("hello")).toBe(
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    );
  });
  it("newToken returns 64 hex chars", () => {
    const t = newToken();
    expect(t).toHaveLength(64);
    expect(t).toMatch(/^[0-9a-f]{64}$/);
  });
  it("newToken is unique", () => {
    expect(newToken()).not.toBe(newToken());
  });
});
