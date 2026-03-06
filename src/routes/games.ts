import { createRoute, z } from "@hono/zod-openapi";
import { ActorSelectSchema, GameSelectSchema, PlatformSelectSchema, ReviewInsertSchema, ReviewSelectSchema } from "~/drizzle/models";
import { createApp } from "~/utils/createApp";
import { ApiHeaderSchema, ErrorSchema, GameCreateSchema, GameEditSchema, GameSchema, NumberIdSchema, QuerySchema, ReviewInsert } from "~/utils/schemas";
import * as gamesRepository from "~/repositories/gamesRepository"
import * as genreRepository from "~/repositories/genreRepository"
import * as actorRepositiory from "~/repositories/actorsRepository"
import * as reviewRepositiory from "~/repositories/reviewRepository"
import { verifyApiKeyMware } from "~/middleware/verifyApiKey";
import { commonErrors } from "~/utils/commonErrors";
import { setRateLimitHeaders } from "~/middleware/setRateLimitHeaders";

export const gamesRoutes = createApp()

gamesRoutes.openapi(
    createRoute({
        tags: ["Games"],
        path: "/",
        method: "get",
        middleware: [verifyApiKeyMware(), setRateLimitHeaders],
        request: {
            query: QuerySchema,
            headers: ApiHeaderSchema
        },
        responses: {
            ...commonErrors,
            200: {
                content: {
                    'application/json': {
                        schema: GameSchema.array()
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
        middleware: [verifyApiKeyMware("admin"), setRateLimitHeaders],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: GameCreateSchema
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
        middleware: [verifyApiKeyMware(), setRateLimitHeaders],
        path: "/{id}",
        request: {
            params: NumberIdSchema,
            headers: ApiHeaderSchema
        },
        responses: {
            ...commonErrors,
            200: {
                content: {
                    'application/json': {
                        schema: GameSchema
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
            return c.json({ error: { message: "Game not found" } }, 404)
        return c.json(game, 200)
    }
)

gamesRoutes.openapi(
    createRoute({
        tags: ["Games", "Admin"],
        method: "patch",
        middleware: [verifyApiKeyMware("admin"), setRateLimitHeaders],
        path: "{id}",
        description: "Admin-only route to update the game with the given id",
        request: {
            params: NumberIdSchema,
            body: {
                content: {
                    "application/json": {
                        schema: GameEditSchema
                    }
                },
                required: true
            },
            headers: ApiHeaderSchema
        },
        responses: {
            ...commonErrors,
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
        if (isEmpty) return c.json({
            error: {
                message: "Empty request body"
            }
        }, 422)
        const g = await gamesRepository.updateGame(id, game, { genres, media, platforms })
        if (!g) return c.json({ error: "Game not found" }, 404)
        return c.json(g, 200)
    }
)

gamesRoutes.openapi(
    createRoute({
        tags: ["Games", "Admin"],
        method: "delete",
        middleware: [verifyApiKeyMware("admin"), setRateLimitHeaders],
        path: "/{id}",
        description: "Admin-only route to delete the game",
        request: {
            params: NumberIdSchema,
            headers: ApiHeaderSchema
        },
        responses: {
            ...commonErrors,
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
        if (!game) return c.json({ error: { message: "Game not found" } }, 404)
        return c.json(game, 200)
    }
)

gamesRoutes.openapi(
    createRoute({
        tags: ["Games"],
        method: "get",
        middleware: [verifyApiKeyMware(), setRateLimitHeaders],
        path: "/{id}/genres",
        request: {
            params: NumberIdSchema,
            headers: ApiHeaderSchema
        },
        responses: {
            ...commonErrors,
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
        middleware: [verifyApiKeyMware(), setRateLimitHeaders],
        path: "/{id}/platforms",
        request: {
            params: NumberIdSchema,
            headers: ApiHeaderSchema
        },
        responses: {
            ...commonErrors,
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
        if (!game) return c.json({ error: { message: "Game not found" } }, 404)
        return c.json(game.platforms, 200)
    }
)

gamesRoutes.openapi(
    createRoute({
        tags: ["Games", "Actors"],
        method: "get",
        middleware: [verifyApiKeyMware(), setRateLimitHeaders],
        path: "/{id}/actors",
        request: {
            params: NumberIdSchema,
            headers: ApiHeaderSchema
        },
        responses: {
            ...commonErrors,
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

gamesRoutes.openapi(
    createRoute({
        tags: ["Games", "Reviews"],
        method: "post",
        path: "/{id}/reviews",
        middleware: [verifyApiKeyMware(), setRateLimitHeaders],
        request: {
            params: NumberIdSchema,
            headers: ApiHeaderSchema,
            body: {
                content: {
                    "application/json": {
                        schema: ReviewInsert
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
                        schema: ReviewSelectSchema
                    }
                },
                description: "Edited review"
            },
            404: {
                content: {
                    "application/json": {
                        schema: ErrorSchema
                    }
                },
                description: "Game Not Found"
            }
        }
    }),
    async c => {
        const body = c.req.valid("json")
        const { id: gameId } = c.req.valid("param")
        const userId = c.var.key!.referenceId
        const review = await reviewRepositiory.upsertReview({
            gameId,
            userId,
            ...body
        })
        if (!review)
            return c.json({ error: { message: "Game Not Found" } }, 404)

        return c.json(review, 200)
    }
)

gamesRoutes.openapi(
    createRoute({
        tags: ["Games", "Reviews"],        
        path: "/{id}/reviews",
        method: "delete",
        middleware: [verifyApiKeyMware(), setRateLimitHeaders],
        request: {
            params: NumberIdSchema,
            headers: ApiHeaderSchema,
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: ReviewSelectSchema
                    }
                },
                description: "Deleted Review"
            },
            403: {
                content: {
                    "application/json": {
                        schema: ErrorSchema
                    },
                },
                description: ""
            },
            ...commonErrors,
        }
    }),
    async c => {
        const { id: gameId } = c.req.valid("param")
        const userId = c.var.key!.referenceId
        const deleted = (await reviewRepositiory.deleteReview(userId, gameId)).at(0)
        if (!deleted)
            return c.json({ error: { message: "Nothing deleted" } }, 403)
        return c.json(deleted, 200)
    }
)

gamesRoutes.openapi(
    createRoute({
        tags: ["Games", "Reviews"],        
        path: "/{id}/reviews",
        middleware: [verifyApiKeyMware(), setRateLimitHeaders],        
        method: "get",
        request: {
            params: NumberIdSchema,
            headers: ApiHeaderSchema,
            query: QuerySchema
        },
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: ReviewSelectSchema.array()
                    }
                },
                description: "List of this game's reviews"
            }
        }
    }),
    async c => {
        const { id: gameId } = c.req.valid("param")
        const {limit, cursor} = c.req.valid("query")
        const reviews = await reviewRepositiory.findAll({
            gameId, limit, cursor
        })
        return c.json(reviews)
    }
)