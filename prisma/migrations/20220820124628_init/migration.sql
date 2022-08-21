-- CreateTable
CREATE TABLE "Game" (
    "gameId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "cover" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "developerId" UUID NOT NULL,
    "publisherId" UUID NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "genres" TEXT[],
    "images" TEXT[],
    "banner" TEXT NOT NULL,
    "trailer" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("gameId")
);

-- CreateTable
CREATE TABLE "Developer" (
    "developerId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "logo" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Developer_pkey" PRIMARY KEY ("developerId")
);

-- CreateTable
CREATE TABLE "Publisher" (
    "publisherId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "logo" TEXT NOT NULL,
    "headquarters" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("publisherId")
);

-- CreateTable
CREATE TABLE "Platform" (
    "platformId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "logo" TEXT NOT NULL,
    "release" TEXT NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("platformId")
);

-- CreateTable
CREATE TABLE "Actor" (
    "actorId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT,
    "summary" TEXT,

    CONSTRAINT "Actor_pkey" PRIMARY KEY ("actorId")
);

-- CreateTable
CREATE TABLE "GamesOnPlatforms" (
    "gameId" UUID NOT NULL,
    "platformId" UUID NOT NULL,

    CONSTRAINT "GamesOnPlatforms_pkey" PRIMARY KEY ("gameId","platformId")
);

-- CreateTable
CREATE TABLE "ActorsInGames" (
    "actorId" UUID NOT NULL,
    "gameId" UUID NOT NULL,

    CONSTRAINT "ActorsInGames_pkey" PRIMARY KEY ("actorId","gameId")
);

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("developerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("publisherId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamesOnPlatforms" ADD CONSTRAINT "GamesOnPlatforms_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("gameId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamesOnPlatforms" ADD CONSTRAINT "GamesOnPlatforms_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("platformId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorsInGames" ADD CONSTRAINT "ActorsInGames_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("actorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorsInGames" ADD CONSTRAINT "ActorsInGames_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("gameId") ON DELETE RESTRICT ON UPDATE CASCADE;
