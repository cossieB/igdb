import { Game } from "@prisma/client";
import { Optional } from "./utilityTypes";

export type GameUpdateState = Game & {
    platformIds: string[]
    genres: string[]
}

export const initialGameUpdateState: GameUpdateState = {
    gameId: "",
    title: "",
    cover: "",
    summary: "",
    releaseDate: new Date(),
    genres: [],
    platformIds: [],
    images: [],
    banner: "",
    developerId: "",
    publisherId: "",
    trailer: ""
}