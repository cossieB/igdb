import { Platform } from '@prisma/client'
import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsResult } from 'next'
import Head from 'next/head'
import Description from '../../components/Description'
import { db } from '../../prisma/db'
import styles from '../../styles/Platforms.module.scss'

interface Props {
    platform: Platform,
}

export default function DeveloperId({ platform }: Props) {
    return (
        <>
            <Head>
                <title> IGDB | {platform.name} </title>
            </Head>
            <div>
                <div className={styles.header} >
                    <img className={styles.logo} src={platform.logo} alt="" />
                </div>
                <div className={styles.main} >
                    <Description html={platform.summary} className={styles.description} />
                </div>
            </div>
        </>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
    const id = context.params!.id as string
    const platform = await db.platform.findUnique({
        where: {
            platformId: id
        }
    })

    if (!platform) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            platform: JSON.parse(JSON.stringify(platform))
        },
        revalidate: 3600
    }
}
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    let platforms = await db.platform.findMany()

    let paths = platforms.map(item => ({
        params: { id: item.platformId }
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}