import { Developer, Game, Publisher } from "@prisma/client";

export type GamePick = Pick<Game, 'title' | 'cover' | 'releaseDate' | 'gameId'>;
export type DevPick = Pick<Developer, 'developerId' | 'name' | 'logo'>;
export type PubPick = Pick<Publisher, 'publisherId' | 'name' | 'logo'>;
export type UpsertResult = { msg: string } | { error: any}