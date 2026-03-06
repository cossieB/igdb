import type { Context } from "hono"
import { auth } from "~/utils/auth"

export async function verifyApiKey(c: Context) {
    const key = c.req.header("x-api-key")

    if (!key) throw new Error(JSON.stringify({ error: { message: "No API Key" } }))
    const res = await auth.api.verifyApiKey({
        headers: c.req.raw.headers,
        body: {
            key,
            configId: "user",
        },
        request: c.req.raw,
    })
    if (res.error?.code == "RATE_LIMITED") {
        c.header("Rety-After", (res.error as any).details.tryAgainIn)
        throw new Error(JSON.stringify(res))
    }

    if (!res.valid) {
        throw new Error(JSON.stringify(res))
    }
    return res.key!
}