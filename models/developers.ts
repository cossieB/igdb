import { IGame } from "./game";

export interface IDev {
    id?: string,
    name: string,
    logo: string,
    location: string,
    summary: string,
    country: string,
    game: IGame
}