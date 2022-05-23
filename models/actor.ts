import mongoose, { Schema, Document } from "mongoose";

export interface IActor {
    name: string,
    photo?: string,
    summary?: string
}
export interface ActorDoc extends IActor, Document {}

export const actorSchema = new Schema<IActor>({
    name: {type: String, required: true},
    photo: String,
    summary: String,
})

export const Actors: mongoose.Model<IActor, {}, {}, {}> = mongoose.models.Actor || mongoose.model('Actor', actorSchema)