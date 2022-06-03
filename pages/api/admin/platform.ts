import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { IPlatform, Platforms } from "../../../models/platform";

type DATA = {
    items: IPlatform[]
} | {
    error: any
} | {
    msg: string
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<DATA>) {
    await mongoose.connect(process.env.MONGO_URI!)
    if (req.method == "GET") {
        const items = await Platforms.find().lean().exec();
        return res.json({ items })

    }
    if (req.method == "POST") {

        try {
            const { name, summary, logo, release } = req.body; 
            const msg = req.body.id ? "Update successful" : "Creation successful";
            const id = req.body.id || new mongoose.mongo.ObjectId().toString(); ;
               
            await Platforms.findOneAndUpdate({ _id: id }, {
                name,
                summary,
                logo,
                release
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
            const result = await Platforms.findByIdAndDelete(id);
            if (result == null) throw new Error("Item not found")
            res.json({msg: `Successfully deleted ${id}`})

        } catch (e: any) {
            res.status(500).json({error: e.message})
        }
    }
}