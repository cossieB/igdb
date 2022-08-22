import { Developer } from '@prisma/client';
import { GetStaticPropsResult } from 'next';
import Head from 'next/head';
import DevTile from '../../components/DevTile';
import { prisma } from '../../prisma/db';
import styles from '../../styles/Devs.module.scss'

interface Props {
    devs: Developer[]
}

export default function DeveloperIndex({ devs }: Props) {
    return (
        <>
        <Head>
            <title> IGDB | Developers </title>
        </Head>
        <div className={styles.logos} >
            {devs.map(dev => <DevTile key={dev.developerId} className={styles.tile} href={'developers'} item={{...dev, id: dev.developerId}} /> )}
        </div>
        </>
    )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
    const devs = await prisma.developer.findMany();

    return {
        props: {
            devs
        }
    }
}