import { createRoute, z } from "@hono/zod-openapi";
import { PlatformInsertSchema, PlatformSelectSchema, GameSelectSchema } from "~/drizzle/models";
import { createApp } from "~/utils/createApp";
import { ErrorSchema, QuerySchema } from "~/utils/schemas";
import * as platformRepository from "~/repositories/platformRepository"
import * as gamesRepository from "~/repositories/gamesRepository"

export const platformRoutes = createApp()

platformRoutes.openapi(
    createRoute({
        tags: ["Platforms"],
        method: "get",
        path: "/",
        request: {
            query: QuerySchema
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: PlatformSelectSchema.array()
                    }
                },
                description: "List of platforms"
            }
        }
    }),
    async c => {
        const { limit, cursor } = c.req.valid('query')
        const devs = await platformRepository.findAll({ limit, cursor })
        return c.json(devs, 200)
    }
)

platformRoutes.openapi(
    createRoute({
        tags: ["Platforms", "Admin"],
        method: "post",
        path: "/",
        description: "Admin-only route to add a platform",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: PlatformInsertSchema
                    },
                }
            }
        },
        responses: {
            201: {
                content: {
                    "application/json": {
                        schema: PlatformSelectSchema
                    }
                },
                description: "The created platform"
            }
        },
    }),
    async c => {
        const body = c.req.valid("json")
        const dev = await platformRepository.createPlatform(body);
        return c.json(dev, 201)
    }
)

platformRoutes.openapi(
    createRoute({
        tags: ["Platforms"],
        method: "get",
        path: "/{id}",
        request: {
            params: z.object({
                id: z.coerce.number()
            })
        },
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: PlatformSelectSchema
                    }
                },
                description: "List of platforms"
            },
            404: {
                content: {
                    "application/json": {
                        schema: ErrorSchema
                    }
                },
                description: "Platform not found"
            }
        }
    }),
    async c => {
        const { id } = c.req.valid("param")
        const dev = await platformRepository.findById(id)
        if (!dev) return c.json({ error: "Platform not found" }, 404)
        return c.json(dev, 200)
    }
)

platformRoutes.openapi(
    createRoute({
        tags: ["Platforms", "Admin"],
        method: "put",
        path: "/{id}",
        description: "Admin-only route to update a platform",        
        request: {
            params: z.object({
                id: z.coerce.number()
            }),
            body: {
                content: {
                    "application/json": {
                        schema: PlatformInsertSchema.omit({ platformId: true, dateAdded: true, dateModified: true }).partial()
                    }
                }
            }
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: PlatformSelectSchema
                    }
                },
                description: "The edited platform"
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
                description: "No platform with given id found"
            }
        },
    }),
    async c => {
        const { id } = c.req.valid("param")
        const body = c.req.valid('json')
        const isEmpty = Object.keys(body).length === 0
        if (isEmpty) return c.json({ error: "Empty request body" }, 422)
        const dev = await platformRepository.editPlatform(id, c.req.valid('json'))
        if (!dev) return c.json({ error: "Platform not found" }, 404)
        return c.json(dev, 200)
    }
)

platformRoutes.openapi(
    createRoute({
        tags: ["Platforms", "Admin"],
        method: "delete",
        path: "/{id}",
        description: "Admin-only route to delete a platform",        
        request: {
            params: z.object({
                id: z.coerce.number()
            }),
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: PlatformSelectSchema
                    }
                },
                description: "Deleted platform"
            },
            404: {
                content: {
                    "application/json": {
                        schema: z.object({ error: z.string() })
                    }
                },
                description: "No platform with given id found"
            }
        }
    }),
    async c => {
        const { id } = c.req.valid("param")
        const dev = await platformRepository.deletePlatform(id)
        if (!dev) return c.json({ error: "Platform not found" }, 404)
        return c.json(dev, 200)
    }
)

platformRoutes.openapi(
    createRoute({
        tags: ["Platforms", "Games"],
        method: "get",
        path: "/{id}/games",
        request: {
            query: QuerySchema,
            params: z.object({
                id: z.coerce.number()
            }),
        },        
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: GameSelectSchema.array()
                    }
                },
                description: "List of games made by this platform"
            }
        }
    }),
    async c => {
        const { id } = c.req.valid("param")
        const { cursor, limit } = c.req.valid('query')        
        const games = await gamesRepository.findAll({platformId: id, cursor, limit})
        return c.json(games, 200)
    }
)