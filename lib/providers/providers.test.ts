import { describe, it, expect } from "vitest";
import { NullProvider } from "./index";
import { ProviderNotConfiguredError } from "./types";

describe("NullProvider", () => {
  it("is not configured", () => {
    expect(new NullProvider().isConfigured()).toBe(false);
  });
  it("launch throws ProviderNotConfiguredError with the exact message", async () => {
    await expect(
      new NullProvider().launch({ name: "x", plan: "creator", region: "sin" }),
    ).rejects.toThrow(ProviderNotConfiguredError);
    await expect(
      new NullProvider().launch({ name: "x", plan: "creator", region: "sin" }),
    ).rejects.toThrow("GPU provider not connected — join the waitlist to get early access.");
  });
  it("start/stop/terminate/getStatus throw too", async () => {
    const p = new NullProvider();
    await expect(p.getStatus("id")).rejects.toThrow(ProviderNotConfiguredError);
    await expect(p.start("id")).rejects.toThrow(ProviderNotConfiguredError);
    await expect(p.stop("id")).rejects.toThrow(ProviderNotConfiguredError);
    await expect(p.terminate("id")).rejects.toThrow(ProviderNotConfiguredError);
  });
  it("getGpuTypes throws ProviderNotConfiguredError with the exact message", async () => {
    await expect(new NullProvider().getGpuTypes()).rejects.toThrow(ProviderNotConfiguredError);
    await expect(new NullProvider().getGpuTypes()).rejects.toThrow(
      "GPU provider not connected — join the waitlist to get early access.",
    );
  });
});
