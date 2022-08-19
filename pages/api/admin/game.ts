import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Developers } from "../../../models/developers";
import { Games, IGame } from "../../../models/game";
import { IPlatform, Platforms } from "../../../models/platform";
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
        console.log(items)
        return res.json({ items })

    }
    if (req.method == "POST") {

        try {
            if (!process.env.IS_ADMIN) throw new Error('Unauthorized')
            const { title, summary, cover, banner, developerId, publisherId, genres, platformIds, releaseDate, trailer } = req.body;
            const msg = req.body.id ? "Update successful" : "Creation successful";

            const [developer, publisher] = await Promise.all([Developers.findById(developerId), Publishers.findById(publisherId)])

            if (!developer && !publisher) throw new Error("Unknown developer and publisher")
            if (!developer) throw new Error("Unknown developer")
            if (!publisher) throw new Error("Unknown publisher")

            let platforms: IPlatform[] = []
            for (let id of platformIds) {
                let doc = await Platforms.findById(id)
                doc && platforms.push(doc)
            }
            const document = {
                ...req.body,
                releaseDate: new Date(req.body.releaseDate).setHours(new Date(req.body.releaseDate).getHours() + 12),
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
                game.releaseDate = releaseDate;
                game.developer = developer;
                game.publisher = publisher;
                game.genres = genres;
                game.platforms = platforms;
                game.trailer = trailer
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