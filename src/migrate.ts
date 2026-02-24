import db from "@db/db.client";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";


async function bootstrap() {
  console.log("Running migrations...");

  await migrate(db, {
    migrationsFolder: path.resolve(__dirname, 'migrations'),
  });
  console.log("Migrations finished");
}

bootstrap();