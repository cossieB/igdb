import { Metadata } from 'next'
import Description from '../../../components/Description'
import GameTile, { GameGrid } from '../../../components/GameTile'
import { db } from '../../../prisma/db'
import styles from '/styles/Pubs.module.scss'
import { notFound } from 'next/navigation'

export const revalidate = 3600;

type Props = {
    params: {
        id: string
    }
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {name: title} = (await getData({params})).pub
    return {
        title
    }
}

export default async function PublisherId({ params }: Props) {
    const { pub } = await getData({ params })
    return (
        <div>
            <div className={styles.header} >
                <img className={styles.logo} src={pub.logo} alt="" />
            </div>
            <div className={styles.main} >
                <Description html={pub.summary} className={styles.description} />
            </div>
            <GameGrid games={pub.Game} />
        </div>
    )
}

async function getData({ params }: Props) {
    const id = params.id
    const pub = await db.publisher.findUnique({
        where: {
            publisherId: id
        },
        include: {
            Game: true
        }
    })

    if (!pub) return notFound()

    return {
        pub
    }
}
export async function generateStaticParams() {
    let pubs = await db.publisher.findMany()
    return pubs.map(pub => ({
        id: pub.publisherId
    }))
}