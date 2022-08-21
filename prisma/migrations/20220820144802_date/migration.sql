/*
  Warnings:

  - Changed the type of `release` on the `Platform` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Actor" ALTER COLUMN "actorId" SET DEFAULT gen_random_uuid () ;

-- AlterTable
ALTER TABLE "Developer" ALTER COLUMN "developerId" SET DEFAULT gen_random_uuid () ;

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "gameId" SET DEFAULT gen_random_uuid () ;

-- AlterTable
ALTER TABLE "Platform" ALTER COLUMN "platformId" SET DEFAULT gen_random_uuid () ,
DROP COLUMN "release",
ADD COLUMN     "release" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Publisher" ALTER COLUMN "publisherId" SET DEFAULT gen_random_uuid () ;
