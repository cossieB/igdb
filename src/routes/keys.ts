import { Hono } from "hono";
import { db } from "~/drizzle/db";
import { authenticatedMiddleware } from "~/middleware/authenticatedMiddleware";
import { auth } from "~/utils/auth";
import type { MyEnv } from "~/utils/types";

export const keyRoutes = new Hono<MyEnv>()

keyRoutes
    .use(authenticatedMiddleware)
    .post("/", async c => {

        const existing = await db.query.apikeys.findFirst({
            where: {
                referenceId: c.var.user.id
            }
        })
        if (existing) return c.json(existing)
        const obj = await auth.api.createApiKey({
            body: {
                configId: "user",
            },
            headers: c.req.raw.headers
        })
        return c.json(obj, 201)
    })
    .post("/admin", async c => {
        if (c.var.user.role != "admin")
            return c.text("Forbidden", 403)

        const obj = await auth.api.createApiKey({
            body: {
                configId: "admin",
            },
            headers: c.req.raw.headers
        })
        return c.json(obj, 201)
    })
