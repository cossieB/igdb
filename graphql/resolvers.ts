import { Developer, Game, PrismaClient, Publisher } from "@prisma/client";
import { dateScalar } from "./typeDefs";

const prisma = new PrismaClient()

type OnlyIdArgs = {
    id: string
}

export const resolvers = {
    Date: dateScalar,
    Query: {
        games: async () => {
            return await prisma.game.findMany()
        },
        publishers: async () => {
            return await prisma.publisher.findMany()
        },
        developers: async () => {
            return await prisma.developer.findMany()
        },
        platforms: async () => {
            return await prisma.platform.findMany()
        },
        game: async (parent: any, args: OnlyIdArgs) => {
            try {
                return await prisma.game.findUnique({
                    where: {
                        gameId: args.id
                    },
                });
            } catch (e: any) {
                throw new Error(e.meta.message || e.meta.cause || e.message || "Something went wrong");
            }
        },
        developer: async (parent: any, args: OnlyIdArgs) => {
            try {
                return await prisma.developer.findUnique({
                    where: {
                        developerId: args.id
                    }
                });
            } catch (e: any) {
                throw new Error(e.meta.message || e.meta.cause || e.message || "Something went wrong");
            }
        },
        publisher: async (parent: any, args: OnlyIdArgs) => {
            try {
                return await prisma.publisher.findUnique({
                    where: {
                        publisherId: args.id
                    }
                });
            } catch (e: any) {
                throw new Error(e.meta.message || e.meta.cause || e.message || "Something went wrong");
            }
        },
        platform: async (parent: any, args: OnlyIdArgs) => {
            try {
                return await prisma.platform.findUnique({
                    where: {
                        platformId: args.id
                    }
                });
            } catch (e: any) {
                throw new Error(e.meta.message || e.meta.cause || e.message || "Something went wrong");
            }
        },
    },
    Game: {
        genres: async (parent: Game) => {
            try {
                const result = await prisma.genresOfGames.findMany({
                    where: {
                        gameId: parent.gameId
                    },
                    select: {
                        genre: true
                    }
                })
                return result.map(x => x.genre)
            } catch (e: any) {
                throw new Error(e.meta.message || e.meta.cause || e.message || "Something went wrong");
            }
        },
        developer: async (parent: Game) => {
            try {
                return await prisma.developer.findUnique({
                    where: {
                        developerId: parent.developerId
                    }
                })    
            } 
            catch (e: any) {
                throw new Error(e.meta.message || e.meta.cause || e.message || "Something went wrong");
            }
        },
        publisher: async (parent: Game) => {
            try {
                return await prisma.publisher.findUnique({
                    where: {
                        publisherId: parent.publisherId
                    }
                })    
            } 
            catch (e: any) {
                throw new Error(e.meta.message || e.meta.cause || e.message || "Something went wrong");
            }
        },
    },
    Developer: {
        games: async (parent: Developer) => {
            try {
                return await prisma.game.findMany({
                    where: {
                        developerId: parent.developerId
                    }
                })
            } catch (e: any) {
                throw new Error(e.meta.message || e.meta.cause || e.message || "Something went wrong");
            }
        }
    },
    Publisher: {
        games: async (parent: Publisher) => {
            try {
                return await prisma.game.findMany({
                    where: {
                        developerId: parent.publisherId
                    }
                })
            } catch (e: any) {
                throw new Error(e.meta.message || e.meta.cause || e.message || "Something went wrong");
            }
        }
    },
};