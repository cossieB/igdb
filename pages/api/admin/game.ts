import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../prisma/db";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        const { title, cover, summary, releaseDate, genres, platformIds, images, banner, developerId, publisherId, trailer } = req.body
        let onPlatform = platformIds.map((platformId: string) => ({
            
            platformId
        }))
        try {
            const result = await db.game.create({
                data: {
                    title,
                    cover,
                    summary,
                    releaseDate,
                    genres,
                    images,
                    banner,
                    developerId,
                    publisherId,
                    trailer,
                    GamesOnPlatforms: {
                        create: onPlatform
                    }
                },
            })

            return res.json({ msg: "Successfully created " + result.gameId })
        } 
        catch (e: any) {
            console.error(e);

        }
    }
}