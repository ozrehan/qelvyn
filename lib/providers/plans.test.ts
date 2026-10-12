import { describe, it, expect } from "vitest";
import { estimateCost, WORKSTATION_PLANS } from "./index";

describe("estimateCost", () => {
  it("computes creator cost", () => {
    expect(estimateCost("creator", 60)).toBe(60);
  });
  it("computes pro cost", () => {
    expect(estimateCost("pro", 60)).toBe(150);
  });
  it("computes studio cost", () => {
    expect(estimateCost("studio", 90)).toBe(360);
  });
  it("returns 0 for 0 minutes", () => {
    expect(estimateCost("creator", 0)).toBe(0);
  });
  it("throws on unknown plan", () => {
    expect(() => estimateCost("mega", 10)).toThrow("Unknown plan: mega");
  });
});

describe("WORKSTATION_PLANS", () => {
  it("has the three documented plans", () => {
    expect(WORKSTATION_PLANS.map((p) => p.id)).toEqual(["creator", "pro", "studio"]);
    const creator = WORKSTATION_PLANS[0];
    expect(creator.vcpu).toBe(8);
    expect(creator.ramGb).toBe(32);
    expect(creator.gpu).toBe("RTX 4000 Ada");
    expect(creator.storageGb).toBe(200);
    expect(creator.creditsPerMin).toBe(1);
  });
});
