import mongoose, { Document, Schema } from "mongoose";
import { actorSchema, IActor } from "./actor";
import { devSchema, IDev } from "./developers";
import { IPlatform, platformSchema } from "./platform";
import { IPub, pubSchema } from "./publisher";

export interface IGame extends Document {
    title: string,
    cover: string,
    summary: string
    developer: IDev,
    publisher?: IPub,
    releaseDate: Date,
    genres: string[],
    cast: IActor[],
    platforms: IPlatform[],
    images: string[]
}

const gameSchema = new Schema<IGame>({
    title: {type: String, required: true},
    cover: {type: String, required: true},
    summary: {type: String, required: true},
    developer: {type: devSchema, required: true},
    publisher: {type: pubSchema},
    releaseDate: {type: Date, required: true},
    genres: [String],
    cast: [{type: actorSchema}],
    platforms: [{type: platformSchema}],
    images: [String]
})

export const Games: mongoose.Model<IGame, {}, {}, {}> = mongoose.models.Game || mongoose.model('Game', gameSchema)