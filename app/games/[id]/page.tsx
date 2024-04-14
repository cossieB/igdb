import { Developer, Game, Platform, Publisher } from '@prisma/client'
import { Metadata } from 'next'
import Description from '../../../components/Description'
import DevTile from '../../../components/DevTile'
import Tags from '../../../components/Tags'
import { Optional } from '../../../lib/utilityTypes'
import { db } from '../../../prisma/db'
import styles from '../../../styles/Games.module.scss'
import { joinQuery } from '../../../utils/JoinResult'
import { notFound } from 'next/navigation'
import YouTubeIframe from '../../../components/YouTubeIframe'
import Header from '../../../components/Header'
import { DevSvg, PubSvg } from '../../../utils/svgs'

type Props = {
    params: {
        id: string
    }
}
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { title } = (await getData({ params })).game
    return {
        title
    }
}

export default async function GameId({ params }: Props) {
    const { game, genres } = await getData({ params });

    return (
        <div className='container'>
            <div className={styles.header} >
                <img className={styles.boxart} src={game.cover} alt="" />
                <div className={`${styles.title} hero`} style={{ backgroundImage: `url(${game.banner || '/images/image1.jpg'})` }} >
                    <h1> {game.title} </h1>
                </div>
            </div>

                <Header heading='Info' />
            <div className={styles.main} >
                <div className={styles.infobar}>
                    <div className={styles.date} >
                        <div> {new Date(game.releaseDate).toLocaleString('en-za', { dateStyle: 'full' }).split(',')[0]} </div>
                        <div> {new Date(game.releaseDate).getDate()} </div>
                        <div> {new Date(game.releaseDate).toLocaleString('en-za', { month: 'short' })} </div>
                        <div> {new Date(game.releaseDate).getFullYear()} </div>
                    </div>
                    <Tags isLink={true} tags={genres} />
                </div>
                <Description className={styles.description} html={game.summary} />
            </div>
            <Header heading='Trailer' />
            <div className={styles.video} >
                <YouTubeIframe link={game.trailer} />
            </div>
            {game.images.length > 0 && <Header heading='Screenshots' />}
            <div className={styles.screens}>
                {game.images.map(item => (
                    <img key={item} src={item} alt="" />
                ))}
            </div>
            <Header heading='Companies' />
            <div className={styles.companies} >
                <DevTile className={styles.logoTile} href="developer" item={{ ...game.developer, id: game.developer.developerId }} icon={<DevSvg />} />
                <DevTile className={styles.logoTile} href="publisher" item={{ ...game.publisher, id: game.publisher.publisherId }} icon={<PubSvg />} />
            </div>
            <Header heading='Platforms' />
            <div className={styles.platforms} >
                {game.platforms.map(item => <DevTile key={item.platformId} item={{ ...item, id: item.platformId }} href="platform" className={styles.logoTile} />)}
            </div>
        </div>
    )
}

async function getData({ params }: Props) {
    const id = params.id;

    if (id.length != 36)
        return notFound()

    const queryRes = await joinQuery(id)

    if (queryRes.length == 0)
        return notFound()

    const platforms: Pick<Platform, 'platformId' | 'name' | 'logo'>[] = await db.$queryRaw`
        SELECT 
            "platformId", 
            "Platform".name , 
            "Platform".logo
        FROM 
            "Platform"
        INNER JOIN 
            "GamesOnPlatforms" USING ("platformId")
        INNER JOIN 
            "Game" USING ("gameId")
        WHERE "gameId" = ${id}::UUID;
        `
    type GameResult = (Game & {
        developer: Optional<Developer, 'country' | 'location' | 'summary'>;
        publisher: Optional<Publisher, 'country' | 'headquarters' | 'summary'>;
        platforms: Pick<Platform, 'platformId' | 'name' | 'logo'>[]
    })

    const game: GameResult = {
        banner: queryRes[0].banner,
        title: queryRes[0].title,
        cover: queryRes[0].cover,
        developerId: queryRes[0].developerId,
        publisherId: queryRes[0].publisherId,
        gameId: queryRes[0].gameId,
        images: queryRes[0].images,
        releaseDate: queryRes[0].releaseDate,
        summary: queryRes[0].summary,
        trailer: queryRes[0].trailer,
        platforms,
        developer: {
            developerId: queryRes[0].developerId,
            name: queryRes[0].dev_name,
            logo: queryRes[0].dev_logo,
        },
        publisher: {
            publisherId: queryRes[0].publisherId,
            name: queryRes[0].dev_name,
            logo: queryRes[0].pub_logo,
        }
    }
    const genresQuery = await db.genresOfGames.findMany({
        where: {
            gameId: game.gameId
        },
        select: {
            genre: true
        }
    })
    const genres = genresQuery.map(g => g.genre)

    return {
        game,
        genres
    }
}
export async function generateStaticParams() {
    const games = await db.game.findMany()
    return games.map(game => ({
        id: game.gameId
    }))
}
