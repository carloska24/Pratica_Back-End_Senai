import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

export const db = databaseUrl
  ? drizzle(neon(databaseUrl), { schema })
  : null;
