import { Developer, Game, GamesOnPlatforms, Platform, Publisher } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../prisma/db";

export type API_RESPONSE = {
    games: Game[]
    devs: Developer[]
    pubs: Publisher[]
    platforms: Platform[]
    gamesOnPlatforms: GamesOnPlatforms[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<API_RESPONSE | {error: string}>) {
    if (req.method != "GET") return res.status(501).json({ error: "Unsupported method" })

    try {
        const gamesQuery = db.game.findMany()
        const devsQuery = db.developer.findMany()
        const pubsQuery = db.publisher.findMany()
        const platformsQuery = db.platform.findMany()
        const gamesOnPlatformsQuery = db.gamesOnPlatforms.findMany()

        const [games, devs, pubs, platforms, gamesOnPlatforms] = await Promise.all([
            gamesQuery, devsQuery, pubsQuery, platformsQuery, gamesOnPlatformsQuery
        ])

        return res.json({games, devs, pubs, platforms, gamesOnPlatforms})

    } catch (e: any) {
        console.log(e)
        return res.status(500).json({error: e.message})
    }
}