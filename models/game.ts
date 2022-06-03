import mongoose, {Schema, Document} from "mongoose"
import { ActorDoc, actorSchema } from "./actor"
import { DevDoc, devSchema } from "./developers"
import { PlatformDoc, platformSchema } from "./platform"
import { PubDoc, pubSchema } from "./publisher"

export interface IGame {
    title: string,
    cover: string,
    summary: string
    developer: DevDoc,
    publisher: PubDoc,
    releaseDate: Date | string,
    genres: string[],
    cast: ActorDoc[],
    platforms: PlatformDoc[],
    images: string[],
    banner?: string
}
export interface GameDoc extends IGame, Document {}

const gameSchema = new Schema<IGame>({
    title: {type: String, required: true},
    cover: {type: String, required: true},
    summary: {type: String, required: true},
    developer: {type: devSchema, required: true},
    publisher: {type: pubSchema, required: true},
    releaseDate: {type: Date, required: true},
    genres: [String],
    cast: [{type: actorSchema}],
    platforms: [{type: platformSchema}],
    images: [String],
    banner: String
})
export type GameWithId = IGame & {id: string}

export const Games: mongoose.Model<IGame, {}, {}, {}> = mongoose.models.Game || mongoose.model('Game', gameSchema)