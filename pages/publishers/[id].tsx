import { Game, Publisher } from '@prisma/client'
import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsResult } from 'next'
import Head from 'next/head'
import Description from '../../components/Description'
import GameTile from '../../components/GameTile'
import { db } from '../../prisma/db'
import styles from '../../styles/Pubs.module.scss'

interface Props {
    pub: (Publisher & {
        Game: Game[];
    }),
}

export default function PublisherId({ pub }: Props) {
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
                {pub.Game.map(game => <GameTile key={game.gameId} game={game} className="" />)}
            </div>
        </div>
        </>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
    const id = context.params!.id as string
    const pub = await db.publisher.findUnique({
        where: {
            publisherId: id
        },
        include: {
            Game: true
        }
    })

    if (!pub) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            pub: JSON.parse(JSON.stringify(pub))
        },
        revalidate: 3600
    }
}
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    let pubs = await db.publisher.findMany()

    let paths = pubs.map(pub => ({
        params: { id: pub.publisherId }
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}