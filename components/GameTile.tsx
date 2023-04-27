import Link from "next/link"
import { GamePick } from "../utils/customTypes"
import styles from './../styles/Games.module.scss'

interface Props {
    game: GamePick,
    className?: string
}

export default function GameTile({ game, className }: Props) {
    return (
        <div className={className || styles.tile} key={`${game.title}${game.releaseDate.toString()}`} title={game.title} >
            <Link href={`/games/${game.gameId}`} >
                <img src={game.cover} loading="lazy" alt={`${game.title} Cover Image`} />
            </Link>
        </div>
    )
}

export async function GamesStreaming({ promise, className }: { promise: Promise<GamePick[]>, className: string }) {
    const games = await promise;
    return (
        <div className={className}>
            {games.map(game =>
                <GameTile
                    game={game}
                    key={game.gameId}
                />
            )}
        </div>
    )
}

