import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServerPluginLandingPageProductionDefault } from "@apollo/server/plugin/landingPage/default"
import { resolvers } from '../../../graphql/resolvers';
import { typeDefs } from '../../../graphql/typeDefs';
import allowCors from '../../../utils/cors';

const server = new ApolloServer({
    resolvers,
    typeDefs,
    plugins: [ApolloServerPluginLandingPageProductionDefault()]
});

const handler = startServerAndCreateNextHandler(server, {
    context: async (req, res) => ({req, res})
});

export default allowCors(handler) 