import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../prisma/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        try {
            const result = await db.publisher.create({
                data: req.body
            })
            return res.status(201).json({ msg: "Successfully created " + result.publisherId, publisherId: result.publisherId })
        }
        catch (e: any) {
            return res.json({ error: e.meta.causee || e.message })
        }
    }
    if (req.method == "PUT") {
        try {
            console.log(req.body)
            const result = await db.publisher.update({
                where: {
                    publisherId: req.body.publisherId
                },
                data: req.body
            })
            return res.json({ msg: "Successfully updated " + result.publisherId })
        }
        catch (e: any) {
            console.error(e)
            return res.json({ error: e.meta.cause || e.message })
        }
    }
    if (req.method == "DELETE") {
        try {
            const result = await db.publisher.delete({
                where: {
                    publisherId: req.body.publisherId
                }
            })
            return res.json({ msg: "Successfully deleted " + result.publisherId })
        }
        catch (e: any) {
            switch (e.code) {
                case 'P2003':
                    return res.json({ error: "Could not delete because this is a publisher of a game. First change that game's publisher then try again." })
                default:
                    console.error(e)
                    return res.json({ error: e.meta?.cause || e.message })
            }
        }
    }
    return res.status(501).json({ error: "Invalid method" })
}