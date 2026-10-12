import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "./schema";
import { isAdminEmail } from "./admin";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db) as any,
  trustHost: true,
  session: { strategy: "database" },
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
    async session({ session, user }) {
      (session.user as any).id = user.id;
      (session.user as any).role = (user as any).role ?? "user";
      return session;
    },
  },
});
