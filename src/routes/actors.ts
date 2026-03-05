import { createRoute, z } from "@hono/zod-openapi";
import { ActorSelectSchema, AppearanceSelectSchema, GameSelectSchema } from "~/drizzle/models";
import { createApp } from "~/utils/createApp";
import * as actorRepositiory from "~/repositories/actorsRepository"
import * as gamesRepository from "~/repositories/gamesRepository"
import * as appearanceRepository from "~/repositories/appearanceRepository"
import { ApiHeaderSchema, ErrorSchema, NumberIdSchema, QuerySchema } from "~/utils/schemas";
import { verifyApiKeyMware } from "~/middleware/verifyApiKey";
import { commonErrors } from "~/utils/commonErrors";
import { setRateLimitHeaders } from "~/middleware/setRateLimitHeaders";

export const actorRoutes = createApp()

actorRoutes.openapi(
    createRoute({
        tags: ["Actors"],
        method: "get",
        middleware: [verifyApiKeyMware(), setRateLimitHeaders],
        path: "/",
        request: {
            query: QuerySchema,
            headers: ApiHeaderSchema
        },
        responses: {
            ...commonErrors,
            200: {
                description: "List of actors",
                content: {
                    "application/json": {
                        schema: ActorSelectSchema.array()
                    },
                },
            }
        }
    }),
    async c => {
        const { cursor, limit } = c.req.valid('query')
        const actors = await actorRepositiory.findAll({ cursor, limit })
        return c.json(actors)
    })

actorRoutes.openapi(
    createRoute({
        tags: ["Actors", "Admin"],
        method: "post",
        middleware: [verifyApiKeyMware("admin"), setRateLimitHeaders],
        path: "/",
        description: "Admin-only route to add an actor.",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: z.object({
                            name: z.string(),
                            photo: z.string().optional(),
                            bio: z.string().default("")
                        })
                    }
                },
                required: true
            },
            headers: ApiHeaderSchema
        },
        responses: {
            ...commonErrors,
            201: {
                content: {
                    "application/json": {
                        schema: ActorSelectSchema
                    }
                },
                description: "The actor object"
            }
        },
    }),
    async c => {
        const body = c.req.valid('json')
        const actor = await actorRepositiory.createActor(body)
        return c.json(actor, 201)
    }
)

actorRoutes.openapi(
    createRoute({
        tags: ["Actors"],
        method: "get",
        middleware: [verifyApiKeyMware(), setRateLimitHeaders],
        path: "/{id}",
        request: {
            params: NumberIdSchema,
            headers: ApiHeaderSchema
        },
        responses: {
            ...commonErrors,
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
                        schema: ErrorSchema
                    }
                }
            }
        }
    }),
    async c => {
        const { id } = c.req.valid("param")
        const actor = await actorRepositiory.findById(id)
        if (!actor) return c.json({ error: {message: "No actor matches the given id"} }, 404)
        return c.json(actor, 200)
    }
)

actorRoutes.openapi(
    createRoute({
        tags: ["Actors", "Admin"],
        method: "patch",
        middleware: [verifyApiKeyMware("admin"), setRateLimitHeaders],
        path: "/{id}",
        description: "Admin-only route to update an actor.",
        request: {
            params: NumberIdSchema,
            headers: ApiHeaderSchema,
            body: {
                content: {
                    "application/json": {
                        schema: z.object({
                            name: z.string().optional(),
                            photo: z.url().optional(),
                            bio: z.string().optional()
                        }).openapi({ minProperties: 1 })
                    }
                },
                required: true
            }
        },
        responses: {
            ...commonErrors,
            200: {
                content: {
                    "application/json": {
                        schema: ActorSelectSchema
                    }
                },
                description: "The updated actor"
            },
            422: {
                content: {
                    'application/json': {
                        schema: ErrorSchema
                    }
                },
                description: "Error response if the request body is empty"
            },
            404: {
                content: {
                    "application/json": {
                        schema: z.object({ error: z.string() })
                    }
                },
                description: "No actor with given id found"
            }
        }
    }),
    async c => {
        const body = c.req.valid("json")
        const bodyEmpty = Object.keys(body).length === 0
        if (bodyEmpty)
            return c.json({
                error: {
                    message: "Empty request body"
                }
            }, 422)
        const { id } = c.req.valid("param")
        const actor = (await actorRepositiory.editActor(id, body)).at(0)
        if (!actor) return c.json({ error: "Actor not found" }, 404)
        return c.json(actor, 200)
    }
)

actorRoutes.openapi(
    createRoute({
        tags: ["Actors", "Admin"],
        method: "delete",
        middleware: [verifyApiKeyMware("admin"), setRateLimitHeaders],
        path: "/{id}",
        description: "Admin-only route to delete an actor",
        request: {
            params: NumberIdSchema,
            headers: ApiHeaderSchema
        },
        responses: {
            ...commonErrors,
            200: {
                content: {
                    "application/json": {
                        schema: z.object({ id: z.number() })
                    }
                },
                description: "Id of deleted actor"
            },
            404: {
                content: {
                    "application/json": {
                        schema: ErrorSchema
                    }
                },
                description: "No actor exists with the given id"
            },
        }
    }),
    async c => {
        const { id } = c.req.valid('param');
        const deleted = await actorRepositiory.deleteActor(id);
        if (!deleted)
            return c.json({ error: { message: "Actor not found" } }, 404)
        return c.json({ id }, 200)
    }
)

actorRoutes.openapi(
    createRoute({
        tags: ["Actors", "Games"],
        path: "/{id}/games",
        method: "get",
        middleware: [verifyApiKeyMware(), setRateLimitHeaders],
        request: {
            params: NumberIdSchema,
            query: QuerySchema,
            headers: ApiHeaderSchema
        },
        responses: {
            ...commonErrors,
            200: {
                content: {
                    "application/json": {
                        schema: GameSelectSchema.array()
                    }
                },
                description: "List of games starring this actor"
            }
        }
    }),
    async c => {
        const actorId = c.req.valid('param').id;
        const { limit, cursor } = c.req.valid('query');
        console.log(actorId, limit, cursor)
        const games = await gamesRepository.findAll({ actorId, limit, cursor })
        return c.json(games)
    }
)

actorRoutes.openapi(
    createRoute({
        path: "/{id}/roles",
        method: "get",
        middleware: [verifyApiKeyMware(), setRateLimitHeaders],
        tags: ["Actors"],
        request: {
            params: NumberIdSchema,
            query: QuerySchema,
            headers: ApiHeaderSchema
        },
        responses: {
            ...commonErrors,            
            200: {
                content: {
                    "application/json": {
                        schema: AppearanceSelectSchema.array()
                    }
                },
                description: "The actor's roles"
            }
        }
    }),
    async c => {
        const actorId = c.req.valid('param').id;
        const { limit, cursor } = c.req.valid('query')
        const appearances = await appearanceRepository.findAll({ actorId, limit, cursor })
        return c.json(appearances, 200)
    }
)