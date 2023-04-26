'use client';

import { Game } from "@prisma/client";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import GameTile from "../../../components/GameTile";
import styles from '/styles/Games.module.scss'
import titleCase from "../../../lib/titleCase";
import NotFound from "../../not-found";
import { gql, useQuery } from "@apollo/client";
import { client } from "../../../utils/apollo";
import Loader from "../../../components/Loading/Loader";

type T = Pick<Game, 'title' | 'cover' | 'releaseDate' | 'gameId'>;

const query = gql`#graphql
query get($tag: String!) {
    gamesByGenre(genre: $tag) {
        title,
        cover,
        releaseDate,
        gameId
    }
}
`

export default function SearchByTag() {
    const [games, setGames] = useState<T[]>([])
    const params = useParams()!;
    const { tag } = params as { tag: string };

    const { data, loading } = useQuery(query, {
        client,
        variables: { tag }
    })

    if (data?.gamesByGenre.length == 0) {
        return notFound()
    }
    return (
        <Loader loading={loading}>
            <div className={styles.games}>
                {data?.gamesByGenre.map((game: T) =>
                    <GameTile
                        game={game}
                        key={game.gameId}
                        className={styles.tile}
                    />
                )}
            </div> 
        </Loader>
    )
}