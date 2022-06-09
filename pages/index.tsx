import mongoose from 'mongoose'
import { GetStaticPropsResult } from 'next'
import Carousel from '../components/Carousel'
import DevTile from '../components/DevTile'
import GameTile from '../components/GameTile'
import { Developers, DevWithId } from '../models/developers'
import { Games, GameWithId } from '../models/game'
import { Platforms, PlatformWithId } from '../models/platform'
import { Publishers, PubWithId } from '../models/publisher'
import styles from '../styles/Home.module.scss'
import { extract } from '../utils/extractDocFields'

interface Props {
    games: GameWithId[],
    devs: DevWithId[],
    pubs: PubWithId[],
    platforms: PlatformWithId[]
}

export default function Home({ games, devs, pubs, platforms }: Props) {
    return (
        <div>
            <Carousel />
            <h1 className={styles.h1} > <span>The</span> <span>Internet</span> <span >Games</span> <span >Database</span></h1>
            <div className={styles.games} >
                {games.map(item => <GameTile key={item.id} game={item} className="" />)}
            </div>
            <div className={styles.header} >
                <h2>Developers</h2>
                <div className={styles.line} ></div>
            </div>
            <div className={styles.logos}>
                {devs.map(dev => <DevTile key={dev.id} className={styles.tile} href={'developers'} item={dev} />)}
            </div>
            
            <div className={styles.header} >
                <h2>Publishers</h2>
                <div className={styles.line} ></div>
            </div>
            <div className={styles.logos}>
                {pubs.map(pub => <DevTile key={pub.id} className={styles.tile} href="publishers" item={pub} />)}
            </div>

            <div className={styles.header} >
                <h2>Platforms</h2>
                <div className={styles.line} ></div>
            </div>
            <div className={styles.logos}>
                {platforms.map(pform => <DevTile key={pform.id} className={styles.tile} href="platforms" item={pform} />)}
            </div>
        </div>
    )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
    await mongoose.connect(process.env.MONGO_URI!)
    const gamesQuery = Games.find().limit(14).exec();
    const devsQuery = Developers.find().limit(20).exec();
    const pubsQuery = Publishers.find().limit(10).exec();
    const platformQuery = Platforms.find().exec();

    const [gamesDoc, devsDoc, pubsDoc, platformsDoc] = await Promise.all([gamesQuery, devsQuery, pubsQuery, platformQuery]) as [GameWithId[], DevWithId[], PubWithId[], PlatformWithId[]]
    const games = gamesDoc.map(item => {
        let obj = extract(item, ['cover', 'id', 'title'])
        obj.releaseDate = item.releaseDate.toString();
        return obj
    })
    const devs = devsDoc.map(item => extract(item, ['logo', 'id', 'name']))
    const pubs = pubsDoc.map(item => extract(item, ['logo', 'id', 'name']))
    const platforms = platformsDoc.map(item => extract(item, ['id', 'logo', 'name']))

    return {
        props: {
            games,
            devs,
            pubs,
            platforms
        }
    }
}