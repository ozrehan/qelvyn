import { NextRequest } from "next/server";
import { handlers } from "@/lib/auth";

// Next 16's RouteHandlerConfig rejects the direct `export { handlers as GET }`
// re-export, so route through thin typed wrappers that preserve the contract.
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> },
) {
  return (handlers as any).GET(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> },
) {
  return (handlers as any).POST(request, context);
}
