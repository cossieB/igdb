import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IPub {
    name: string,
    logo: string,
    summary: string
    headquarters: string,
    country: string,
    games: mongoose.Types.ObjectId[],
}
export interface PubDoc extends IPub, Document {}
export type PubWithId = IPub & {id: string}

export const pubSchema = new Schema<IPub>({
    name: {type: String, required: true},
    logo: {type: String, required: true},
    headquarters: {type: String, required: true},
    country: {type: String, required: true},
    summary: {type: String, required: true},
    games: [{type: Schema.Types.ObjectId, ref: 'Game'}],
})

export const Publishers: mongoose.Model<IPub, {}, {}, {}> = mongoose.models.Publisher || mongoose.model('Publisher', pubSchema)