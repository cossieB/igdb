import { gql, useQuery } from "@apollo/client";

const gamesQuery = gql`#graphql
    query GetPforms {
        games {
            title
        }
    }
`

export default function GamesAdmin() {
    const data = useQuery(gamesQuery)
    console.log(data)

    return (
        <div>
            
        </div>
    )
}