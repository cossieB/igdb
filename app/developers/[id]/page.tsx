import { Metadata } from 'next/types'
import Description from '../../../components/Description'
import GameTile from '../../../components/GameTile'
import { db } from '../../../prisma/db'
import styles from '/styles/Devs.module.scss'
import { notFound } from 'next/navigation'

export const revalidate = 3600;

type Props = {
    params: {
        id: string
    }
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {name: title} = (await getData({params})).dev
    return {
        title
    }
}

export default async function DeveloperId({ params }: Props) {
    const { dev } = await getData({ params })
    return (
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
    )
}

async function getData({ params }: Props) {
    const id = params.id
    const dev = await db.developer.findUnique({
        where: {
            developerId: id
        },
        include: {
            Game: true
        }
    })

    if (!dev) return notFound()

    return {
        dev
    }
}
export async function generateStaticParams() {
    let devs = await db.developer.findMany()
    return devs.map(dev => ({
        id: dev.developerId
    }))
}