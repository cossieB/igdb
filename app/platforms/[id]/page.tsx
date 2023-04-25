import { Metadata } from 'next'
import Description from '../../../components/Description'
import { db } from '../../../prisma/db'
import styles from '/styles/Platforms.module.scss'
import { notFound } from 'next/navigation'

export const revalidate = 3600;

type Props = {
    params: {
        id: string
    }
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {name: title} = (await getStaticProps({params})).pform
    return {
        title
    }
}

export default async function PlatformId({ params }: Props) {
    const { pform } = await getStaticProps({ params })
    return (
        <div>
            <div className={styles.header} >
                <img className={styles.logo} src={pform.logo} alt="" />
            </div>
            <div className={styles.main} >
                <Description html={pform.summary} className={styles.description} />
            </div>
        </div>
    )
}

async function getStaticProps({ params }: Props) {
    const id = params.id
    const pform = await db.platform.findUnique({
        where: {
            platformId: id
        }
    })

    if (!pform) return notFound()

    return {
        pform
    }
}
export async function generateStaticParams() {
    let pforms = await db.platform.findMany()
    return pforms.map(pform => ({
        id: pform.platformId
    }))
}