import GameTile, { GameGrid } from '../../components/GameTile';
import { db } from '../../prisma/db';
import styles from '../../styles/Games.module.scss'

export const metadata = {
    title: "Games"
}

export const revalidate = 3600;

export default async function GamesIndex() {
    const games = await getData()
    return <GameGrid className={styles.tile} games={games} />
}

async function getData() {
    return await db.game.findMany()
}
