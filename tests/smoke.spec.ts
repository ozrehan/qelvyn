import { test, expect } from "@playwright/test";

test("health endpoint", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.status).toBe("ok");
});

test("homepage renders Qelvyn", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Qelvyn" })).toBeVisible();
});

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
});

test("waitlist page renders a form", async ({ page }) => {
  await page.goto("/waitlist");
  await expect(page.locator("form")).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
});
