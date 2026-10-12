export interface GpuType {
  id: string;
  displayName: string;
  memoryInGb: number;
}

export interface GpuProvider {
  name: string;
  isConfigured(): boolean;
  launch(input: {
    name: string;
    plan: string;
    region: string;
  }): Promise<{ providerId: string; ipAddress?: string }>;
  getStatus(providerId: string): Promise<{ status: string; ipAddress?: string }>;
  start(providerId: string): Promise<void>;
  stop(providerId: string): Promise<void>;
  terminate(providerId: string): Promise<void>;
  getGpuTypes(): Promise<GpuType[]>;
}

export class ProviderNotConfiguredError extends Error {
  constructor() {
    super("GPU provider not connected — join the waitlist to get early access.");
    this.name = "ProviderNotConfiguredError";
  }
}

export interface PlanSpec {
  id: "creator" | "pro" | "studio";
  name: string;
  vcpu: number;
  ramGb: number;
  gpu: string;
  storageGb: number;
  creditsPerMin: number;
}
