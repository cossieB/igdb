import { createRoute, z } from "@hono/zod-openapi";
import { PublisherInsertSchema, PublisherSelectSchema, GameSelectSchema } from "~/drizzle/models";
import { createApp } from "~/utils/createApp";
import { ErrorSchema, QuerySchema } from "~/utils/schemas";
import * as publisherRepository from "~/repositories/publisherRepository"
import * as gamesRepository from "~/repositories/gamesRepository"

export const publisherRoutes = createApp()

publisherRoutes.openapi(
    createRoute({
        tags: ["Publishers"],
        method: "get",
        path: "/",
        request: {
            query: QuerySchema
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: PublisherSelectSchema.array()
                    }
                },
                description: "List of publishers"
            }
        }
    }),
    async c => {
        const { limit, cursor } = c.req.valid('query')
        const devs = await publisherRepository.findAll({ limit, cursor })
        return c.json(devs, 200)
    }
)

publisherRoutes.openapi(
    createRoute({
        tags: ["Publishers"],
        method: "post",
        path: "/",
        description: "Admin-only route to add a publisher",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: PublisherInsertSchema
                    },
                }
            }
        },
        responses: {
            201: {
                content: {
                    "application/json": {
                        schema: PublisherSelectSchema
                    }
                },
                description: "The created publisher"
            }
        },
    }),
    async c => {
        const body = c.req.valid("json")
        const dev = await publisherRepository.createPublisher(body);
        return c.json(dev, 201)
    }
)

publisherRoutes.openapi(
    createRoute({
        tags: ["Publishers"],
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
                        schema: PublisherSelectSchema
                    }
                },
                description: "List of publishers"
            },
            404: {
                content: {
                    "application/json": {
                        schema: ErrorSchema
                    }
                },
                description: "Publisher not found"
            }
        }
    }),
    async c => {
        const { id } = c.req.valid("param")
        const dev = await publisherRepository.findById(id)
        if (!dev) return c.json({ error: "Publisher not found" }, 404)
        return c.json(dev, 200)
    }
)

publisherRoutes.openapi(
    createRoute({
        tags: ["Publishers"],
        method: "put",
        path: "/{id}",
        description: "Admin-only route to update a publisher",        
        request: {
            params: z.object({
                id: z.coerce.number()
            }),
            body: {
                content: {
                    "application/json": {
                        schema: PublisherInsertSchema.omit({ publisherId: true, dateAdded: true, dateModified: true }).partial()
                    }
                }
            }
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: PublisherSelectSchema
                    }
                },
                description: "The edited publisher"
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
                description: "No publisher with given id found"
            }
        },
    }),
    async c => {
        const { id } = c.req.valid("param")
        const body = c.req.valid('json')
        const isEmpty = Object.keys(body).length === 0
        if (isEmpty) return c.json({ error: "Empty request body" }, 422)
        const dev = await publisherRepository.editPublisher(id, c.req.valid('json'))
        if (!dev) return c.json({ error: "Publisher not found" }, 404)
        return c.json(dev, 200)
    }
)

publisherRoutes.openapi(
    createRoute({
        tags: ["Publishers"],
        method: "delete",
        path: "/{id}",
        description: "Admin-only route to delete a publisher",        
        request: {
            params: z.object({
                id: z.coerce.number()
            }),
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: PublisherSelectSchema
                    }
                },
                description: "Deleted publisher"
            },
            404: {
                content: {
                    "application/json": {
                        schema: z.object({ error: z.string() })
                    }
                },
                description: "No publisher with given id found"
            }
        }
    }),
    async c => {
        const { id } = c.req.valid("param")
        const dev = await publisherRepository.deletePublisher(id)
        if (!dev) return c.json({ error: "Publisher not found" }, 404)
        return c.json(dev, 200)
    }
)

publisherRoutes.openapi(
    createRoute({
        tags: ["Publishers", "Games"],
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
                description: "List of games made by this publisher"
            }
        }
    }),
    async c => {
        const { id } = c.req.valid("param")
        const { cursor, limit } = c.req.valid('query')        
        const games = await gamesRepository.findAll({publisherId: id, cursor, limit})
        return c.json(games, 200)
    }
)