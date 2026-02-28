import { createRoute, z } from "@hono/zod-openapi";
import { ActorInsertSchema, ActorSelectSchema } from "~/drizzle/models";
import { createApp } from "~/utils/createApp";
import * as actorRepositiory from "~/repositories/actor"

export const actorRoutes = createApp()

const QuerySchema = z.object({
    cursor: z.coerce.number().int().optional(),
    limit: z.coerce.number().int().min(1).optional().default(10).transform(num => num > 50 ? 50 : num).openapi({
        maximum: 50
    })
})

actorRoutes.openapi(
    createRoute({
        tags: ["Actors"],
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
    }),
    async c => {
        const { cursor, limit } = c.req.valid('query')
        const actors = await actorRepositiory.findAll(cursor, limit)
        return c.json(actors)
    })

actorRoutes.openapi(
    createRoute({
        tags: ["Actors"],
        method: "get",
        path: "/{id}",
        request: {
            params: z.object({
                id: z.coerce.number()
            })
        },
        responses: {
            200: {
                description: "Actor",
                content: {
                    "application/json": {
                        schema: ActorSelectSchema
                    }
                }
            },
            404: {
                description: "No actor matches the given id",
                content: {
                    "application/json": {
                        schema: z.object({ error: z.string() })
                    }
                }
            }
        }
    }),
    async c => {
        const { id } = c.req.valid("param")
        const actor = await actorRepositiory.findById(id)
        if (!actor) return c.json({ error: "No actor matches the given id" }, 404)
        return c.json(actor, 200)
    }
)

actorRoutes.openapi(
    createRoute({
        tags: ["Actors"],
        method: "post",
        path: "/",
        description: "Route to add an actor to the database. This is an admin-only route.",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: z.object({
                            name: z.string(),
                            photo: z.url().optional(),
                            bio: z.string().default("")
                        })
                    }
                }                
            }
        },
        responses: {
            201: {
                content: {
                    "application/json": {
                        schema: ActorSelectSchema
                    }
                },
                description: "The actor object with extra database"
            }
        },
    }),
    async c => {
        const body = c.req.valid('json')
        const actor = await actorRepositiory.createActor(body)
        return c.json(actor, 201)
    }
)