import mongoose, { Schema, Document } from "mongoose";

export interface IPlatform {
    name: string,
    logo: string,
    release: Date | string,
    summary: string,
}
export interface PlatformDoc extends IPlatform, Document {}

export const platformSchema = new Schema<IPlatform>({
    name: {type: String, required: true},
    logo: {type: String, required: true},
    release: {type: Date, required: true},
    summary: {type: String, required: true},
})
export type PlatformWithId = IPlatform & {id: string}

export const Platforms: mongoose.Model<IPlatform, {}, {}, {}> = mongoose.models.Platform || mongoose.model('Platform', platformSchema)