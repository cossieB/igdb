"use client";

import { gql, useQuery } from "@apollo/client";
import Loader from "../../../components/Loading/Loader";
import { client } from "../../../utils/apollo";

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
const { data, loading } = useQuery(gamesQuery, {client})
    console.log(data)

    return (
        <Loader loading={loading}>
            <div>

            </div>
        </Loader>
    )
}