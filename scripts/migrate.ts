import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, sql } from "../lib/db";

async function main() {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations applied.");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
