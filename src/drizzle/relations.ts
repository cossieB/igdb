import { defineRelations } from "drizzle-orm";
import * as schema from "./schema"

export const relations = defineRelations(schema, (r) => ({
	games: {
		developer: r.one.developers({
			from: r.games.developerId,
			to: r.developers.developerId
		}),
		publisher: r.one.publishers({
			from: r.games.publisherId,
			to: r.publishers.publisherId
		}),
		platforms: r.many.platforms({
			from: r.games.gameId.through(r.gamePlatforms.gameId),
			to: r.platforms.platformId.through(r.gamePlatforms.platformId)
		}),
		genres: r.many.genres({
			from: r.games.gameId.through(r.gameGenres.gameId),
			to: r.genres.name.through(r.gameGenres.genre)
		}),
		actors: r.many.actors({
			from: r.games.gameId.through(r.gameActors.gameId),
			to: r.actors.actorId.through(r.gameActors.actorId)
		}),
		media: r.many.media({
			from: r.games.gameId,
			to: r.media.gameId
		})
	},
	actors: {
		characters: r.many.gameActors({
			from: r.actors.actorId,
			to: r.gameActors.actorId
		}),
		games: r.many.games({
			from: r.actors.actorId.through(r.gameActors.actorId),
			to: r.games.gameId.through(r.gameActors.gameId)
		})
	},
}))