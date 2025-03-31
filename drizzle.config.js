import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
  schema: "./src/db/schema.js",
  out: './src/db/migrations',
  dialect: "postgresql",
  migrationsFolder: './src/db/migrations',
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL,
  },
});
