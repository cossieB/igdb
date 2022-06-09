import mongoose from 'mongoose'
import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsResult } from 'next'
import Head from 'next/head'
import Description from '../../components/Description'
import GameTile from '../../components/GameTile'
import { GameWithId, GameDoc } from '../../models/game'
import { PubDoc, Publishers, PubWithId } from '../../models/publisher'
import styles from '../../styles/Pubs.module.scss'
import {  extract } from '../../utils/extractDocFields'

interface Props {
    pub: PubWithId,
    games: GameWithId[]
}

export default function PublisherId({ pub, games }: Props) {
    return (
        <>
        <Head>
            <title> IGDB | {pub.name} </title>
        </Head>
        <div>
            <div className={styles.header} >
                <img className={styles.logo} src={pub.logo} alt="" />
            </div>
            <div className={styles.main} >
                <Description html={pub.summary} className={styles.description} />
            </div>
            <div className={styles.gamegrid}>
                {games.map(game => <GameTile key={game.id} game={game} className="" />)}
            </div>
        </div>
        </>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
    await mongoose.connect(process.env.MONGO_URI!)
    const id = context.params!.id as string
    const pubDoc = await Publishers.findById(id).populate<{ games: GameDoc[] }>('games').lean().exec() as any as PubDoc

    if (!pubDoc) {
        return {
            notFound: true
        }
    }
    const pub = extract(pubDoc, ['name', 'headquarters', 'logo', 'country', 'summary']) as PubWithId;

    const games = pubDoc.games.map((item: any) => {
        let obj = extract(item, ['title', 'summary', 'cover', 'banner', 'genres']) as GameWithId
        obj.id = item._id.toString()
        obj.releaseDate = item.releaseDate.toString()
        return obj
    })

    return {
        props: {
            pub,
            games
        },
        revalidate: 3600
    }
}
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    await mongoose.connect(process.env.MONGO_URI!)
    let pubs = await Publishers.find().exec()

    let paths = pubs.map(dev => ({
        params: { id: dev.id }
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}