-- AlterTable
ALTER TABLE "Actor" ALTER COLUMN "actorId" SET DEFAULT gen_random_uuid () ;

-- AlterTable
ALTER TABLE "Developer" ALTER COLUMN "developerId" SET DEFAULT gen_random_uuid () ;

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "gameId" SET DEFAULT gen_random_uuid () ;

-- AlterTable
ALTER TABLE "Platform" ALTER COLUMN "platformId" SET DEFAULT gen_random_uuid () ;

-- AlterTable
ALTER TABLE "Publisher" ALTER COLUMN "publisherId" SET DEFAULT gen_random_uuid () ;
