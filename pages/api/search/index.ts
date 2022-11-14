import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        const {tag} = req.query;
        console.log(tag)
        return res.send(`You searched: ${tag}`)
    }
}