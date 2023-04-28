'use client';

import { Game } from "@prisma/client";
import { notFound, useParams } from "next/navigation";
import GameTile from "../../../components/GameTile";
import styles from '/styles/Games.module.scss';
import { gql, useQuery } from "@apollo/client";
import { client } from "../../../utils/apollo";
import Loader from "../../../components/Loading/Loader";
import { useEffect } from "react";

type T = Pick<Game, 'title' | 'cover' | 'releaseDate' | 'gameId'>;

const query = gql`#graphql
query get($tag: String!) {
    gamesByGenre(genre: $tag) {
        title,
        cover,
        releaseDate,
        gameId,
    }
}
`

export default function SearchByTag() {
    const params = useParams()!;
    const { tag } = params as { tag: string };

    const { data, loading } = useQuery(query, {
        client,
        variables: { tag }
    })

    useEffect(() =>  {
        document.title = `"${tag} games :: IGDB`
    }, [])

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