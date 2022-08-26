import { Game, GamesOnPlatforms } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../prisma/db";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method == "POST") {

        const { platformIds } = req.body
        const game = { ...req.body }
        delete game.platformIds
        delete game.gameId
        const onPlatform = platformIds.map((platformId: string) => ({ platformId }))

        try {
            const result = await db.game.create({
                data: {
                    ...game,
                    GamesOnPlatforms: {
                        create: onPlatform
                    }
                },
            })

            return res.status(201).json({ msg: "Successfully created " + result.gameId, gameId: result.gameId })
        }
        catch (e: any) {
            console.error(e);
            return res.json({ error: e.message })
        }
    }
    if (req.method == "PUT") {
        try {
            const { platformIds } = req.body
            const game = { ...req.body }
            delete game.platformIds
            delete game.gameId
            const onPlatform: GamesOnPlatforms[] = platformIds.map((platformId: string) => ({ platformId, gameId: req.body.gameId }))

            const prom1 = db.game.update({
                where: {
                    gameId: req.body.gameId
                },
                data: {
                    ...(game as Game)
                }
            })
            const prom2 = db.gamesOnPlatforms.deleteMany({
                where: {
                    gameId: req.body.gameId
                },
            })
            const prom3 = db.gamesOnPlatforms.createMany({
                data: onPlatform
            })
            const result = await db.$transaction([prom1, prom2, prom3])

            return res.json({ msg: "Successfully updated " + result[0].gameId })
        }
        catch (e: any) {
            console.error(e);
            return res.json({ error: e.message })
        }
    }
    if (req.method == "DELETE") {
        
        try {
            const {gameId} = req.body as { gameId: string }
            await db.game.delete({
                where: {
                    gameId
                }
            })
            return res.json({msg: "Successfully deleted " + gameId})
        }
        catch (e: any) {
            console.error(e)
            return res.json({ error: e.message })
        }
    }
    return res.status(501).json({error: "Invalid method"})
}