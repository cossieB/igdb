import { Metadata } from 'next'
import Description from '../../../components/Description'
import DevTile from '../../../components/DevTile'
import Tags from '../../../components/Tags'
import { db } from '../../../prisma/db'
import styles from '../../../styles/Games.module.scss'
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
    const { game } = await getData({ params });

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
                    <Tags isLink={true} tags={game.GenresOfGames.map(item => item.genre)} />
                </div>
                <Description className={styles.description} html={game.summary} />
            </div>
            {game.ActorsInGames.length > 0 && (
                <>
                    <Header heading='Cast' />
                    <div className={styles.cast}>
                        {game.ActorsInGames.map(item =>
                            <div className={styles.actorCard} key={item.actorId}>
                                <img src={item.actor.photo ?? "https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg"} alt={item.actor.name} />
                                <div>
                                    <span>{item.actor.name}</span> <br />
                                    <span className={styles.char} >{item.character}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
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
                {game.GamesOnPlatforms.map(item => <DevTile key={item.platformId} item={{ ...item.platform, id: item.platformId }} href="platform" className={styles.logoTile} />)}
            </div>
        </div>
    )
}

async function getData({ params }: Props) {
    const id = params.id;

    if (id.length != 36)
        return notFound()

    const game = await db.game.findUnique({
        where: {
            gameId: params.id
        },
        include: {
            developer: true,
            publisher: true,
            ActorsInGames: {
                include: {
                    actor: true
                },
                orderBy: {
                    importance: 'asc'
                }
            },
            GamesOnPlatforms: {
                include: {
                    platform: true
                }
            },
            GenresOfGames: true,
        }
    })

    if (!game)
        return notFound()


    return {
        game,
    }
}
export async function generateStaticParams() {
    const games = await db.game.findMany()
    return games.map(game => ({
        id: game.gameId
    }))
}
