import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt } from "graphql"
import { GraphQLActor, GraphQLDev, GraphQLGame, GraphQLPlatform, GraphQLPub, GraphQLReview } from "./typedefs";
import { db } from "~/drizzle/db";
import type { Context } from "hono";
import type { MyEnv } from "~/utils/types";
import { verifyApiKey } from "./verifyApiKey";
import { ReviewInsert } from "~/utils/schemas";
import * as reviewRepository from "~/repositories/reviewRepository"

type MyArgs = {
    cursor?: number,
    limit: number,
    developerId?: number
    publisherId?: number
    actorId?: number
    platformId?: number
}

type IdArgs = {
    id: number;
};

export const graphqlSchema = new GraphQLSchema({

    query: new GraphQLObjectType({
        name: 'RootQueryType',

        fields: {
            games: {
                type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLGame))),
                args: {
                    cursor: { type: GraphQLInt },
                    limit: { type: GraphQLInt, defaultValue: 10 },
                    developerId: { type: GraphQLInt },
                    publisherId: { type: GraphQLInt },
                    platformId: { type: GraphQLInt },
                    actorId: { type: GraphQLInt },
                },
                async resolve(_, args: MyArgs, ctx: Context<MyEnv>) {
                    await verifyApiKey(ctx) 
                    const games = await db.query.games.findMany({
                        limit: Math.min(args.limit, 10),
                        where: {
                            gameId: {
                                gt: args.cursor
                            },
                            actors: {
                                actorId: args.actorId
                            },
                            platforms: {
                                platformId: args.platformId
                            },
                            developerId: args.developerId,
                            publisherId: args.publisherId
                        },
                        with: {
                            actors: true,
                            developer: true,
                            genres: true,
                            media: true,
                            platforms: true,
                            publisher: true,
                        }
                    })

                    return games.map(game => ({
                        ...game,
                        genres: game.genres.map(genre => genre.name)
                    }))
                }
            },
            game: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLInt) }
                },
                type: GraphQLGame,
                async resolve(_, args: IdArgs, ctx: Context<MyEnv>) {
                    await verifyApiKey(ctx) 
                    const game = await db.query.games.findFirst({
                        where: {
                            gameId: args.id
                        },
                        with: {
                            actors: true,
                            developer: true,
                            genres: true,
                            media: true,
                            platforms: true,
                            publisher: true,
                        }
                    })
                    if (!game) return undefined
                    return { ...game, genres: game.genres.map(genre => genre.name) }
                }
            },
            developers: {
                args: {
                    cursor: { type: GraphQLInt },
                    limit: { type: GraphQLInt, defaultValue: 10 },
                },
                type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLDev))),
                async resolve(_, args: MyArgs, ctx: Context<MyEnv>) {
                    await verifyApiKey(ctx) 
                    return db.query.developers.findMany({
                        limit: args.limit,
                        where: {
                            developerId: {
                                gt: args.cursor
                            }
                        }
                    })
                }
            },
            developer: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLInt) }
                },
                type: GraphQLDev,
                async resolve(_, args: IdArgs, ctx: Context<MyEnv>) {
                    await verifyApiKey(ctx) 
                    return db.query.developers.findFirst({
                        where: {
                            developerId: args.id
                        }
                    })
                }
            },
            publishers: {
                args: {
                    cursor: { type: GraphQLInt },
                    limit: { type: GraphQLInt, defaultValue: 10 },
                },
                type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLPub))),
                async resolve(_, args: MyArgs, ctx: Context<MyEnv>) {
                    await verifyApiKey(ctx) 
                    return db.query.publishers.findMany({
                        limit: args.limit,
                        where: {
                            publisherId: {
                                gt: args.cursor
                            }
                        }
                    })
                }
            },
            publisher: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLInt) }
                },
                type: GraphQLPub,
                async resolve(_, args: IdArgs, ctx: Context<MyEnv>) {
                    await verifyApiKey(ctx) 
                    return db.query.publishers.findFirst({
                        where: {
                            publisherId: args.id
                        }
                    })
                }
            },
            platforms: {
                args: {
                    cursor: { type: GraphQLInt },
                    limit: { type: GraphQLInt, defaultValue: 10 },
                },
                type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLPlatform))),
                async resolve(_, args: MyArgs, ctx: Context<MyEnv>) {
                    await verifyApiKey(ctx) 
                    return db.query.platforms.findMany({
                        limit: args.limit,
                        where: {
                            platformId: {
                                gt: args.cursor
                            }
                        }
                    })
                }
            },
            platform: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLInt) }
                },
                type: GraphQLPlatform,
                async resolve(_, args: IdArgs, ctx: Context<MyEnv>) {
                    await verifyApiKey(ctx) 
                    return db.query.platforms.findFirst({
                        where: {
                            platformId: args.id
                        }
                    })
                }
            },
            actors: {
                args: {
                    cursor: { type: GraphQLInt },
                    limit: { type: GraphQLInt, defaultValue: 10 },
                },
                type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLActor))),
                async resolve(_, args: MyArgs, ctx: Context<MyEnv>) {
                    await verifyApiKey(ctx) 
                    return db.query.actors.findMany({
                        limit: args.limit,
                        where: {
                            actorId: {
                                gt: args.cursor
                            }
                        }
                    })
                }
            },
            actor: {
                args: {
                    id: { type: new GraphQLNonNull(GraphQLInt) }
                },
                type: GraphQLActor,
                async resolve(_, args: IdArgs, ctx: Context<MyEnv>) {
                    await verifyApiKey(ctx) 
                    return db.query.actors.findFirst({
                        where: {
                            actorId: args.id
                        }
                    })
                }
            },
        },
    }),
    mutation: new GraphQLObjectType({
        name: "RootMutation",
        fields: {
            reviewGame: {
                type: GraphQLReview,
                args: {
                    text: { type: new GraphQLNonNull(GraphQLString) },
                    score: { type: new GraphQLNonNull(GraphQLInt) },
                    gameId: {type: new GraphQLNonNull(GraphQLInt)}
                },
                async resolve(_, args: {text: string, score: number, gameId: number}, ctx: Context<MyEnv>) {
                    const key = await verifyApiKey(ctx)
                    const valid = ReviewInsert.parse(args)
                    const review = await reviewRepository.upsertReview({...valid, gameId: args.gameId, userId: key.referenceId})
                    return review
                }
            },
            deleteReview: {
                type: GraphQLReview,
                args: {
                    gameId: {type: new GraphQLNonNull(GraphQLInt)}
                },
                async resolve(_, args: {gameId: number}, ctx: Context<MyEnv>) {
                    const key = await verifyApiKey(ctx)    
                    const review = (await reviewRepository.deleteReview(key.referenceId, args.gameId)).at(0) 
                    return review
                }
            }
        }
    })
});

