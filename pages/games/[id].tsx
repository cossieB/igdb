import { Developer, Game, Platform, Publisher } from '@prisma/client'
import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsResult } from 'next'
import Head from 'next/head'
import Description from '../../components/Description'
import DevTile from '../../components/DevTile'
import Tags from '../../components/Tags'
import { db } from '../../prisma/db'
import styles from '../../styles/Games.module.scss'
import { joinQuery } from '../../utils/JoinResult'
import { Optional } from '../../utils/utilityTypes'

type GameResult = (Game & {
    developer: Optional<Developer, 'country' | 'location' | 'summary'>;
    publisher: Optional<Publisher, 'country' | 'headquarters' | 'summary'>;
    platforms: Pick<Platform, 'platformId' | 'name' | 'logo'>[]
})

type Props = {
    game: GameResult,
    genres: string[]
}

export default function GameId({ game, genres }: Props) {
    return (
        <div className='container'>
            <Head>
                <title> IGDB | {game.title} </title>
            </Head>
            <div className={styles.header} >
                <img className={styles.boxart} src={game.cover} alt="" />
                <div className={`${styles.title} hero`} style={{ backgroundImage: `url(${game.banner || '/images/image1.jpg'})` }} >
                    <h1> {game.title} </h1>
                </div>
            </div>

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
            {game.trailer && <div className={styles.video} dangerouslySetInnerHTML={{ __html: game.trailer }} />}
            <div className={styles.companies} >
                <DevTile className={styles.logoTile} href="developers" item={{ ...game.developer, id: game.developer.developerId }} />
                <DevTile className={styles.logoTile} href="publishers" item={{ ...game.publisher, id: game.publisher.publisherId }} />
            </div>
            <div className={styles.platforms} >
                {game.platforms.map(item => <DevTile key={item.platformId} item={{ ...item, id: item.platformId }} href="platforms" className={styles.logoTile} />)}
            </div>
        </div>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
    const id = context.params!.id as string
    if (id.length != 36) return { notFound: true }

    const queryRes = await joinQuery(id)

    if (queryRes.length == 0) {
        return {
            notFound: true
        }
    }
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
        props: {
            game: JSON.parse(JSON.stringify(game)),
            genres
        },
        revalidate: 3600
    }
}
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const games = await db.game.findMany()

    let paths = games.map(game => ({
        params: { id: game.gameId }
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}