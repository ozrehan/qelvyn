import { GpuProvider, PlanSpec, GpuType, ProviderNotConfiguredError } from "./types";
import { RunPodProvider } from "./runpod";

export class NullProvider implements GpuProvider {
  name = "none";
  isConfigured(): boolean {
    return false;
  }
  async launch(_input: { name: string; plan: string; region: string }): Promise<{ providerId: string; ipAddress?: string }> {
    throw new ProviderNotConfiguredError();
  }
  async getStatus(_providerId: string): Promise<{ status: string; ipAddress?: string }> {
    throw new ProviderNotConfiguredError();
  }
  async start(_providerId: string): Promise<void> {
    throw new ProviderNotConfiguredError();
  }
  async stop(_providerId: string): Promise<void> {
    throw new ProviderNotConfiguredError();
  }
  async terminate(_providerId: string): Promise<void> {
    throw new ProviderNotConfiguredError();
  }
  async getGpuTypes(): Promise<GpuType[]> {
    throw new ProviderNotConfiguredError();
  }
}

export function getProvider(): GpuProvider {
  return process.env.RUNPOD_API_KEY ? new RunPodProvider() : new NullProvider();
}

export const WORKSTATION_PLANS: PlanSpec[] = [
  {
    id: "creator",
    name: "Creator",
    vcpu: 8,
    ramGb: 32,
    gpu: "RTX 4000 Ada",
    storageGb: 200,
    creditsPerMin: 1,
  },
  {
    id: "pro",
    name: "Pro",
    vcpu: 16,
    ramGb: 64,
    gpu: "RTX 6000 Ada",
    storageGb: 500,
    creditsPerMin: 2.5,
  },
  {
    id: "studio",
    name: "Studio",
    vcpu: 32,
    ramGb: 128,
    gpu: "2× RTX 6000 Ada",
    storageGb: 1024,
    creditsPerMin: 4,
  },
];

export function estimateCost(planId: string, minutes: number): number {
  const plan = WORKSTATION_PLANS.find((p) => p.id === planId);
  if (!plan) throw new Error(`Unknown plan: ${planId}`);
  return plan.creditsPerMin * minutes;
}
