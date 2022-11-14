import { Game } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GameTile from "../../components/GameTile";
import styles from '../../styles/Games.module.scss'
import titleCase from "../../utils/titleCase";

type T = Pick<Game, 'title' | 'cover' | 'releaseDate' | 'gameId'>;

export default function SearchByTag() {
    const [games, setGames] = useState<T[]>([])
    const router = useRouter()
    const { tag } = router.query as {tag: string}
    useEffect(() => {
        (async function () {
            if (tag == undefined) return;
            document.title = `IGDB | Genre | ${titleCase(tag)}`
            const data = await (await fetch(`/api/search/tag/${tag}`)).json()
            setGames(data)
        })()
    }, [tag])
    return (
        <div className={styles.games}>
            {games.map(game =>
                <GameTile
                    game={game}
                    key={game.gameId}
                    className={styles.tile}
                />
            )}
        </div>
    )
}