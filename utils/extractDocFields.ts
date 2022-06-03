import { DevDoc, DevWithId } from "../models/developers"
import { GameDoc, GameWithId } from "../models/game"
import { PlatformDoc, PlatformWithId } from "../models/platform"
import { PubDoc, PubWithId } from "../models/publisher"

export function extract<T>(doc: T, keys: (keyof T)[]) {
    let obj: any = {};
    keys.forEach(item => {
        obj[item] = doc[item];
    })
    return obj as Pick<T, typeof keys[number]>
}

export function extractGameFields(gameDoc: GameDoc) {
    const game: GameWithId = {
        id: gameDoc.id,
        title: gameDoc.title,
        cover: gameDoc.cover,
        developer: extractDevFields(gameDoc.developer as DevDoc) as DevDoc,
        publisher: extractPubFields(gameDoc.publisher as PubDoc) as PubDoc,
        releaseDate: gameDoc.releaseDate instanceof Date ? gameDoc.releaseDate.toISOString() : gameDoc.releaseDate,
        genres: gameDoc.genres,
        cast: gameDoc.cast,
        summary: gameDoc.summary,
        platforms: extractPlatformFields(gameDoc.platforms as PlatformDoc[]) as PlatformDoc[],
        images: gameDoc.images,
        banner: gameDoc.banner || ""
    }
    return game
}
interface ExtractOptions {
    populateGames?: boolean
}

export function extractPubFields(pubDoc: PubDoc, options?: ExtractOptions): PubWithId {
    return {
        id: pubDoc.id,
        name: pubDoc.name,
        country: pubDoc.country,
        headquarters: pubDoc.headquarters,
        logo: pubDoc.logo,
        summary: pubDoc.summary,
        games: options?.populateGames ? pubDoc.games : [],
    }
}


export function extractDevFields(devDoc: DevDoc, options?: ExtractOptions): DevWithId {
    return {
        id: devDoc.id,
        name: devDoc.name,
        country: devDoc.country,
        location: devDoc.location,
        logo: devDoc.logo,
        summary: devDoc.summary,
        games: options?.populateGames ? devDoc.games : [],
    }
}
export function extractPlatformFields(platforms: PlatformDoc[]): PlatformWithId[] {
    return platforms.map(platDoc =>  ({
        id: platDoc.id,
        name: platDoc.name,
        release: platDoc.release instanceof Date ? platDoc.release.toISOString() : platDoc.release,
        logo: platDoc.logo,
        summary: platDoc.summary
    }))
}