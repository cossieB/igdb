import { type InferSelectModel } from "drizzle-orm";
import { actors, developers, games, publishers } from "./schema";
import { createSelectSchema } from "drizzle-orm/zod";

export type Actor = InferSelectModel<typeof actors>
export type Developer = InferSelectModel<typeof developers>
export type Publisher = InferSelectModel<typeof publishers>
export type Game = InferSelectModel<typeof games>

export const ActorSelectSchema = createSelectSchema(actors)
export const DeveloperSelectSchema = createSelectSchema(developers)
export const PublisherSelectSchema = createSelectSchema(publishers)
export const GameSelectSchema = createSelectSchema(games)