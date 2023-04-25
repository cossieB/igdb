import { gql, useQuery } from "@apollo/client";
import Loader from "../../components/Loading/Loader";

const gamesQuery = gql`
    query GetPforms {
        games {
            title
            developer {
                name
                developerId
            }
            publisher {
                name
                publisherId
            }
        }
    }
`

export default function GamesAdmin() {
    const { data, loading } = useQuery(gamesQuery)
    console.log(data)

    return (
        <Loader loading={loading}>
            <div>

            </div>
        </Loader>
    )
}