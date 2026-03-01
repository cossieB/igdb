import { eq, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { publishers } from "~/drizzle/schema";

export async function findAll({limit, cursor}: { limit?: number, cursor?: number }) {
    return await db.query.publishers.findMany({
        where: {
            publisherId: {
                gt: cursor
            }
        },
        orderBy: {
            publisherId: "asc"
        },
        limit
    })
}

export async function findById(publisherId: number) {
    return await db.query.publishers.findFirst({
        where: {
            publisherId
        },

    })
}

export async function editPublisher(publisherId: number, data: Partial<InferSelectModel<typeof publishers>>) {
    const d = (await db.update(publishers).set(data).where(eq(publishers.publisherId, publisherId)).returning()).at(0)
    return d
}

export async function createPublisher(data: InferInsertModel<typeof publishers>) {
    const [result] = await db.insert(publishers).values(data).returning()   
    return result 
}

export async function deletePublisher(publisherId: number) {
    const d = (await db.delete(publishers).where(eq(publishers.publisherId, publisherId)).returning()).at(0)
    return d
}