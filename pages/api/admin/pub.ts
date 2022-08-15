import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { IPub, Publishers } from "../../../models/publisher";

type DATA = {
    items: IPub[]
} | {
    error: any
} | {
    msg: string
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<DATA>) {
    await mongoose.connect(process.env.MONGO_URI!)
    if (req.method == "GET") {
        const items = await Publishers.find().lean().exec();
        return res.json({ items })

    }
    if (req.method == "POST") {

        try {
            if (!process.env.IS_ADMIN ) throw new Error('Unauthorized')
            const { name, summary, logo, headquarters, country } = req.body; 
            const msg = req.body.id ? "Update successful" : "Creation successful";
            const id = req.body.id || new mongoose.mongo.ObjectId().toString(); 
            
            
            const result = await Publishers.findOneAndUpdate({ _id: id }, {
                name,
                summary,
                logo,
                headquarters,
                country,
            }, { new: true, upsert: true })
            
            
            res.json({msg})

        } catch (error: any) {
            console.log(error)
            res.status(500).json({error: error.message})
        }

    }
    if (req.method == "DELETE") {
        try {
            if (!process.env.IS_ADMIN ) throw new Error('Unauthorized')
            const {id} = req.body;
            const result = await Publishers.findByIdAndDelete(id);
            if (result == null) throw new Error("Item not found")
            res.json({msg: `Successfully deleted ${id}`})

        } catch (e: any) {
            res.status(500).json({error: e.message})
        }
    }
}