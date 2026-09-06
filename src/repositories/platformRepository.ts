import { eq, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { platforms } from "~/drizzle/schema";

export async function findAll({limit, cursor}: { limit?: number, cursor?: number }) {
    return await db.query.platforms.findMany({
        where: {
            platformId: {
                gt: cursor
            }
        },
        orderBy: {
            platformId: "asc"
        },
        limit
    })
}

export async function findById(platformId: number) {
    return await db.query.platforms.findFirst({
        where: {
            platformId
        },

    })
}

export async function editPlatform(platformId: number, data: Partial<InferSelectModel<typeof platforms>>) {
    const d = (await db.update(platforms).set(data).where(eq(platforms.platformId, platformId)).returning()).at(0)
    return d
}

export async function createPlatform(data: InferInsertModel<typeof platforms>) {
    const [result] = await db.insert(platforms).values(data).returning()   
    return result 
}

export async function deletePlatform(platformId: number) {
    const d = (await db.delete(platforms).where(eq(platforms.platformId, platformId)).returning()).at(0)
    return d
}