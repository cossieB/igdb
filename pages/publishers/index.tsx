import mongoose from "mongoose";
import { GetStaticPropsResult } from "next";
import Link from "next/link";
import { PubWithId, Publishers } from "../../models/publisher";
import { extractPubFields } from "../../utils/extractDocFields";
import styles from '../../styles/Pubs.module.scss'
import DevTile from "../../components/DevTile";

interface Props {
    pubs: PubWithId[]
}

export default function PublisherIndex({ pubs }: Props) {
    return (
        <div className={styles.container} >
            {pubs.map(pub => <DevTile key={pub.id} className={styles.tile} href="publishers" item={pub}  /> )}
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