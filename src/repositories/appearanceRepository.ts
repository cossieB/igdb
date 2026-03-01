import { eq, type InferInsertModel } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { gameActors } from "~/drizzle/schema";

type Insert = InferInsertModel<typeof gameActors>;

export async function createAppearance(appearance: Insert) {
    const [a] = await db.insert(gameActors).values(appearance).returning()
    return a
}

export async function updateAppearance(appearanceId: number, appearance: Omit<Partial<Insert>, 'appearanceId'>) {
    const [a] = await db.update(gameActors).set(appearance).where(eq(gameActors.appearanceId, appearanceId)).returning()
    return a
}

type Filter = {
    gameId?: number
    actorId?: number
    limit?: number
    cursor?: number
}

export async function findAll(filter: Filter) {
    return db.query.gameActors.findMany({
        where: {
            gameId: filter.gameId, 
            actorId: filter.actorId,
            appearanceId: {
                gt: filter.cursor
            }
        },
        limit: filter.limit,
        orderBy: {
            appearanceId: "asc"
        }
    })
}

