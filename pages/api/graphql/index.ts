import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from "@apollo/server/plugin/landingPage/default"
import { resolvers } from '../../../graphql/resolvers';
import { typeDefs } from '../../../graphql/typeDefs';

const server = new ApolloServer({
    resolvers,
    typeDefs,
    plugins: [
        process.env.NODE_ENV! == 'development'
            ?
            ApolloServerPluginLandingPageLocalDefault()
            :
            ApolloServerPluginLandingPageProductionDefault({
                embed: true,
                graphRef: "cossieb@main"
            })
    ]
});

export default startServerAndCreateNextHandler(server);