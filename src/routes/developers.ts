import { createRoute, z } from "@hono/zod-openapi";
import { DeveloperInsertSchema, DeveloperSelectSchema, GameSelectSchema } from "~/drizzle/models";
import { createApp } from "~/utils/createApp";
import { ErrorSchema, QuerySchema } from "~/utils/schemas";
import * as developerRepository from "~/repositories/developerRepository"
import * as gamesRepository from "~/repositories/gamesRepository"

export const developerRoutes = createApp()

developerRoutes.openapi(
    createRoute({
        tags: ["Developers"],
        method: "get",
        path: "/",
        request: {
            query: QuerySchema
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: DeveloperSelectSchema.array()
                    }
                },
                description: "List of developers"
            }
        }
    }),
    async c => {
        const { limit, cursor } = c.req.valid('query')
        const devs = await developerRepository.findAll({ limit, cursor })
        return c.json(devs, 200)
    }
)

developerRoutes.openapi(
    createRoute({
        tags: ["Developers"],
        method: "post",
        path: "/",
        description: "Admin-only route to add a developer",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: DeveloperInsertSchema
                    },
                }
            }
        },
        responses: {
            201: {
                content: {
                    "application/json": {
                        schema: DeveloperSelectSchema
                    }
                },
                description: "The created developer"
            }
        },
    }),
    async c => {
        const body = c.req.valid("json")
        const dev = await developerRepository.createDeveloper(body);
        return c.json(dev, 201)
    }
)

developerRoutes.openapi(
    createRoute({
        tags: ["Developers"],
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
                        schema: DeveloperSelectSchema
                    }
                },
                description: "List of developers"
            },
            404: {
                content: {
                    "application/json": {
                        schema: ErrorSchema
                    }
                },
                description: "Developer not found"
            }
        }
    }),
    async c => {
        const { id } = c.req.valid("param")
        const dev = await developerRepository.findById(id)
        if (!dev) return c.json({ error: "Developer not found" }, 404)
        return c.json(dev, 200)
    }
)

developerRoutes.openapi(
    createRoute({
        tags: ["Developers"],
        method: "put",
        path: "/{id}",
        description: "Admin-only route to update a developer",
        request: {
            params: z.object({
                id: z.coerce.number()
            }),
            body: {
                content: {
                    "application/json": {
                        schema: DeveloperInsertSchema.omit({ developerId: true, dateAdded: true, dateModified: true }).partial()
                    }
                }
            }
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: DeveloperSelectSchema
                    }
                },
                description: "The edited developer"
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
                description: "No developer with given id found"
            }
        },
    }),
    async c => {
        const { id } = c.req.valid("param")
        const body = c.req.valid('json')
        const isEmpty = Object.keys(body).length === 0
        if (isEmpty) return c.json({ error: "Empty request body" }, 422)
        const dev = await developerRepository.editDeveloper(id, c.req.valid('json'))
        if (!dev) return c.json({ error: "Developer not found" }, 404)
        return c.json(dev, 200)
    }
)

developerRoutes.openapi(
    createRoute({
        tags: ["Developers"],
        method: "delete",
        path: "/{id}",
        description: "Admin-only route to delete a developer",        
        request: {
            params: z.object({
                id: z.coerce.number()
            }),
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: DeveloperSelectSchema
                    }
                },
                description: "Deleted developer"
            },
            404: {
                content: {
                    "application/json": {
                        schema: z.object({ error: z.string() })
                    }
                },
                description: "No developer with given id found"
            }
        }
    }),
    async c => {
        const { id } = c.req.valid("param")
        const dev = await developerRepository.deleteDeveloper(id)
        if (!dev) return c.json({ error: "Developer not found" }, 404)
        return c.json(dev, 200)
    }
)

developerRoutes.openapi(
    createRoute({
        tags: ["Developers", "Games"],
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
                description: "List of games made by this developer"
            }
        }
    }),
    async c => {
        const { id } = c.req.valid("param")
        const { cursor, limit } = c.req.valid('query')        
        const games = await gamesRepository.findAll({developerId: id, cursor, limit})
        return c.json(games, 200)
    }
)