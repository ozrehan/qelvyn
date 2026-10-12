import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // Build-safe placeholder: construction (drizzle's parser registration,
    // adapter setup) never crashes; any actual query attempt throws a clear error.
    const throwMissing = (): never => {
      throw new Error("DATABASE_URL is not set");
    };
    const target = function () {};
    const proxy = new Proxy(target, {
      get: () => proxy,
      set: () => true,
      apply: throwMissing,
    });
    return proxy as unknown as ReturnType<typeof postgres>;
  }
  return postgres(url);
}

export const sql = createClient();
export const db = drizzle(sql, { schema });
