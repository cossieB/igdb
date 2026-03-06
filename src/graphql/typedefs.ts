import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLString, Kind } from "graphql";
import { db } from "~/drizzle/db";
import type { Game } from "~/drizzle/models";

export const dateScalar = new GraphQLScalarType<any, any>({
    name: 'ISODate',
    description: 'Date custom scalar type',
    serialize(value: any) {
        return new Date(value).toISOString(); // Convert outgoing Date to string for JSON
    },
    parseValue(value: any) {
        return new Date(value); // Convert incoming integer to Date
    },
    parseLiteral(ast: any) {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
        }
        return null; // Invalid hard-coded value (not an integer)
    },
});

export const GraphQLDev = new GraphQLObjectType({
    name: "Developer",
    fields: {
        developerId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        logo: { type: new GraphQLNonNull(GraphQLString) },
        location: { type: GraphQLString },
        summary: { type: new GraphQLNonNull(GraphQLString) },
        country: { type: GraphQLString },
        dateAdded: { type: new GraphQLNonNull(dateScalar) },
        dateModified: { type: new GraphQLNonNull(dateScalar) }
    }
})

export const GraphQLPub = new GraphQLObjectType({
    name: "Publisher",
    fields: {
        publisherId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        logo: { type: new GraphQLNonNull(GraphQLString) },
        headquarters: { type: GraphQLString },
        summary: { type: new GraphQLNonNull(GraphQLString) },
        country: { type: GraphQLString },
        dateAdded: { type: new GraphQLNonNull(dateScalar) },
        dateModified: { type: new GraphQLNonNull(dateScalar) }
    }
})

export const GraphQLPlatform = new GraphQLObjectType({
    name: "Platform",
    fields: {
        platformId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        logo: { type: new GraphQLNonNull(GraphQLString) },
        releaseDate: { type: new GraphQLNonNull(GraphQLString) },
        summary: { type: new GraphQLNonNull(GraphQLString) },
        dateAdded: { type: new GraphQLNonNull(dateScalar) },
        dateModified: { type: new GraphQLNonNull(dateScalar) }
    }
})

export const GraphQLActor = new GraphQLObjectType({
    name: "Actor",
    fields: {
        actorId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        photo: { type: GraphQLString },
        bio: { type: new GraphQLNonNull(GraphQLString) },
        dateAdded: { type: new GraphQLNonNull(dateScalar) },
        dateModified: { type: new GraphQLNonNull(dateScalar) }
    }
})

export const GraphQLMedia = new GraphQLObjectType({
    name: "Media",
    fields: {
        key: { type: new GraphQLNonNull(GraphQLID) },
        contentType: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: new GraphQLNonNull(dateScalar) },
    }
})

export const GraphQLReview = new GraphQLObjectType({
    name: "Review",
    fields: {
        reviewId: { type: new GraphQLNonNull(GraphQLID) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        gameId: { type: new GraphQLNonNull(GraphQLID) },
        score: { type: new GraphQLNonNull(GraphQLInt) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        dateAdded: { type: new GraphQLNonNull(dateScalar) },
        dateModified: { type: new GraphQLNonNull(dateScalar) }
    }
})

type Args = {
    limit: number,
    cursor?: number,
}

export const GraphQLGame = new GraphQLObjectType({
    name: "Game",
    fields: {
        gameId: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        summary: { type: new GraphQLNonNull(GraphQLString) },
        releaseDate: { type: new GraphQLNonNull(GraphQLString) },
        cover: { type: new GraphQLNonNull(GraphQLString) },
        banner: { type: new GraphQLNonNull(GraphQLString) },
        trailer: { type: GraphQLString },
        dateAdded: { type: new GraphQLNonNull(dateScalar) },
        dateModified: { type: new GraphQLNonNull(dateScalar) },
        developer: { type: new GraphQLNonNull(GraphQLDev), },
        publisher: { type: new GraphQLNonNull(GraphQLDev), },
        platforms: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLPlatform))), },
        genres: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))), },
        media: { type: new GraphQLNonNull(new GraphQLList(GraphQLMedia)), },
        reviews: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLReview))),
            args: {
                cursor: { type: GraphQLInt },
                limit: { type: GraphQLInt, defaultValue: 10 },
            },
            resolve(parent: Game, args: Args) {
                return db.query.reviews.findMany({
                    limit: Math.min(args.limit, 20),
                    where: {
                        gameId: parent.gameId,
                        reviewId: {
                            gt: args.cursor
                        }
                    }
                })
            }
        }
    }
})

