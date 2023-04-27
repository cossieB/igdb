import GameTile from '../../components/GameTile';
import { db } from '../../prisma/db';
import styles from '../../styles/Games.module.scss'

export const metadata = {
    title: "Games"
}

export const revalidate = 3600;

export default async function GamesIndex() {
    const games = await getData()
    return (
        <div className={styles.games} >
            {games.map(game => <GameTile key={game.gameId} className={styles.tile} game={game} />)}
        </div>
    )
}

export async function getData() {
    return await db.game.findMany()
}