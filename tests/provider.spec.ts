import { test, expect } from "@playwright/test";

// Assumes no RUNPOD_API_KEY in the environment (true in CI and local dev).

test("provider status reports not configured without a key", async ({ request }) => {
  const res = await request.get("/api/provider/status");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.provider).toBe("none");
  expect(body.configured).toBe(false);
});

test("gpu catalog returns 503 with the honest message when unconfigured", async ({
  request,
}) => {
  const res = await request.get("/api/provider/gpus");
  expect(res.status()).toBe(503);
  const body = await res.json();
  expect(body.error).toBe(
    "GPU provider not connected — join the waitlist to get early access.",
  );
});
