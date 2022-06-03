import mongoose from "mongoose";
import { GetStaticPropsResult } from "next";
import Link from "next/link";
import { PubWithId, Publishers } from "../../models/publisher";
import { extractPubFields } from "../../utils/extractDocFields";
import styles from '../../styles/Pubs.module.scss'

interface Props {
    pubs: PubWithId[]
}

export default function PublisherIndex({ pubs }: Props) {
    return (
        <div className={styles.container} >
            {pubs.map(pub => (
                <Link href={`publishers/${pub.id}`} key={`${pub.name}`} >
                    <a>
                        <div className={styles.tile}  >
                            <img src={pub.logo} alt={`${pub.name} Logo`} />
                        </div>
                    </a>
                </Link>
            ))}
        </div>
    )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
    await mongoose.connect(process.env.MONGO_URI!)
    const queryRes = await Publishers.find().exec();

    const pubs: PubWithId[] = []
    for (let item of queryRes) {
        const pub = extractPubFields(item)
        pubs.push(pub);
    }
    return {
        props: {
            pubs
        }
    }
}