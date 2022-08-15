import mongoose from 'mongoose'
import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsResult } from 'next'
import Head from 'next/head'
import Description from '../../components/Description'
import { Platforms, PlatformWithId } from '../../models/platform'
import styles from '../../styles/Platforms.module.scss'
import {  extract } from '../../utils/extractDocFields'

interface Props {
    pform: PlatformWithId,
}

export default function DeveloperId({ pform }: Props) {
    return (
        <>
        <Head>
            <title> IGDB {pform.name} </title>
        </Head>
        <div>
            <div className={styles.header} >
                <img className={styles.logo} src={pform.logo} alt="" />
            </div>
            <div className={styles.main} >
                <Description html={pform.summary} className={styles.description} />
            </div>
        </div>
        </>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
    await mongoose.connect(process.env.MONGO_URI!)
    const id = context.params!.id as string
    const pformDoc = await Platforms.findById(id).lean().exec().catch(() => null)

    if (!pformDoc) {
        return {
            notFound: true
        }
    }
    const pform = extract(pformDoc, ['name', 'logo', 'summary']) as PlatformWithId;


    return {
        props: {pform},
        revalidate: 3600
    }
}
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    await mongoose.connect(process.env.MONGO_URI!)
    let platforms = await Platforms.find().exec()

    let paths = platforms.map(dev => ({
        params: { id: dev.id }
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}