import mongoose, { ObjectId, Schema, Document } from "mongoose";
import { IGame } from "./game";

export interface IDev extends Document {
    name: string,
    logo: string,
    location: string,
    summary: string,
    country: string,
    games: ObjectId[],
}

export const devSchema = new Schema<IDev>({
    name: {type: String, required: true},
    logo: {type: String, required: true},
    location: {type: String, required: true},
    summary: {type: String, required: true},
    country: {type: String, required: true},
    games: [{type: Schema.Types.ObjectId, ref: 'Game'}]
})

export const Developers: mongoose.Model<IDev, {}, {}, {}> = mongoose.models.Developer ||  mongoose.model('Developer', devSchema) 
