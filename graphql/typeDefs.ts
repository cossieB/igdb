import { GraphQLScalarType, Kind } from "graphql";


export const typeDefs = `#graphql
    scalar Date

    type Developer {
        developerId: ID!
        name: String!
        logo: String!
        summary: String!
        location: String!
        country: String!
        games: [Game]!
    }

    type Publisher {
        publisherId: ID!
        name: String!
        logo: String!
        summary: String!
        headquarters: String!
        country: String!
        games: [Game]!
    }

    type Game {
        gameId: ID!
        title: String!
        summary: String!
        banner: String!
        trailer: String!
        releaseDate: Date!
        genres: [String]!
        images: [String]!
        developer: Developer!
        publisher: Publisher!
    }

    type Platform {
        platformId: String!
        name: String!
        logo: String!
        summary: String!
        release: Date!
    }

    type Query {
        game(id: ID!): Game
        games: [Game!]!
        developer(id: ID!): Developer
        developers: [Developer!]!
        publisher(id: ID!): Publisher
        publishers: [Publisher!]!
        platform(id: ID!): Platform
        platforms: [Platform!]!
  }
`;

export const dateScalar = new GraphQLScalarType<any, any>({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value: any) {
        return (value as Date).toLocaleDateString('en-za', {dateStyle: 'long'}); // Convert outgoing Date to string for JSON
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