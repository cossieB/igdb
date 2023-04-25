import { Game } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GameTile from "../../components/GameTile";
import styles from '../../styles/Games.module.scss'
import titleCase from "../../lib/titleCase";
import NotFound from "../not-found";

type T = Pick<Game, 'title' | 'cover' | 'releaseDate' | 'gameId'>;

export default function SearchByTag() {
    const [games, setGames] = useState<T[]>([])
    const [notFound, setNotFound] = useState(false)
    const router = useRouter()
    const { tag } = router.query as { tag: string }

    useEffect(() => {
        (async function () {
            if (tag == undefined) return;
            document.title = `IGDB | Genre | ${titleCase(tag)}`
            const data = await (await fetch(`/api/search/tag/${tag}`)).json()
            if (data.length == 0)
                setNotFound(true)
            else setGames(data)
        })()
    }, [tag])
    return (
        !notFound ?
            <div className={styles.games}>
                {games.map(game =>
                    <GameTile
                        game={game}
                        key={game.gameId}
                        className={styles.tile}
                    />
                )}
            </div> :
            <NotFound />
    )
}