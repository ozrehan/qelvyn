import {
  GpuProvider,
  GpuType,
  ProviderNotConfiguredError,
} from "./types";

// Verified 2026-10-13: api.runpod.ai/graphql returns 404 — the real
// RunPod GraphQL control plane is api.runpod.io/graphql.
const API_URL = "https://api.runpod.io/graphql";

export class RunPodProvider implements GpuProvider {
  name = "runpod";

  isConfigured(): boolean {
    return !!process.env.RUNPOD_API_KEY;
  }

  private check(): void {
    if (!this.isConfigured()) throw new ProviderNotConfiguredError();
  }

  private async graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
    this.check();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RUNPOD_API_KEY}`,
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = (await res.json()) as {
      data?: T;
      errors?: Array<{ message: string }>;
    };
    if (json.errors?.length) {
      throw new Error(json.errors.map((e) => e.message).join("; "));
    }
    if (!json.data) throw new Error("RunPod returned an empty response");
    return json.data;
  }

  async launch(input: {
    name: string;
    plan: string;
    region: string;
  }): Promise<{ providerId: string; ipAddress?: string }> {
    this.check();
    const data = await this.graphql<{
      podFindAndDeployOnDemand: { id: string; publicIp?: string | null };
    }>(
      `mutation($input: PodFindAndDeployOnDemandInput!) {
        podFindAndDeployOnDemand(input: $input) { id publicIp }
      }`,
      {
        input: {
          name: input.name,
          imageName: "qelvyn/workstation:latest",
          cloudType: "SECURE",
          dataCenterId: input.region,
          templateId: process.env.RUNPOD_TEMPLATE_ID ?? undefined,
          gpuTypeId: process.env.RUNPOD_GPU_TYPE_ID ?? undefined,
        },
      },
    );
    return {
      providerId: data.podFindAndDeployOnDemand.id,
      ipAddress: data.podFindAndDeployOnDemand.publicIp ?? undefined,
    };
  }

  async getStatus(providerId: string): Promise<{ status: string; ipAddress?: string }> {
    this.check();
    const data = await this.graphql<{
      pod: { id: string; desiredStatus: string; publicIp?: string | null };
    }>(
      `query($podId: String!) {
        pod(input: { podId: $podId }) { id desiredStatus publicIp }
      }`,
      { podId: providerId },
    );
    return {
      status: data.pod.desiredStatus,
      ipAddress: data.pod.publicIp ?? undefined,
    };
  }

  async start(providerId: string): Promise<void> {
    this.check();
    await this.graphql(`mutation($podId: String!) { podStart(input: { podId: $podId }) { id } }`, {
      podId: providerId,
    });
  }

  async stop(providerId: string): Promise<void> {
    this.check();
    await this.graphql(`mutation($podId: String!) { podStop(input: { podId: $podId }) { id } }`, {
      podId: providerId,
    });
  }

  async terminate(providerId: string): Promise<void> {
    this.check();
    await this.graphql(
      `mutation($podId: String!) { podTerminate(input: { podId: $podId }) }`,
      { podId: providerId },
    );
  }

  // Read-only: lists the GPU types RunPod currently offers. No pods,
  // no spend — safe to call for catalog/pricing display.
  async getGpuTypes(): Promise<GpuType[]> {
    this.check();
    const data = await this.graphql<{
      gpuTypes: Array<{ id: string; displayName: string; memoryInGb: number }>;
    }>(
      `query {
        gpuTypes { id displayName memoryInGb }
      }`,
      {},
    );
    return data.gpuTypes;
  }
}
