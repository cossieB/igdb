import { createMiddleware } from "hono/factory";
import { auth } from "~/utils/auth";
import { type MyEnv } from "~/utils/types";

export function verifyApiKeyMware(configId: "user" | "admin" = "user") {
    return createMiddleware<MyEnv>(async (c, next) => {
        const key = c.req.header("x-api-key")
        if (!key) return c.json({ error: {message: "No API Key"} }, 401)
        const res = await auth.api.verifyApiKey({
            headers: c.req.raw.headers,
            body: {
                key,
                configId,
            },
            request: c.req.raw,
            
        })
        if (res.error?.code == "RATE_LIMITED") {
            c.header("Rety-After", (res.error as any).details.tryAgainIn)
            return c.json(res, 429)
        }
            
        if (!res.valid) {
            return c.json(res, 403)
        }
        return next()
    })
}