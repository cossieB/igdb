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
        const items = await Games.find().lean().exec(); console.log(items[0])
        return res.json({ items })

    }
    if (req.method == "POST") {

        try {
            const { title, summary, cover, banner, date, developer: dev, publisher: pub, genres, ports } = req.body;
            const msg = req.body.id ? "Update successful" : "Creation successful";
            const id = req.body.id || new mongoose.mongo.ObjectId().toString()
            const [developer, publisher] = await Promise.all([Developers.findById(dev), Publishers.findById(pub)])
            let platforms: IPlatform[] = []
            for (let port of ports) {
                let doc = await Platforms.findById(port)
                doc && platforms.push(doc)
            }

            const result = await Games.findOneAndUpdate({ _id: id }, {
                title,
                summary,
                cover,
                banner,
                releaseDate: date,
                developer,
                publisher,
                genres,
                platforms
            }, { new: true, upsert: true })
            
            
            res.json({msg})

        } catch (error: any) {
            console.log(error)
            res.status(500).json({error: error.message})
        }

    }
    if (req.method == "DELETE") {
        try {
            const {id} = req.body;
            await Games.findByIdAndDelete(id);
            res.json({msg: `Successfully deleted ${id}`})

        } catch (e: any) {
            res.status(500).json({error: e.message})
        }
    }
}