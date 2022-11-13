import { db } from "../prisma/db"

export type GameTableJoinResult = {
    gameId: string
    developerId: string
    publisherId: string
    title: string
    cover: string
    summary: string
    releaseDate: Date
    genres: string[]
    images: string[]
    banner: string
    trailer: string
    pub_name: string
    dev_name: string
    pub_logo: string
    dev_logo: string
}

export function joinQuery(id: string): Promise<GameTableJoinResult[]> {
    return db.$queryRaw`
        SELECT 
            "gameId", 
            "publisherId", 
            "developerId", 
            "title",
            "cover", 
            "Game".summary, 
            "releaseDate", 
            "images", 
            "banner", 
            "trailer", 
            "Publisher".name AS pub_name, 
            "Developer".name AS dev_name, 
            "Publisher".logo AS pub_logo,
            "Developer".logo AS dev_logo
        FROM 
            "Game" 
        INNER JOIN 
            "Developer" USING ("developerId") 
        INNER JOIN 
            "Publisher" USING ("publisherId")
        WHERE 
            "gameId" = ${id}::UUID;`
}