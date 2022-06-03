import mongoose from 'mongoose'
import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsResult } from 'next'
import { useState } from 'react'
import Description from '../../components/Description'
import { Publishers, PubWithId } from '../../models/publisher'
import styles from '../../styles/Pubs.module.scss'
import {  extractPubFields } from '../../utils/extractDocFields'

interface Props {
    pub: PubWithId
}

export default function PublisherId({pub}: Props) {
    const [summary, setSummary] = useState(pub.summary)
    return (
        <div>
            <div className={styles.header} >
                <img className={styles.logo} src={pub.logo} alt="" />
            </div>

            <div className={styles.main} >
                <Description html={pub.summary} className={styles.description} />
            </div>
        </div>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
    await mongoose.connect(process.env.MONGO_URI!)
    const id = context.params!.id as string
    const doc = await Publishers.findById(id)

    if (!doc) {
        return {
            notFound: true
        }
    }
    const pub = extractPubFields(doc)

    return {
        props: {
            pub
        },
        revalidate: 3600
    }
}
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    await mongoose.connect(process.env.MONGO_URI!)
    let pubs = await Publishers.find().exec()

    let paths = pubs.map(pub => ({
        params: {id: pub.id}
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}