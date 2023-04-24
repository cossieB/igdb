import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

type Props = {
    children: React.ReactNode
}

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "/api/graphql"
})

export default function Apollo({children}: Props) {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}