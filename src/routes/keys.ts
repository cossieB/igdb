import { Hono } from "hono";
import { db } from "~/drizzle/db";
import { authenticatedMiddleware } from "~/middleware/authenticatedMiddleware";
import { auth } from "~/utils/auth";
import type { MyEnv } from "~/utils/types";

export const keyRoutes = new Hono<MyEnv>()

keyRoutes
    .use(authenticatedMiddleware)
    .post("/", async c => {
        
        const key = await db.query.apikeys.findFirst({
            where: {
                referenceId: c.var.user.id
            }
        })
        if (key) return c.json({key: key.key})
        const obj = await auth.api.createApiKey({
            body: {
                configId: "user"
            },
            headers: c.req.raw.headers
        })
        return c.json({key: obj.key}, 201)
    })