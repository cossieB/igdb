import { and, eq } from "drizzle-orm"
import { db } from "~/drizzle/db"
import { reviews } from "~/drizzle/schema"

type Review = {
    score: number
    userId: string
    gameId: number
    text: string

}

export async function upsertReview(review: Review) {
    try {
        const [result] = await db
            .insert(reviews)
            .values(review)
            .onConflictDoUpdate({
                target: [reviews.gameId, reviews.userId],
                set: review
            })
            .returning()

        return result
    }
    catch (error: any) {
        if (error.cause.message.toLowerCase().includes("foreign key"))
            return null
        throw error
    }
}

export async function deleteReview(userId: string, gameId: number) {
    return db
        .delete(reviews)
        .where(and(
            eq(reviews.gameId, gameId),
            eq(reviews.userId, userId)
        ))
        .returning()
}

type Filter = {
    gameId?: number
    cursor?: number
    limit?: number
}

export function findAll(filter: Filter) {
    return db.query.reviews.findMany({
        where: {
            reviewId: {
                gt: filter.cursor
            },
            gameId: filter.gameId
        },
        limit: filter.limit
    })
}