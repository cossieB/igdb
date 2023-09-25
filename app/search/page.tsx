import styles from "/styles/Search.module.scss"
import { db } from "../../prisma/db";
import { GamePick } from "../../utils/customTypes";
import Header from "../../components/Header";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Spinner } from "../../components/Loading/Spinner";
import { GamesStreaming } from "../../components/GameTile";
import { DevsStreaming } from "../../components/DevTile";

export const dynamic = 'force-dynamic'

type Props = {
    searchParams: {
        q: string
    }
}

export default async function SearchPage({ searchParams }: Props) {
    const text = searchParams.q
    if (!text) return notFound()
    const [games, devs, pubs] = [getGames(text), getDevs(text), getPubs(text)]

    return (
        <div>
            <Suspense fallback={<Spinner />}>
                <Header heading="Games" />
                <GamesStreaming className={styles.games} promise={games} />
            </Suspense>
            <Suspense fallback={<Spinner />}>
                <Header heading="Developers" />
                <DevsStreaming className={styles.logos} promise={devs} href="developer" />
            </Suspense>
            <Suspense fallback={<Spinner />}>
                <Header heading="Publishers" />
                <DevsStreaming className={styles.logos} promise={pubs} href="publisher" />
            </Suspense>
        </div>
    )
}

async function getGames(text: string) {
    return await db.$queryRaw`
        SELECT
            DISTINCT("gameId"),title, cover, "releaseDate"
        FROM "Game"
        JOIN "GenresOfGames" USING ("gameId")
        WHERE
            title ILIKE ${`%${text}%`} OR
            genre ILIKE ${`%${text}%`};
    ` as GamePick[]
}

async function getDevs(text: string) {
    return await db.developer.findMany({
        where: {
            OR: [{
                name: {
                    contains: text,
                    mode: 'insensitive'
                }
            }, {
                summary: {
                    contains: text,
                    mode: 'insensitive'
                }
            }]
        },
        select: {
            name: true,
            logo: true,
            developerId: true
        }
    })
}

async function getPubs(text: string) {
    return await db.publisher.findMany({
        where: {
            OR: [{
                name: {
                    contains: text,
                    mode: 'insensitive'
                }
            }, {
                summary: {
                    contains: text,
                    mode: 'insensitive'
                }
            }]
        },
        select: {
            name: true,
            logo: true,
            publisherId: true
        }
    })
}