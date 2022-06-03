import mongoose from 'mongoose'
import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPathsResult } from 'next'
import { useState } from 'react'
import Description from '../../components/Description'
import Textarea from '../../components/Texarea'
import { Developers, DevWithId } from '../../models/developers'
import styles from '../../styles/Devs.module.scss'
import { extractDevFields, extractGameFields } from '../../utils/extractDocFields'

interface Props {
    dev: DevWithId
}

export default function DeveloperId({dev}: Props) {
    const [summary, setSummary] = useState(dev.summary)
    return (
        <div>
            <div className={styles.header} >
                <img className={styles.logo} src={dev.logo} alt="" />
            </div>

            <div className={styles.main} >
                <Description html={dev.summary} className={styles.description}  />
            </div>
            
        </div>
    )
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> {
    await mongoose.connect(process.env.MONGO_URI!)
    const id = context.params!.id as string
    const devDoc = await Developers.findById(id)

    if (!devDoc) {
        return {
            notFound: true
        }
    }
    const dev = extractDevFields(devDoc)

    return {
        props: {
            dev
        },
        revalidate: 3600
    }
}
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
    await mongoose.connect(process.env.MONGO_URI!)
    let devs = await Developers.find().exec()

    let paths = devs.map(dev => ({
        params: {id: dev.id}
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}