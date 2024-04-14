import { notFound } from "next/navigation";
import { db } from "../../../prisma/db";
import Description from "../../../components/Description";
import styles from '../../../styles/Actor.module.scss'
import GameTile, { GameGrid } from "../../../components/GameTile";
import Header from "../../../components/Header";

type Props = {
    params: {
        id: string
    }
}

export default async function ActorPage({ params }: Props) {
    const actor = await getData({ params })
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
            <h1> {actor.name} </h1>
                <img src={actor.photo ?? "https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg"} alt={actor.name} />
            </div>
            <Description html={actor.summary ?? ""} className={styles.description} />
            <Header heading="Games" />
            <GameGrid games={actor.ActorsInGames.map(x => x.game)} />
        </div>
    )
}

async function getData(props: Props) {
    const { params: { id } } = props;
    if (id.length != 36)
        return notFound()

    const actor = await db.actor.findUnique({
        where: {
            actorId: id
        },
        include: {
            ActorsInGames: {
                include: {
                    game: true
                }
            }
        }
    })
    if (!actor)
        return notFound()

    return actor
}

export async function generateStaticParams() {
    const actors = await db.actor.findMany()
    return actors.map(actor => ({
        id: actor.actorId
    }))
}