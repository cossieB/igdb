import mongoose, { ObjectId, Schema, Document } from "mongoose";

export interface IDev {
    name: string,
    logo: string,
    location: string,
    summary: string,
    country: string,
    games: mongoose.Types.ObjectId[],
}
export interface DevDoc extends IDev, Document {}

export const devSchema = new Schema<IDev>({
    name: {type: String, required: true},
    logo: {type: String, required: true},
    location: {type: String, required: true},
    summary: {type: String, required: true},
    country: {type: String, required: true},
    games: [{type: Schema.Types.ObjectId, ref: 'Game'}]
})

export type DevWithId = IDev & {id: string}

export const Developers: mongoose.Model<IDev, {}, {}, {}> = mongoose.models.Developer ||  mongoose.model('Developer', devSchema) 
