import { type InferSelectModel } from "drizzle-orm";
import { actors, developers, gameActors, games, platforms, publishers } from "./schema";
import { createSelectSchema, createInsertSchema } from "drizzle-orm/zod";

export type Actor = InferSelectModel<typeof actors>
export type Developer = InferSelectModel<typeof developers>
export type Platform = InferSelectModel<typeof platforms>
export type Publisher = InferSelectModel<typeof publishers>
export type Game = InferSelectModel<typeof games>

export const ActorSelectSchema = createSelectSchema(actors)
export const AppearanceSelectSchema = createSelectSchema(gameActors)
export const DeveloperSelectSchema = createSelectSchema(developers)
export const PlatformSelectSchema = createSelectSchema(platforms)
export const PublisherSelectSchema = createSelectSchema(publishers)
export const GameSelectSchema = createSelectSchema(games)

export const ActorInsertSchema = createInsertSchema(actors)
export const DeveloperInsertSchema = createInsertSchema(developers)
export const PublisherInsertSchema = createInsertSchema(publishers)