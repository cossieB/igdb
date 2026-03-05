import { createMiddleware } from "hono/factory";
import { db } from "~/drizzle/db";
import type { MyEnv } from "~/utils/types";

export const setRateLimitHeaders = createMiddleware<MyEnv>(async (c, next) => {
    await next()
    const key = c.req.header("x-api-key")!
    const metadata = await db.query.apikeys.findFirst({where: {key}})
    if (metadata) {
        const remaining = (metadata.rateLimitMax ?? Infinity) - (metadata.requestCount ?? 0)
        c.header("X-RateLimit-Remaining", remaining.toString())
        c.header("X-RateLimit-Limit", metadata.rateLimitMax?.toString())
    }
})