import { GetStaticPropsResult } from "next";
import styles from '../../styles/Pubs.module.scss'
import DevTile from "../../components/DevTile";
import Head from "next/head";
import { prisma } from "../../prisma/db";
import { Publisher } from "@prisma/client";

interface Props {
    pubs: Publisher[]
}

export default function PublisherIndex({ pubs }: Props) {
    return (
        <>
        <Head>
            <title> IGDB | Publishers </title>
        </Head>
        <div className={styles.logos} >
            {pubs.map(pub => <DevTile key={pub.publisherId} className={styles.tile} href="publishers" item={{...pub, id: pub.publisherId}}  /> )}
        </div>
        </>
    )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
    const pubs = await prisma.publisher.findMany()
    return {
        props: {
            pubs
        }
    }
}