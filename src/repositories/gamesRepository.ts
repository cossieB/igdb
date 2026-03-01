import { and, desc, eq, getColumns, gt, inArray, type InferInsertModel, type InferSelectModel, lt, notInArray, SQL, sql } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { gameActors, gamePlatforms, gameGenres, actors, platforms, media, games, publishers, developers, genres } from "~/drizzle/schema/";
import { type Actor, type Platform } from "~/drizzle/models";

export type GameQueryFilters = {
    developerId?: number
    publisherId?: number
    actorId?: number
    platformId?: number
    genre?: string
    limit?: number
    cursor?: number
}

export async function findAll(obj: GameQueryFilters = {}) {
    return db.query.games.findMany({
        where: {
            developerId: obj.developerId,
            publisherId: obj.publisherId,
            actors: {
                actorId: obj.actorId
            },
            genres: {
                name: obj.genre
            },
            platforms: {
                platformId: obj.platformId
            },
            gameId: {
                gt: obj.cursor
            }
        },
        limit: obj.limit,
    })
}

export async function findById(gameId: number) {
    const list = await db.select().from(games).where(eq(games.gameId, gameId))
    return list.at(0)
}

type GameInsert = {
    platforms: number[]
    genres: string[]
    media: { key: string, contentType: string }[]
}

export async function createGame(game: InferInsertModel<typeof games>, other: GameInsert) {
    return db.transaction(async tx => {
        const g = (await tx.insert(games).values(game).returning())[0]
        if (other.genres.length > 0) {
            await tx.insert(genres).values(other.genres.map(x => ({ name: x }))).onConflictDoNothing()
            await tx.insert(gameGenres).values(other.genres.map(genre => ({ gameId: g.gameId, genre })))
        }
        if (other.media.length > 0)
            await tx.insert(media).values(other.media.map(m => ({
                ...m,
                gameId: g.gameId
            })))
        if (other.platforms.length > 0)
            await tx.insert(gamePlatforms).values(other.platforms.map(platformId => ({ platformId, gameId: g.gameId })))

        return g
    })
}

export async function updateGame(gameId: number, game: Partial<InferSelectModel<typeof games>>, other: Partial<GameInsert>) {
    return db.transaction(async tx => {
        const list = await tx.update(games).set(game).where(eq(games.gameId, gameId)).returning()
        if (other.platforms) {
            if (other.platforms.length === 0) {
                await tx.delete(gamePlatforms).where(eq(gamePlatforms.gameId, gameId));
            }
            else {
                await tx.delete(gamePlatforms)
                    .where(
                        and(
                            eq(gamePlatforms.gameId, gameId),
                            notInArray(gamePlatforms.platformId, other.platforms)
                        )
                    );
                await tx.insert(gamePlatforms)
                    .values(other.platforms.map((platformId) => ({
                        gameId,
                        platformId
                    })))
                    .onConflictDoNothing({
                        target: [gamePlatforms.gameId, gamePlatforms.platformId]
                    });
            }
        }
        if (other.genres) {
            if (other.genres.length == 0)
                await tx.delete(gameGenres).where(eq(gameGenres.gameId, gameId))
            else {
                await tx.delete(gameGenres)
                    .where(
                        and(
                            eq(gameGenres.gameId, gameId),
                            notInArray(gameGenres.genre, other.genres)
                        )
                    )
                await tx.insert(gameGenres)
                    .values(other.genres.map(genre => ({ genre, gameId })))
                    .onConflictDoNothing({
                        target: [gameGenres.gameId, gameGenres.genre]
                    })
            }
        }
        if (other.media) {
            if (other.media.length == 0)
                await tx.update(media).set({ gameId: null }).where(eq(media.gameId, gameId))
            else
                await tx.insert(media).values(other.media.map(m => ({ ...m, gameId }))).onConflictDoNothing()
        }
        return list.at(0)
    })
}

export async function deleteGame(gameId: number) {
    const g = (await db.delete(games).where(eq(games.gameId, gameId)).returning()).at(0)
    return g
}

export async function getPlatforms(gameId: number) {
    return db.query.games.findFirst({
        where: {
            gameId
        },
        with: {
            platforms: true
        },
        
        columns: {
            
        }
    })
}