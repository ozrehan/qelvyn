import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { db } from "./db";
import { users, userSessions } from "./schema";
import { isAdminEmail } from "./admin";
import { logAudit } from "./audit";

const SESSION_DAYS = 30;

async function clientInfo(): Promise<{ ip: string | null; ua: string | null }> {
  try {
    const h = await headers();
    const fwd = h.get("x-forwarded-for");
    return {
      ip: fwd?.split(",")[0]?.trim() ?? null,
      ua: h.get("user-agent"),
    };
  } catch {
    return { ip: null, ua: null };
  }
}

/**
 * JWT session strategy.
 *
 * Auth.js explicitly rejects the Credentials provider with the database
 * session strategy ("Signing in with credentials only supported if JWT
 * strategy is enabled"), so sessions live in the signed JWT while every
 * login is ALSO recorded in the user_sessions table. That table powers
 * Settings → Sessions and real revocation: the jwt callback checks the
 * row on every use and drops revoked/expired sessions.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db) as any,
  trustHost: true,
  session: { strategy: "jwt", maxAge: SESSION_DAYS * 24 * 60 * 60 },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (creds) => {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(1) })
          .safeParse(creds);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        // First-class admin promotion: an ADMIN_EMAILS address that signs in
        // with credentials becomes an admin on first successful login.
        if (isAdminEmail(user.email) && user.role !== "admin") {
          await db.update(users).set({ role: "admin" }).where(eq(users.id, user.id));
          user.role = "admin";
        }
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Fresh sign-in: record the login session in the database.
        const u = user as any;
        const { ip, ua } = await clientInfo();
        const [row] = await db
          .insert(userSessions)
          .values({
            userId: u.id,
            expiresAt: new Date(Date.now() + SESSION_DAYS * 24 * 3600 * 1000),
            ipAddress: ip,
            userAgent: ua,
          })
          .returning({ id: userSessions.id });
        await logAudit({
          actorId: u.id,
          action: "auth.login",
          targetType: "user_sessions",
          targetId: row.id,
        });
        (token as any).sessionId = row.id;
        (token as any).id = u.id;
        (token as any).role = u.role ?? "user";
        return token;
      }
      // Every subsequent use: enforce revocation/expiry from the database.
      const sessionId = (token as any)?.sessionId as string | undefined;
      if (sessionId) {
        try {
          const rows = await db
            .select()
            .from(userSessions)
            .where(eq(userSessions.id, sessionId))
            .limit(1);
          const s = rows[0];
          if (!s || s.revokedAt || s.expiresAt <= new Date()) return null as any;
          if (Date.now() - s.lastSeenAt.getTime() > 5 * 60 * 1000) {
            await db
              .update(userSessions)
              .set({ lastSeenAt: new Date() })
              .where(eq(userSessions.id, sessionId));
          }
        } catch {
          // If the session store is unreachable (e.g. edge runtime without
          // DB access), fail open for the check itself — the signed JWT
          // remains the source of truth. Never break auth on a lookup error.
        }
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).id = (token as any).id;
      (session.user as any).role = (token as any).role ?? "user";
      (session.user as any).sessionId = (token as any).sessionId;
      return session;
    },
  },
  events: {
    async signOut(message: any) {
      try {
        const sessionId = message?.token?.sessionId as string | undefined;
        if (sessionId) {
          await db
            .update(userSessions)
            .set({ revokedAt: new Date() })
            .where(eq(userSessions.id, sessionId));
        }
      } catch {
        // best effort
      }
    },
  },
});
