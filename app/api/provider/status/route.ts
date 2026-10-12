import { getProvider } from "@/lib/providers";

export const dynamic = "force-dynamic";

export async function GET() {
  const provider = getProvider();
  const configured = provider.isConfigured();
  return Response.json({
    provider: provider.name as "runpod" | "none",
    configured,
    message: configured
      ? "GPU provider is connected and ready."
      : "GPU provider not connected — join the waitlist to get early access.",
  });
}
