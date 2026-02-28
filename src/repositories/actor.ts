import { and, eq, getColumns, type InferInsertModel, type InferSelectModel, notInArray, sql } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { actors, gameActors, games } from "~/drizzle/schema";

export function findById(actorId: number) {
    return db.query.actors.findFirst({
        where: {
            actorId
        }
    })
}

export async function findAll(cursor?: number, limit?: number) {
    return db.query.actors.findMany({
        orderBy: {
            actorId: 'asc',
        },
        where: {
            actorId: {
                gt: cursor
            }
        },
        limit
    })
}

export async function createActor(actor: InferInsertModel<typeof actors>) {
    const [a] = (await db.insert(actors).values(actor).returning())
    return a
}

export async function editActor(actorId: number, actor: Partial<InferSelectModel<typeof actors>>) {
    return db.update(actors).set(actor).where(eq(actors.actorId, actorId))
};