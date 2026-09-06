import { eq, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { db } from "~/drizzle/db";
import { developers } from "~/drizzle/schema";

export async function findAll({limit, cursor}: { limit?: number, cursor?: number }) {
    return await db.query.developers.findMany({
        where: {
            developerId: {
                gt: cursor
            }
        },
        orderBy: {
            developerId: "asc"
        },
        limit
    })
}

export async function findById(developerId: number) {
    return await db.query.developers.findFirst({
        where: {
            developerId
        },

    })
}

export async function editDeveloper(developerId: number, data: Partial<InferSelectModel<typeof developers>>) {
    const d = (await db.update(developers).set(data).where(eq(developers.developerId, developerId)).returning()).at(0)
    return d
}

export async function createDeveloper(data: InferInsertModel<typeof developers>) {
    const [result] = await db.insert(developers).values(data).returning()   
    return result 
}

export async function deleteDeveloper(developerId: number) {
    const d = (await db.delete(developers).where(eq(developers.developerId, developerId)).returning()).at(0)
    return d
}