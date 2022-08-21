import { IGame } from "./game";

export interface IPub {
    id?: string,
    name: string,
    logo: string,
    summary: string
    headquarters: string,
    country: string,
    games: IGame[],
}
