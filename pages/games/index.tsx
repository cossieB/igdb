import mongoose from "mongoose"
import { GetStaticPathsResult, GetStaticPropsResult } from "next"
import { Games, IGame } from "../../models/game"
import styles from '../../styles/Games.module.scss'
import Image from 'next/image'
import Link from "next/link"

type TGame = IGame & { id: string }

interface Props {
    games: TGame[]
}

export default function GamesIndex({ games }: Props) {
    return (
        <div className={styles.container} >
            {games.map(game => (
                <div className={styles.tile} key={`${game.developer.name}${game.title}`} >
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
    const queryRes = await Games.find().exec();

    const games: TGame[] = []
    for (let item of queryRes) {
        const game: TGame = {
            id: item.id,
            title: item.title,
            cover: item.cover,
            developer: {
                name: item.developer.name,
                country: item.developer.country,
                location: item.developer.location,
                logo: item.developer.logo,
                summary: item.developer.summary,
                games: item.developer.games,
            },
            releaseDate: item.releaseDate instanceof Date ? item.releaseDate.toISOString() : item.releaseDate,
            genres: item.genres,
            cast: item.cast,
            summary: item.summary,
            platforms: item.platforms,
            images: item.images
        }
        if (item.publisher) {
            game.publisher = {
                name: item.publisher.name,
                country: item.publisher.country,
                headquarters: item.publisher.headquarters,
                logo: item.publisher.logo,
                summary: item.publisher.summary,
                games: item.publisher.games,
            }
        }
        games.push(game); 
    }

    // console.log(games[0])
    return {
        props: {
            games
        }
    }
}