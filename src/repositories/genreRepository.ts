import { db } from "~/drizzle/db";

export function findAll(gameId?: number) {
    return db.query.gameGenres.findMany({
        where: {
            gameId
        }
    })
}