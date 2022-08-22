import { Game } from "@prisma/client"
import Link from "next/link"

interface Props {
    game: Pick<Game, 'title' | 'cover' | 'releaseDate' | 'gameId'>,
    className: string
}

export default function GameTile({ game, className }: Props) {
    return (
        <div className={className} key={`${game.title}${game.releaseDate.toString()}`} title={game.title} >
            <Link href={`/games/${game.gameId}`} >
                <a><img src={game.cover} alt={`${game.title} Cover Image`} /></a>
            </Link>
        </div>
    )
}