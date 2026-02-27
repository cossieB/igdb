import { sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const developers = sqliteTable("developers", {
    developerId: integer("developer_id").primaryKey(),
    name: text("name").notNull(),
    logo: text("logo").notNull(),
    location: text("location"),
    summary: text("summary").notNull().default(""),
    country: text("country"),
    dateAdded: text("date_added").notNull().default(sql`CURRENT_TIMESTAMP`),
    dateModified: text("date_modified").notNull().$onUpdateFn(() => new Date().toISOString()),
})

export const publishers = sqliteTable("publishers", {
    publisherId: integer("publisher_id").primaryKey(),
    name: text("name").notNull(),
    logo: text("logo").notNull(),
    headquarters: text("headquarters"),
    summary: text("summary").notNull().default(""),
    country: text("country"),
    dateAdded: text("date_added").notNull().default(sql`CURRENT_TIMESTAMP`),
    dateModified: text("date_modified").notNull().$onUpdateFn(() => new Date().toISOString()),
})

export const games = sqliteTable("games", {
    gameId: integer("game_id").primaryKey(),
    title: text("title").notNull(),
    summary: text("summary").notNull().default(""),
    developerId: integer("developer_id").notNull().references(() => developers.developerId),
    publisherId: integer("publisher_id").notNull().references(() => publishers.publisherId),
    releaseDate: text("release_date").notNull(),
    cover: text("cover").notNull(),
    banner: text("banner").notNull(),
    trailer: text("trailer"),
    dateAdded: text("date_added").notNull().default(sql`CURRENT_TIMESTAMP`),
    dateModified: text("date_modified").notNull().$onUpdateFn(() => new Date().toISOString()),
}, table => [
    index('games_dev_id_idx').on(table.developerId),
    index('games_pub_id_idx').on(table.publisherId)
]);

export const platforms = sqliteTable("platforms", {
    platformId: integer("platform_id").primaryKey(),
    name: text("name").notNull(),
    logo: text("logo").notNull(),
    releaseDate: text("release_date").notNull(),
    summary: text("summary").notNull().default(""),
    dateAdded: text("date_added").notNull().default(sql`CURRENT_TIMESTAMP`),
    dateModified: text("date_modified").notNull().$onUpdateFn(() => new Date().toISOString()),
});

export const actors = sqliteTable("actors", {
    actorId: integer("actor_id").primaryKey(),
    name: text("name").notNull(),
    photo: text("photo"),
    bio: text("bio").notNull().default(""),
    dateAdded: text("date_added").notNull().default(sql`CURRENT_TIMESTAMP`),
    dateModified: text("date_modified").notNull().$onUpdateFn(() => new Date().toISOString()),
});

export const genres = sqliteTable("genres", {
    name: text("name").primaryKey(),
    description: text("description").notNull().default(""),
    dateAdded: text("date_added").notNull().default(sql`CURRENT_TIMESTAMP`),
    dateModified: text("date_modified").notNull().$onUpdateFn(() => new Date().toISOString())
});

export const gameActors = sqliteTable("game_actors", {
    appearanceId: integer("appearance_id").primaryKey(),
    gameId: integer("game_id").notNull().references(() => games.gameId, { onDelete: "cascade" }),
    actorId: integer("actor_id").notNull().references(() => actors.actorId, { onDelete: "cascade" }),
    character: text().notNull(),
    roleType: text("role_type").notNull().default("major character")
}, (table) => [
    unique().on(table.gameId, table.actorId)
]);

export const gamePlatforms = sqliteTable("game_platforms", {
    gameId: integer("game_id").notNull().references(() => games.gameId, { onDelete: "cascade" }),
    platformId: integer("platform_id").notNull().references(() => platforms.platformId, { onDelete: "cascade" }),
}, (table) => [
    primaryKey({ columns: [table.gameId, table.platformId] })
]);

export const gameGenres = sqliteTable("game_genres", {
    gameId: integer("game_id").notNull().references(() => games.gameId, { onDelete: "cascade" }),
    genre: text("genre").notNull().references(() => genres.name, { onDelete: "cascade", onUpdate: "cascade" }),
}, (table) => [
    primaryKey({ columns: [table.gameId, table.genre] })
]);


export const media = sqliteTable("media", {
    key: text("key").primaryKey(),
    contentType: text("content_type").notNull(),
    gameId: integer("game_id").references(() => games.gameId, { onDelete: "set null" }),
    metadata: text("metadata", {mode: "json"}).$type<Record<string, unknown>>().notNull().default({}),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
}, table => [
    index('media_game_id_idx').on(table.gameId)
])