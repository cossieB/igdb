import { IGame } from "../models/game";
import { Optional } from "./utilityTypes";

export type GameUpdateState = Omit<Optional<IGame, '_id'> , 'developer' | 'publisher' | 'platforms'> & {
    developerId: string,
    publisherId: string,
    platformIds: string[]
}

export const initialGameUpdateState: GameUpdateState = {
    id: "",
    title: "",
    cover: "",
    summary: "",
    releaseDate:  "",
    genres: [],
    cast: [],
    platformIds: [],
    images: [],
    banner: "",
    developerId: "",
    publisherId: "",
    trailer: ""
}