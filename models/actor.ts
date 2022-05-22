import mongoose, { Schema } from "mongoose";

export interface IActor {
    name: string,
    photo?: string,
    summary?: string
}

export const actorSchema = new Schema<IActor>({
    name: {type: String, required: true},
    photo: String,
    summary: String,
})

export const Actors: mongoose.Model<IActor, {}, {}, {}> = mongoose.models.Actor || mongoose.model('Actor', actorSchema)