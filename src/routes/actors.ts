import {createRoute, z} from "@hono/zod-openapi";
import { db } from "~/drizzle/db";
import { ActorSelectSchema } from "~/drizzle/models";
import { createApp } from "~/utils/createApp";

export const actorRoutes = createApp()

const QuerySchema = z.object({
    cursor: z.coerce.number().optional(),
    limit: z.coerce.number().optional()
})

const actorList = createRoute({
    method: "get",
    path: "/",
    request: {
        query: QuerySchema
    },
    responses: {
        200: {
            description: "List of actors",
            content: {
                "application/json": {
                    schema: ActorSelectSchema.array()
                }
            }
        }
    }
})

actorRoutes.openapi(actorList, async c => {
    const actors = await db.query.actors.findMany({})
    return c.json(actors)
})