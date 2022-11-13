import { GameUpdateState } from "./initialGameState";
import { Game, GamesOnPlatforms, GenresOfGames } from "@prisma/client";

export function changeType(game: Game | null, gamesOnPlatform: GamesOnPlatforms[], genresOfGames: GenresOfGames[]): GameUpdateState | null {
    if (!game)
        return null;

    const platformIds: string[] = [];
    for (let gop of gamesOnPlatform) {
        if (gop.gameId == game.gameId) {
            platformIds.push(gop.platformId);
        }
    }
    const genres: string[] = [];
    for (let gog of genresOfGames) {
        if (gog.gameId == game.gameId) {
            genres.push(gog.genre);
        }
    }
    return {
        ...game,
        platformIds,
        genres
    };
}
