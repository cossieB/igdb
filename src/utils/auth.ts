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
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_SECRET
        }
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
        apiKey([
            {
                configId: "user",
                defaultPrefix: "uk_",
                rateLimit: {
                    enabled: true,
                    maxRequests: 50,
                },                
                references: "user",
                disableKeyHashing: true,
            },
            {
                configId: "admin",
                defaultPrefix: "ak_",
                rateLimit: {
                    enabled: false
                },
                keyExpiration: {
                    defaultExpiresIn: 1000*60*5
                },                
                references: "user",
            },])
    ],
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 15,
        },
    },
    secondaryStorage: {
        delete(key) {
            return env.KV.delete(key)
        },
        get(key) {
            return env.KV.get(key, "json")
        },
        set(key, value, ttl) {
            return env.KV.put(key, value, {expirationTtl: ttl})
        },
    },
    advanced: {
        ipAddress: {
            ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for"]
        },        
    },
    disabledPaths: ["/api-key/*"]
})