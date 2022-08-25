-- DropForeignKey
ALTER TABLE "ActorsInGames" DROP CONSTRAINT "ActorsInGames_actorId_fkey";

-- DropForeignKey
ALTER TABLE "ActorsInGames" DROP CONSTRAINT "ActorsInGames_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GamesOnPlatforms" DROP CONSTRAINT "GamesOnPlatforms_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GamesOnPlatforms" DROP CONSTRAINT "GamesOnPlatforms_platformId_fkey";

-- AddForeignKey
ALTER TABLE "ActorsInGames" ADD CONSTRAINT "ActorsInGames_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("actorId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorsInGames" ADD CONSTRAINT "ActorsInGames_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("gameId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamesOnPlatforms" ADD CONSTRAINT "GamesOnPlatforms_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("gameId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamesOnPlatforms" ADD CONSTRAINT "GamesOnPlatforms_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("platformId") ON DELETE CASCADE ON UPDATE CASCADE;
