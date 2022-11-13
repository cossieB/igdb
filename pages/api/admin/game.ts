import { Game, GamesOnPlatforms, GenresOfGames } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../prisma/db";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!process.env.IS_ADMIN) return res.status(401).json({error: "Unauthorized"})
    if (req.method == "POST") {

        const { platformIds, genres } = req.body
        const game = { ...req.body }
        delete game.gameId // empty string
        // delete fields which aren't in the DB model
        delete game.platformIds
        delete game.genres
        const onPlatform = platformIds.map((platformId: string) => ({ platformId }));
        const gameGenres = genres.map((genre: string) => ({genre}))

        try {
            const result = await db.game.create({
                data: {
                    ...game,
                    GamesOnPlatforms: {
                        create: onPlatform
                    },
                    GenresOfGames: {
                        create: gameGenres
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
            const {platformIds, genres, gameId, ...game} = req.body
            const onPlatform: GamesOnPlatforms[] = platformIds.map((platformId: string) => ({ platformId, gameId }))
            const gameGenres: GenresOfGames[] = genres.map((genre: string) => ({gameId, genre}))
            
            const prom1 = db.game.update({
                where: {
                    gameId
                },
                data: {
                    ...(game as Game)
                }
            })
            const prom2 = db.gamesOnPlatforms.deleteMany({
                where: {
                    gameId
                },
            })
            const prom3 = db.gamesOnPlatforms.createMany({
                data: onPlatform
            })
            
            const prom4 = db.genresOfGames.deleteMany({
                where: {
                    gameId
                },
            })
            const prom5 = db.genresOfGames.createMany({
                data: gameGenres
            })
            const result = await db.$transaction([prom1, prom2, prom3, prom4, prom5])

            return res.json({ msg: "Successfully updated " + result[0].gameId })
        }
        catch (e: any) {
            switch (e.code) {
                case 'P2025':
                    return res.json({error: e.meta.cause || e.message })
                default:
                    console.error(e)
                    return res.json({ error: "Something went wrong" })
            }
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