import { describe, it, expect } from "vitest";
import {
  signupSchema,
  loginSchema,
  waitlistSchema,
  workstationCreateSchema,
  forgotSchema,
  resetSchema,
  settingsSchema,
  contactSchema,
  passwordChangeSchema,
} from "./validators";

describe("signupSchema", () => {
  it("accepts a valid signup", () => {
    const r = signupSchema.safeParse({
      name: "Rehan",
      email: "rehan@example.com",
      password: "secret123",
    });
    expect(r.success).toBe(true);
  });
  it("rejects a short name", () => {
    expect(signupSchema.safeParse({ name: "A", email: "a@b.com", password: "secret123" }).success).toBe(false);
  });
  it("rejects an invalid email", () => {
    expect(signupSchema.safeParse({ name: "Rehan", email: "nope", password: "secret123" }).success).toBe(false);
  });
  it("rejects a password without a number", () => {
    expect(signupSchema.safeParse({ name: "Rehan", email: "r@e.com", password: "password" }).success).toBe(false);
  });
  it("rejects a password without a letter", () => {
    expect(signupSchema.safeParse({ name: "Rehan", email: "r@e.com", password: "12345678" }).success).toBe(false);
  });
  it("rejects a short password", () => {
    expect(signupSchema.safeParse({ name: "Rehan", email: "r@e.com", password: "ab12" }).success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid credentials shape", () => {
    expect(loginSchema.safeParse({ email: "r@e.com", password: "x" }).success).toBe(true);
  });
  it("rejects an invalid email", () => {
    expect(loginSchema.safeParse({ email: "nope", password: "x" }).success).toBe(false);
  });
  it("rejects an empty password", () => {
    expect(loginSchema.safeParse({ email: "r@e.com", password: "" }).success).toBe(false);
  });
});

describe("waitlistSchema", () => {
  it("accepts email only", () => {
    expect(waitlistSchema.safeParse({ email: "r@e.com" }).success).toBe(true);
  });
  it("accepts all fields", () => {
    expect(
      waitlistSchema.safeParse({ email: "r@e.com", name: "Rehan", useCase: "video editing" }).success,
    ).toBe(true);
  });
  it("rejects an invalid email", () => {
    expect(waitlistSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});

describe("workstationCreateSchema", () => {
  it("accepts a valid workstation", () => {
    const r = workstationCreateSchema.safeParse({ name: "Edit box", plan: "pro" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.region).toBe("sin");
  });
  it("rejects a short name", () => {
    expect(workstationCreateSchema.safeParse({ name: "x", plan: "pro" }).success).toBe(false);
  });
  it("rejects a name over 40 chars", () => {
    expect(workstationCreateSchema.safeParse({ name: "x".repeat(41), plan: "pro" }).success).toBe(false);
  });
  it("rejects an unknown plan", () => {
    expect(workstationCreateSchema.safeParse({ name: "Edit box", plan: "mega" }).success).toBe(false);
  });
});

describe("forgotSchema", () => {
  it("accepts a valid email", () => {
    expect(forgotSchema.safeParse({ email: "r@e.com" }).success).toBe(true);
  });
  it("rejects an invalid email", () => {
    expect(forgotSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});

describe("resetSchema", () => {
  it("accepts a valid token + password", () => {
    expect(resetSchema.safeParse({ token: "abc", password: "secret123" }).success).toBe(true);
  });
  it("rejects a missing token", () => {
    expect(resetSchema.safeParse({ token: "", password: "secret123" }).success).toBe(false);
  });
  it("rejects a weak password", () => {
    expect(resetSchema.safeParse({ token: "abc", password: "short" }).success).toBe(false);
  });
});

describe("settingsSchema", () => {
  it("accepts a valid name", () => {
    expect(settingsSchema.safeParse({ name: "Rehan" }).success).toBe(true);
  });
  it("rejects a short name", () => {
    expect(settingsSchema.safeParse({ name: "x" }).success).toBe(false);
  });
});

describe("contactSchema", () => {
  it("accepts a valid message with defaults", () => {
    const r = contactSchema.safeParse({
      name: "Rehan",
      email: "r@e.com",
      message: "Hello, I have a question about pricing.",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.topic).toBe("general");
  });
  it("rejects a short name", () => {
    expect(
      contactSchema.safeParse({ name: "x", email: "r@e.com", message: "Hello there friend" }).success,
    ).toBe(false);
  });
  it("rejects an invalid email", () => {
    expect(
      contactSchema.safeParse({ name: "Rehan", email: "nope", message: "Hello there friend" }).success,
    ).toBe(false);
  });
  it("rejects a message under 10 chars", () => {
    expect(
      contactSchema.safeParse({ name: "Rehan", email: "r@e.com", message: "Hi" }).success,
    ).toBe(false);
  });
});

describe("passwordChangeSchema", () => {
  it("accepts a valid change", () => {
    expect(
      passwordChangeSchema.safeParse({ currentPassword: "old12345", password: "new12345" }).success,
    ).toBe(true);
  });
  it("rejects an empty current password", () => {
    expect(
      passwordChangeSchema.safeParse({ currentPassword: "", password: "new12345" }).success,
    ).toBe(false);
  });
  it("rejects a weak new password", () => {
    expect(
      passwordChangeSchema.safeParse({ currentPassword: "old12345", password: "short" }).success,
    ).toBe(false);
  });
});
