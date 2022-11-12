/*
  Warnings:

  - You are about to drop the column `genres` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Actor" ALTER COLUMN "actorId" SET DEFAULT gen_random_uuid () ;

-- AlterTable
ALTER TABLE "Developer" ALTER COLUMN "developerId" SET DEFAULT gen_random_uuid () ;

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "genres",
ALTER COLUMN "gameId" SET DEFAULT gen_random_uuid () ;

-- AlterTable
ALTER TABLE "Platform" ALTER COLUMN "platformId" SET DEFAULT gen_random_uuid () ;

-- AlterTable
ALTER TABLE "Publisher" ALTER COLUMN "publisherId" SET DEFAULT gen_random_uuid () ;

-- CreateTable
CREATE TABLE "GenresOfGames" (
    "genre" VARCHAR(100) NOT NULL,
    "gameId" UUID NOT NULL,

    CONSTRAINT "GenresOfGames_pkey" PRIMARY KEY ("genre","gameId")
);

-- AddForeignKey
ALTER TABLE "GenresOfGames" ADD CONSTRAINT "GenresOfGames_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("gameId") ON DELETE CASCADE ON UPDATE CASCADE;
