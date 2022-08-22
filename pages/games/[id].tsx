import { Developer, Game, GamesOnPlatforms, Platform, Publisher } from '@prisma/client'
import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsResult } from 'next'
import Head from 'next/head'
import Description from '../../components/Description'
import DevTile from '../../components/DevTile'
import Tags from '../../components/Tags'
import { prisma } from '../../prisma/db'
import styles from '../../styles/Games.module.scss'

interface Props {
    game: (Game & {
        developer: Developer;
        publisher: Publisher;
        GamesOnPlatforms: (GamesOnPlatforms & {
            platform: Platform;
        })[];
    })
}

export default function GameId({game}: Props) {
    return (
        <>
        <Head>
            <title> IGDB | {game.title} </title>
        </Head>
        <div>
            <div className={styles.header} >
                <img className={styles.boxart} src={game.cover} alt="" />
                <div className={`${styles.title} hero`} style={{backgroundImage: `url(${game.banner || '/images/image1.jpg'})`}} >
                    <h1> {game.title} </h1>
                </div>
            </div>

            <div className={styles.main} >
                <div className={styles.infobar}>
                    <div className={styles.date} >
                        <div> {new Date(game.releaseDate).toLocaleString('en-za', {dateStyle: 'full'}).split(',')[0]  } </div>
                        <div> {new Date(game.releaseDate).getDate()} </div>
                        <div> {new Date(game.releaseDate).toLocaleString('en-za', {month: 'short'})} </div>
                        <div> {new Date(game.releaseDate).getFullYear()} </div>
                    </div>
                    <Tags tags={game.genres} />
                </div>
                <Description className={styles.description} html={game.summary} />
            </div>
            { game.trailer && <div className={styles.video} dangerouslySetInnerHTML={{__html: game.trailer}} /> }
            <div className={styles.companies} >
                <DevTile className={styles.logoTile} href="developers" item={{...game.developer, id: game.developer.developerId}}  />
                <DevTile className={styles.logoTile} href="publishers" item={{...game.publisher, id: game.publisher.publisherId}} />
            </div>
            <div className={styles.platforms} >
                {game.GamesOnPlatforms.map(item => <DevTile key={item.platform.platformId} item={{...item.platform, id: item.platformId}} href="platforms" className={styles.logoTile} />)}
            </div> 
        </div>
        </>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
    const id = context.params!.id as string
    const game = await prisma.game.findUnique({
        where: {
            gameId: id
        },
        include: {
            developer: true,
            publisher: true,
            GamesOnPlatforms: {
                include: {
                    platform: true
                }
            }
        }
    })
    if (!game) {
        return {
            notFound: true
        }
    }    

    return {
        props: {
            game: JSON.parse(JSON.stringify(game))
        },
        revalidate: 3600
    }
}
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    const games = await prisma.game.findMany()

    let paths = games.map(game => ({
        params: {id: game.gameId}
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}