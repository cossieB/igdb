import Link from "next/link"
import { GameWithId } from "../models/game"

interface Props {
    game: Pick<GameWithId, 'title' | 'cover' | 'releaseDate' | 'id'>,
    className: string
}

export default function GameTile({ game, className }: Props) {
    return (
        <div className={className} key={`${game.title}${game.releaseDate.toString()}`} title={game.title} >
            <Link href={`/games/${game.id}`} >
                <a><img src={game.cover} alt={`${game.title} Cover Image`} /></a>
            </Link>
        </div>
    )
}