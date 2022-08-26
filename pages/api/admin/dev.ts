import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../prisma/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        try {
            const result = await db.developer.create({
                data: req.body
            })
            return res.status(201).json({ msg: "Successfully created " + result.developerId, developerId: result.developerId })
        }
        catch (e: any) {
            return res.json({ error: e.meta.causee || e.message })
        }
    }
    if (req.method == "PUT") {
        try {
            
            const result = await db.developer.update({
                where: {
                    developerId: req.body.developerId
                },
                data: req.body
            })
            return res.json({ msg: "Successfully updated " + result.developerId })
        }
        catch (e: any) {
            console.error(e)
            return res.json({ error: e.meta.cause || e.message })
        }
    }
    if (req.method == "DELETE") {
        try {
            const result = await db.developer.delete({
                where: { 
                    developerId: req.body.developerId
                }
            })
            return res.json({ msg: "Successfully deleted " + result.developerId })
        }
        catch (e: any) {
            switch(e.code) {
                case 'P2003':
                    return res.json({error: "Could not delete because this is a developer of a game. First change that game's developer then try again."})
                default:
                    console.error(e)
                    return res.json({ error: e.meta?.cause || e.message })
            }
        }
    }
    return res.status(501).json({ error: "Invalid method" })
}