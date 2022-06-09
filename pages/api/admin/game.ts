import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Developers } from "../../../models/developers";
import { Games, IGame } from "../../../models/game";
import { IPlatform, PlatformDoc, Platforms } from "../../../models/platform";
import { Publishers } from "../../../models/publisher";

type DATA = {
    items: IGame[]
} | {
    error: any
} | {
    msg: string
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<DATA>) {
    await mongoose.connect(process.env.MONGO_URI!)
    if (req.method == "GET") {
        const items = await Games.find().lean().exec();
        return res.json({ items })

    }
    if (req.method == "POST") {

        try {
            if (!process.env.IS_ADMIN) throw new Error('Unauthorized')
            const { title, summary, cover, banner, date, developer: dev, publisher: pub, genres, ports } = req.body;
            const msg = req.body.id ? "Update successful" : "Creation successful";

            const [developer, publisher] = await Promise.all([Developers.findById(dev), Publishers.findById(pub)])

            if (!developer || !publisher) throw new Error("Developer or publisher not found")

            let platforms: PlatformDoc[] = []
            for (let port of ports) {
                let doc = await Platforms.findById(port)
                doc && platforms.push(doc)
            }
            const document = {
                title,
                summary,
                cover,
                banner,
                releaseDate: date,
                developer,
                publisher,
                genres,
                platforms
            }
            let game: (mongoose.Document<unknown, any, IGame> & IGame & { _id: mongoose.Types.ObjectId; }) | null

            if (!req.body.id) {
                game = new Games(document)
                publisher.games.push(game._id)
                developer.games.push(game._id);
            }
            else {
                game = await Games.findById(req.body.id)
                if (game == null) throw new Error("Game not found");

                if (developer.id != game.developer.id) {
                    await Developers.findByIdAndUpdate(game.developer.id, {
                        $pull: { games: game.id }
                    })
                    developer.games.push(game._id)
                }
                if (publisher.id != game.publisher.id) {
                    await Publishers.findByIdAndUpdate(game.publisher.id, {
                        $pull: { games: game.id }
                    })
                    publisher.games.push(game._id)
                }

                game.title = title;
                game.summary = summary;
                game.cover = cover;
                game.banner = banner;
                game.releaseDate = date;
                game.developer = developer;
                game.publisher = publisher;
                game.genres = genres;
                game.platforms = platforms;
            }

            await Promise.all([publisher.save(), developer.save(), game.save()])
            res.json({ msg })

        } catch (error: any) {
            console.log(error)
            res.status(500).json({ error: error.message })
        }

    }
    if (req.method == "DELETE") {
        try {
            if (!process.env.IS_ADMIN) throw new Error('Unauthorized')
            const { id } = req.body;
            const result = await Games.findByIdAndDelete(id);

            const updateDev = Developers.findByIdAndUpdate(result?.developer.id, {
                $pull: { games: result?.id }
            })
            const updatePub = Publishers.findByIdAndUpdate(result?.publisher.id, {
                $pull: { games: result?.id }
            })

            await Promise.all([updateDev, updatePub])

            res.json({ msg: `Successfully deleted ${id}` })

        } catch (e: any) {
            res.status(500).json({ error: e.message })
        }
    }
}