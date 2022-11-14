import { Game } from '@prisma/client';
import { GetStaticPropsResult } from 'next';
import Head from 'next/head';
import GameTile from '../../components/GameTile';
import { db } from '../../prisma/db';
import styles from '../../styles/Games.module.scss'

interface Props {
    games: Game[]
}

export default function GamesIndex({ games }: Props) {
    return (
        <>
            <Head>
                <title> IGDB | Games </title>
            </Head>
            <div className={styles.games} >
                {games.map(game => <GameTile key={game.gameId} className={styles.tile} game={game} />)}
            </div>
        </>
    )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
    const games = await db.game.findMany()

    return {
        props: {
            games: JSON.parse(JSON.stringify(games))
        },
        revalidate: 3600
    }
}