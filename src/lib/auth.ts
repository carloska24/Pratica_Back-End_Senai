import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "./db";
import * as schema from "./db/schema";

const database = db
  ? drizzleAdapter(db, { provider: "pg", schema })
  : undefined;

export const auth = betterAuth({
  ...(database ? { database } : {}),
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET ?? "development-only-secret-change-me-32-chars",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});
