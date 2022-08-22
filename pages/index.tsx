import { Developer, Game, Platform, PrismaClient, Publisher } from '@prisma/client'
import { GetStaticPropsResult } from 'next'
import Carousel from '../components/Carousel'
import DevTile from '../components/DevTile'
import GameTile from '../components/GameTile'
import { prisma } from '../prisma/db'
import styles from '../styles/Home.module.scss'

interface Props {
    games: Game[],
    devs: Developer[],
    pubs: Publisher[],
    platforms: Platform[]
}

export default function Home({ games, devs, pubs, platforms }: Props) {
    return (
        <div>
            <Carousel />
            <h1 className={styles.h1} > <span>The</span> <span>Internet</span> <span >Games</span> <span >Database</span></h1>
            <div className={styles.games} >
                {games.map(item => <GameTile key={item.gameId} game={item} className="" />)}
            </div>
            <div className={styles.header} >
                <h2>Developers</h2>
                <div className={styles.line} ></div>
            </div>
            <div className={styles.logos}>
                {devs.map(dev => <DevTile key={dev.developerId} className={styles.tile} href={'developers'} item={{...dev, id: dev.developerId}} />)}
            </div>
            
            <div className={styles.header} >
                <h2>Publishers</h2>
                <div className={styles.line} ></div>
            </div>
            <div className={styles.logos}>
                {pubs.map(pub => <DevTile key={pub.publisherId} className={styles.tile} href="publishers" item={{...pub, id: pub.publisherId}} />)}
            </div>

            <div className={styles.header} >
                <h2>Platforms</h2>
                <div className={styles.line} ></div>
            </div>
            <div className={styles.logos}>
                {platforms.map(pform => <DevTile key={pform.platformId} className={styles.tile} href="platforms" item={{...pform, id: pform.platformId}} />)}
            </div>
        </div>
    )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
    const gamesQuery = prisma.game.findMany({take: 14});
    const devsQuery = prisma.developer.findMany({take: 20});
    const pubsQuery = prisma.publisher.findMany({take: 20});
    const platformQuery = prisma.platform.findMany();

    const [games, devs, pubs, platforms] = await Promise.all([gamesQuery, devsQuery, pubsQuery, platformQuery]) as [Game[], Developer[], Publisher[], Platform[]]

    return {
        props: {
            games: JSON.parse(JSON.stringify(games)),
            devs,
            pubs,
            platforms: JSON.parse(JSON.stringify(platforms))
        }
    }
}