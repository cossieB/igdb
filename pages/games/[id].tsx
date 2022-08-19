import mongoose from 'mongoose'
import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsResult } from 'next'
import Head from 'next/head'
import Description from '../../components/Description'
import DevTile from '../../components/DevTile'
import Tags from '../../components/Tags'
import { DevWithId } from '../../models/developers'
import { GameWithId, Games } from '../../models/game'
import { PlatformWithId } from '../../models/platform'
import { PubWithId } from '../../models/publisher'
import styles from '../../styles/Games.module.scss'
import { extract } from '../../utils/extractDocFields'

interface Props {
    game: GameWithId
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
                <DevTile className={styles.logoTile} href="developers" item={game.developer as DevWithId} />
                <DevTile className={styles.logoTile} href="publishers" item={game.publisher as PubWithId} />
            </div>
            <div className={styles.platforms} >
                {game.platforms.map(item => <DevTile key={item.id} item={item as PlatformWithId} href="platforms" className={styles.logoTile} />)}
            </div> 
        </div>
        </>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
    await mongoose.connect(process.env.MONGO_URI!)
    const id = context.params!.id as string
    const gameDoc = await Games.findById(id).lean().exec().catch(() => null)

    if (!gameDoc) {
        return {
            notFound: true
        }
    }
    const game = extract(gameDoc, ['title', 'summary', 'cover', 'banner', 'releaseDate', 'genres']) as GameWithId
    game.releaseDate = game.releaseDate.toLocaleString()
    game.developer = extract(gameDoc.developer, ['name', 'logo'])
    game.developer.id = gameDoc.developer._id.toString();
    game.publisher = extract(gameDoc.publisher, ['name', 'logo'])
    game.publisher.id = gameDoc.publisher._id.toString();
    gameDoc.trailer && ( game.trailer = gameDoc.trailer )
    game.platforms = gameDoc.platforms.map(item => {
        let obj = extract(item, ['name', 'logo'])
        obj.id = item._id.toString();
        return obj
    })
    

    return {
        props: {
            game
        },
        revalidate: 3600
    }
}
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    await mongoose.connect(process.env.MONGO_URI!)
    let games = await Games.find().exec()

    let paths = games.map(game => ({
        params: {id: game.id}
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}