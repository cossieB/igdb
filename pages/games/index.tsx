import mongoose from 'mongoose';
import { GetStaticPropsResult } from 'next';
import Head from 'next/head';
import GameTile from '../../components/GameTile';
import { GameWithId, Games, GameDoc } from '../../models/game';
import styles from '../../styles/Games.module.scss'
import { extract } from '../../utils/extractDocFields';

interface Props {
    games: GameWithId[]
}

export default function GamesIndex({ games }: Props) {
    return (
        <>
        <Head>
            <title> IGDB | Games </title>
        </Head>
        <div className={styles.container} >
            {games.map(game => <GameTile key={game.title + game.releaseDate.toString()} className={styles.tile} game={game} /> )}
        </div>
        </>
    )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
    await mongoose.connect(process.env.MONGO_URI!)
    const queryRes = await Games.find().exec() as GameDoc[];

    const games: GameWithId[] = []
    for (let item of queryRes) {
        const game = extract(item, ['title', 'cover', 'id', 'releaseDate'])
        game.releaseDate = game.releaseDate.toString()
        games.push(game as GameWithId);
    }

    return {
        props: {
            games
        }
    }
}