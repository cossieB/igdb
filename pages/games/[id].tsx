import mongoose from 'mongoose'
import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsResult } from 'next'
import Description from '../../components/Description'
import { GameWithId, Games, GameDoc } from '../../models/game'
import styles from '../../styles/Games.module.scss'
import { extract } from '../../utils/extractDocFields'
import { formatDate } from '../../utils/formatDate'

interface Props {
    game: GameWithId
}

export default function GameId({game}: Props) {
    return (
        <div>
            <div className={styles.header} >
                <img className={styles.boxart} src={game.cover} alt="" />
                <div className={`${styles.title} hero`} style={{backgroundImage: `url(${game.banner || '/images/image1.jpg'})`}} >
                    <h1> {game.title} </h1>
                </div>
            </div>

            <div className={styles.main} >
                <Description className={styles.description} html={game.summary} />
                
            </div>
            
        </div>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
    await mongoose.connect(process.env.MONGO_URI!)
    const id = context.params!.id as string
    const gameDoc = await Games.findById(id) as GameDoc

    if (!gameDoc) {
        return {
            notFound: true
        }
    }
    const game = extract(gameDoc, ['title', 'summary', 'cover', 'banner', 'releaseDate']) as GameWithId
    game.releaseDate = formatDate(game.releaseDate)
    game.developer = extract(gameDoc.developer, ['name', 'logo'])
    game.publisher = extract(gameDoc.publisher, ['name', 'logo'])
    game.platforms = gameDoc.platforms.map(item => extract(item, ['name', 'logo']))

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