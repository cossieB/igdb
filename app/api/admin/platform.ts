import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../prisma/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!process.env.IS_ADMIN) return res.status(401).json({error: "Unauthorized"})

    if (req.method == "POST") {
        try {
            const result = await db.platform.create({
                data: req.body
            })
            return res.status(201).json({ msg: "Successfully created " + result.platformId, platformId: result.platformId })
        }
        catch (e: any) {
            return res.json({ error: e.meta.causee || e.message })
        }
    }
    if (req.method == "PUT") {
        try {
            console.log(req.body)
            const result = await db.platform.update({
                where: {
                    platformId: req.body.platformId
                },
                data: req.body
            })
            return res.json({ msg: "Successfully updated " + result.platformId })
        }
        catch (e: any) {
            console.error(e)
            return res.json({ error: e.meta.cause || e.message })
        }
    }
    if (req.method == "DELETE") {
        try {
            const result = await db.platform.delete({
                where: { 
                    platformId: req.body.platformId
                }
            })
            return res.json({ msg: "Successfully deleted " + result.platformId })
        }
        catch (e: any) {
            console.error(e)
            return res.json({ error: e.meta.cause || e.message })
        }
    }
    return res.status(501).json({ error: "Invalid method" })
}