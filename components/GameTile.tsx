import { Game } from "@prisma/client"
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
                <a><img src={game.cover} alt={`${game.title} Cover Image`} /></a>
            </Link>
        </div>
    )
}