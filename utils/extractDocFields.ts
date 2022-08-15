import { IDev } from "../models/developers"
import { IGame } from "../models/game"
import { IPlatform } from "../models/platform"
import { IPub } from "../models/publisher"

export function extract<T>(doc: T, keys: (keyof T)[]) {
    let obj: any = {};
    keys.forEach(item => {
        obj[item] = doc[item];
    })
    return obj as Pick<T, typeof keys[number]>
}

export function extractGameFields(gameDoc: IGame) {
    const game: IGame = {
        _id: gameDoc._id,
        id: gameDoc.id,
        title: gameDoc.title,
        cover: gameDoc.cover,
        developer: extractDevFields(gameDoc.developer),
        publisher: extractPubFields(gameDoc.publisher),
        releaseDate: gameDoc.releaseDate instanceof Date ? gameDoc.releaseDate.toISOString() : gameDoc.releaseDate,
        genres: gameDoc.genres,
        cast: gameDoc.cast,
        summary: gameDoc.summary,
        platforms: extractPlatformFields(gameDoc.platforms),
        images: gameDoc.images,
        banner: gameDoc.banner || ""
    }
    return game
}
interface ExtractOptions {
    populateGames?: boolean
}

export function extractPubFields(pubDoc: IPub, options?: ExtractOptions): IPub {
    return {
        _id: pubDoc._id,
        id: pubDoc.id,
        name: pubDoc.name,
        country: pubDoc.country,
        headquarters: pubDoc.headquarters,
        logo: pubDoc.logo,
        summary: pubDoc.summary,
        games: options?.populateGames ? pubDoc.games : [],
    }
}


export function extractDevFields(devDoc: IDev, options?: ExtractOptions): IDev {
    return {
        _id: devDoc._id,
        id: devDoc.id,
        name: devDoc.name,
        country: devDoc.country,
        location: devDoc.location,
        logo: devDoc.logo,
        summary: devDoc.summary,
        games: options?.populateGames ? devDoc.games : [],
    }
}
export function extractPlatformFields(platforms: IPlatform[]): IPlatform[] {
    return platforms.map(platDoc =>  ({
        _id: platDoc._id,
        id: platDoc.id,
        name: platDoc.name,
        release: platDoc.release instanceof Date ? platDoc.release.toISOString() : platDoc.release,
        logo: platDoc.logo,
        summary: platDoc.summary
    }))
}