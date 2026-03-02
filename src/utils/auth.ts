import { apiKey } from "@better-auth/api-key";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "cloudflare:workers";
import { db } from "~/drizzle/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        usePlural: true,
    }),
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_SECRET
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                input: false,
                required: true,
                defaultValue: "user"
            }
        }
    },
    plugins: [
        apiKey()
    ],
})