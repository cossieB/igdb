import mongoose from 'mongoose';
import { GetStaticPropsResult } from 'next';
import Link from 'next/link';
import { GameWithId, Games, GameDoc } from '../../models/game';
import styles from '../../styles/Games.module.scss'
import { extractGameFields, extract } from '../../utils/extractDocFields';

interface Props {
    games: GameWithId[]
}

export default function GamesIndex({ games }: Props) {
    return (
        <div className={styles.container} >
            {games.map(game => (
                <div className={styles.tile} key={`${game.title}${game.releaseDate.toString()}`} >
                    <Link href={`games/${game.id}`} >
                        <a><img src={game.cover} alt={`${game.title} Cover Image`} /></a>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
    await mongoose.connect(process.env.MONGO_URI!)
    const queryRes = await Games.find().exec() as GameDoc[] ;

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