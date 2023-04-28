import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../prisma/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        const { text } = req.query as { text: string };
        if (!text) return res.status(401).send("Please include search query")

        const gamesQuery = await db.$queryRaw`
            SELECT
                DISTINCT("gameId"),title, cover, "releaseDate"
            FROM "Game"
            JOIN "GenresOfGames" USING ("gameId")
            WHERE
                title ILIKE ${`%${text}%`} OR
                genre ILIKE ${`%${text}%`};
        `
        const devQuery = db.developer.findMany({
            where: {
                OR: [{
                    name: {
                        contains: text,
                        mode: 'insensitive'
                    }
                },{
                    summary: {
                        contains: text,
                        mode: 'insensitive'
                    }
                }]
            },
            select: {
                name: true,
                logo: true,
                developerId: true
            }
        })

        const pubQuery = db.publisher.findMany({
            where: {
                OR: [{
                    name: {
                        contains: text,
                        mode: 'insensitive'
                    }
                },{
                    summary: {
                        contains: text,
                        mode: 'insensitive'
                    }
                }]
            },
            select: {
                name: true,
                logo: true,
                publisherId: true
            }
        })

        const [games, devs, pubs] = await Promise.all([gamesQuery, devQuery, pubQuery])

        return res.json({ games, devs, pubs })
    }
}