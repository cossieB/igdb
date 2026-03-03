import { createRoute, z } from "@hono/zod-openapi";
import { ActorSelectSchema, GameSelectSchema, PlatformSelectSchema } from "~/drizzle/models";
import { createApp } from "~/utils/createApp";
import { ErrorSchema, GameCreateSchema, GameEditSchema, QuerySchema } from "~/utils/schemas";
import * as gamesRepository from "~/repositories/gamesRepository"
import * as genreRepository from "~/repositories/genreRepository"
import * as actorRepositiory from "~/repositories/actorsRepository"
import { verifyApiKeyMware } from "~/middleware/verifyApiKey";

export const gamesRoutes = createApp()

gamesRoutes.openapi(
    createRoute({
        tags: ["Games"],
        path: "/",
        method: "get",
        middleware: [verifyApiKeyMware()],
        request: {
            query: QuerySchema
        },
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: GameSelectSchema.array()
                    }
                },
                description: "List of games"
            }
        }
    }),
    async c => {
        const { cursor, limit } = c.req.valid('query')
        const games = await gamesRepository.findAll({ cursor, limit })
        return c.json(games)
    }
)

gamesRoutes.openapi(
    createRoute({
        tags: ["Games", "Admin"],
        description: "Admin-only route to add a game",
        path: "/",
        method: "post",
        middleware: [verifyApiKeyMware("admin")],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: GameCreateSchema
                    }
                }
            }
        },
        responses: {
            201: {
                content: {
                    "application/json": {
                        schema: GameSelectSchema
                    }
                },
                description: "The created game"
            }
        }
    }),
    async c => {
        const { media, platforms, genres, ...game } = c.req.valid("json")
        const g = await gamesRepository.createGame(game, { platforms, media, genres })
        return c.json(g, 201)
    }
)

gamesRoutes.openapi(
    createRoute({
        tags: ["Games"],
        method: "get",
        middleware: [verifyApiKeyMware()],
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
                        schema: GameSelectSchema
                    }
                },
                description: "List of games"
            },
            404: {
                content: {
                    "application/json": {
                        schema: ErrorSchema
                    }
                },
                description: "Game not found"
            }
        }
    }),
    async c => {
        const { id } = c.req.valid('param')
        const game = await gamesRepository.findById(id)
        if (!game)
            return c.json({ error: "Game not found" }, 404)
        return c.json(game, 200)
    }
)

gamesRoutes.openapi(
    createRoute({
        tags: ["Games", "Admin"],
        method: "put",
        middleware: [verifyApiKeyMware("admin")],
        path: "{id}",
        description: "Admin-only route to update the game with the given id",
        request: {
            params: z.object({
                id: z.coerce.number()
            }),
            body: {
                content: {
                    "application/json": {
                        schema: GameEditSchema
                    }
                }
            }
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: GameSelectSchema
                    }
                },
                description: "The updated game"
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
                description: "No game with given id found"
            }
        }
    }),
    async c => {
        const { id } = c.req.valid('param')
        const { media, platforms, genres, gameId, ...game } = c.req.valid('json')
        const isEmpty = Object.keys(game).length === 0 && !media && !platforms && !genres
        if (isEmpty) return c.json({ error: "Empty request body" }, 422)
        const g = await gamesRepository.updateGame(id, game, {genres, media, platforms})
        if (!g) return c.json({error: "Game not found"}, 404)
        return c.json(g, 200)
    }
)

gamesRoutes.openapi(
    createRoute({
        tags: ["Games", "Admin"],
        method: "delete",
        middleware: [verifyApiKeyMware("admin")],
        path: "/{id}",
        description: "Admin-only route to delete the game",
        request: {
            params: z.object({
                id: z.coerce.number()
            })
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: GameSelectSchema
                    }
                },
                description: "The deleted game"
            },
            404: {
                content: {
                    "application/json": {
                        schema: ErrorSchema
                    }
                },
                description: "Game not found"
            }            
        }        
    }),
    async c => {
        const { id } = c.req.valid("param")
        const game = await gamesRepository.deleteGame(id)
        if (!game) return c.json({error: "Game not found"}, 404)
        return c.json(game, 200)
    }
)

gamesRoutes.openapi(
    createRoute({
        tags: ["Games"],
        method: "get",
        middleware: [verifyApiKeyMware()],
        path: "/{id}/genres",
        request: {
            params: z.object({
                id: z.coerce.number()
            })
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: z.string().array()
                    }
                },
                description: "List of the game's genres"
            }
        }
    }),
    async c => {
        const { id } = c.req.valid("param")
        const genres = await genreRepository.findAll(id)
        return c.json(genres.map(x => x.genre), 200)
    }
)

gamesRoutes.openapi(
    createRoute({
        tags: ["Games", "Platforms"],
        method: "get",
        middleware: [verifyApiKeyMware()],
        path: "/{id}/platforms",
        request: {
            params: z.object({
                id: z.coerce.number()
            })
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: PlatformSelectSchema.array()
                    }
                },
                description: "The platforms this game has been released on"
            },
            404: {
                content: {
                    "application/json": {
                        schema: ErrorSchema
                    }
                },
                description: "Game not found"
            }
        }
    }),
    async c => {
        const { id } = c.req.valid("param")
        const game = await gamesRepository.getPlatforms(id)
        if (!game) return c.json({ error: "Game not found" }, 404)
        return c.json(game.platforms, 200)
    }
)

gamesRoutes.openapi(
    createRoute({
        tags: ["Games", "Actors"],
        method: "get",
        middleware: [verifyApiKeyMware()],
        path: "/{id}/actors",
        request: {
            params: z.object({
                id: z.coerce.number()
            })
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: ActorSelectSchema.array()
                    }
                },
                description: "List of actors starring in this game"
            },
        }
    }),
    async c => {
        const { id } = c.req.valid("param")
        const actors = await actorRepositiory.findAll({ gameId: id });
        return c.json(actors, 200)
    }
)