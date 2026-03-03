import { createMiddleware } from "hono/factory";
import { auth } from "~/utils/auth";
import { type MyEnv } from "~/utils/types";

export function verifyApiKeyMware(configId: "user" | "admin" = "user") {
    return createMiddleware<MyEnv>(async (c, next) => {
        const key = c.req.header("x-api-key")
        if (!key) return c.json({ error: "No API Key" }, 401)
        const res = await auth.api.verifyApiKey({
            headers: c.req.raw.headers,
            body: {
                key,
                configId,
            },
            returnStatus: true,
            request: c.req.raw,
            
        })

        if (!res.response.valid) {
            return c.json(res, 403)
        }
        return next()
    })
}