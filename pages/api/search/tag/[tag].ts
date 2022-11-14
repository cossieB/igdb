import { Game } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../prisma/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        const {tag} = req.query
        const results: Pick<Game, 'title' | 'cover' | 'releaseDate' | 'gameId'>[] = await db.$queryRaw`
        SELECT "gameId", "cover", "title", "releaseDate"
        FROM "GenresOfGames"
        JOIN "Game"
        USING ("gameId")
        WHERE "genre" = ${tag};
        `
        return res.json(results)
    }
}