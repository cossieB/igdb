import { check, integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { users } from "./auth-schema";
import { sql } from "drizzle-orm";
import { games } from "./core";

export const reviews = sqliteTable("review", {
    reviewId: integer("review_id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    gameId: integer("game_id").notNull().references(() => games.gameId),
    dateAdded: text("date_added").notNull().default(sql`CURRENT_TIMESTAMP`),
    dateModified: text("date_modified").notNull().$onUpdateFn(() => new Date().toISOString()),
    text: text("text").notNull(),
    score: integer().notNull(),
}, table => [
    check("review_length", sql`LENGTH(${table.text}) > 3`),
    check("valid_score", sql`${table.score} > 0 AND ${table.score} < 6`),
    unique().on(table.userId, table.gameId)
])