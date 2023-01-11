import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import {ApolloServerPluginLandingPageLocalDefault} from "@apollo/server/plugin/landingPage/default"
import { resolvers } from '../../graphql/resolvers';
import { typeDefs } from '../../graphql/typeDefs';

const server = new ApolloServer({
  resolvers,
  typeDefs,
  plugins: [ApolloServerPluginLandingPageLocalDefault()]
});

export default startServerAndCreateNextHandler(server);