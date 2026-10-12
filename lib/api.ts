import { auth } from "./auth";
import { isAdminEmail } from "./admin";
import { allow } from "./ratelimit";

export type AuthedUser = {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
};

/** Returns the signed-in user, or a 401 Response to return directly. */
export async function requireUser(): Promise<AuthedUser | Response> {
  const session = await auth();
  const u = session?.user as any;
  if (!session?.user || !u?.id) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }
  return {
    id: u.id as string,
    email: (u.email ?? null) as string | null,
    name: (u.name ?? null) as string | null,
    role: (u.role ?? "user") as string,
  };
}

/** Returns the signed-in admin user, or a 401/403 Response to return directly. */
export async function requireAdmin(): Promise<AuthedUser | Response> {
  const result = await requireUser();
  if (result instanceof Response) return result;
  if (result.role !== "admin" && !isAdminEmail(result.email)) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }
  return result;
}

export function isAdminUser(user: AuthedUser): boolean {
  return user.role === "admin" || isAdminEmail(user.email);
}

/** Best-effort client key for rate limiting (writes only). */
export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || "unknown";
  return `rl:${ip}`;
}

/**
 * Rate-limit a write request. Returns a 429 Response when over the limit,
 * null when the request may proceed.
 */
export function rateLimited(
  req: Request,
  scope: string,
  limit: number,
  windowMs: number,
): Response | null {
  if (!allow(`${scope}:${clientKey(req)}`, limit, windowMs)) {
    return Response.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }
  return null;
}

/** Parse JSON body, returning null when the body is missing/invalid. */
export async function readJson(req: Request): Promise<unknown | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

/** Standard zod-failure response. */
export function invalid(error: { issues: Array<{ message: string }> }): Response {
  const first = error.issues[0]?.message ?? "Invalid request.";
  return Response.json({ error: first }, { status: 400 });
}
