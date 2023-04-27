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

export default async function SearchPage({searchParams}: Props) {
    const text = searchParams.q
    if (!text) return notFound()
    const [games, devs, pubs] = [getGames(text), getDevs(text), getPubs(text)]

    return (
        <div>
                <Suspense fallback={<Spinner />}>
                    <Header heading="Games" />
                    {/* @ts-expect-error Server Component */}
                    <GamesStreaming className={styles.games} promise={games} />
                </Suspense>
                <Suspense fallback={<Spinner />}>
                    <Header heading="Developers" />
                    {/* @ts-expect-error Server Component */}
                    <DevsStreaming className={styles.logos} promise={devs} href="developer" />
                </Suspense>
                <Suspense fallback={<Spinner />}>
                    <Header heading="Publishers" />
                    {/* @ts-expect-error Server Component */}
                    <DevsStreaming className={styles.logos} promise={pubs} href="publisher" />
                </Suspense>
        </div>
    )
}
function wait(delay = 1000): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, delay)
    })
}
async function getGames(text: string) {
    await wait(1000)
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
    await wait(2000)
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
    await wait(5000)
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