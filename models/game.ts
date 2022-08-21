import { IActor } from "./actor"
import { IDev } from "./developers"
import { IPlatform } from "./platform"
import { IPub } from "./publisher"

export interface IGame {
    id?: string,
    title: string,
    cover: string,
    summary: string
    developer: IDev,
    publisher: IPub,
    releaseDate: Date | string,
    genres: string[],
    cast: IActor[],
    platforms: IPlatform[],
    images: string[],
    banner?: string,
    trailer?: string
}
