import { Developer, Game } from '@prisma/client'
import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsResult } from 'next'
import Head from 'next/head'
import Description from '../../components/Description'
import GameTile from '../../components/GameTile'
import { prisma } from '../../prisma/db'
import styles from '../../styles/Devs.module.scss'
import { extract } from '../../utils/extractDocFields'

interface Props {
    dev: (Developer & {
        Game: Game[];
    })
}

export default function DeveloperId({ dev }: Props) {
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
                    {dev.Game.map(game => <GameTile key={game.gameId} game={game} className="" />)}
                </div>
            </div>
        </>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
    const id = context.params!.id as string
    const dev = await prisma.developer.findUnique({
        where: {
            developerId: id
        },
        include: {
            Game: true
        }
    })

    if (!dev) return { notFound: true }

    return {
        props: {
            dev: JSON.parse(JSON.stringify(dev))
        },
        revalidate: 3600
    }
}
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    let devs = await prisma.developer.findMany()

    let paths = devs.map(dev => ({
        params: { id: dev.developerId }
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}