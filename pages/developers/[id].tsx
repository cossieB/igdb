import mongoose from 'mongoose'
import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsResult } from 'next'
import Head from 'next/head'
import Description from '../../components/Description'
import GameTile from '../../components/GameTile'
import { DevDoc, Developers, DevWithId } from '../../models/developers'
import { GameDoc, GameWithId } from '../../models/game'
import styles from '../../styles/Devs.module.scss'
import { extract } from '../../utils/extractDocFields'

interface Props {
    dev: DevWithId,
    games: GameWithId[]
}

export default function DeveloperId({ dev, games }: Props) {
    return (
        <>
            <Head>
                <title> IGDB | {dev.name} </title>
            </Head>
            <div>
                <div className={styles.header} >
                    <img className={styles.logo} src={dev.logo} alt="" />
                </div>
                <div className={styles.main} >
                    <Description html={dev.summary} className={styles.description} />
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
    const devDoc = await Developers.findById(id).populate<{ games: GameDoc[] }>('games').lean().exec() as any as DevDoc

    if (!devDoc) {
        return {
            notFound: true
        }
    }
    const dev = extract(devDoc, ['name', 'location', 'logo', 'country', 'summary']) as DevWithId;

    const games = devDoc.games.map((item: any) => {
        let obj = extract(item, ['title', 'summary', 'cover', 'banner', 'genres']) as GameWithId
        obj.id = item._id.toString()
        obj.releaseDate = item.releaseDate.toString()
        return obj
    })

    return {
        props: {
            dev,
            games
        },
        revalidate: 3600
    }
}
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    await mongoose.connect(process.env.MONGO_URI!)
    let devs = await Developers.find().exec()

    let paths = devs.map(dev => ({
        params: { id: dev.id }
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}