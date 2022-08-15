import mongoose from "mongoose";
import { GetStaticPropsResult } from "next";
import Link from "next/link";
import { PubWithId, Publishers } from "../../models/publisher";
import { extract, extractPubFields } from "../../utils/extractDocFields";
import styles from '../../styles/Pubs.module.scss'
import DevTile from "../../components/DevTile";
import Head from "next/head";

interface Props {
    pubs: PubWithId[]
}

export default function PublisherIndex({ pubs }: Props) {
    return (
        <>
        <Head>
            <title> IGDB | Publishers </title>
        </Head>
        <div className={styles.logos} >
            {pubs.map(pub => <DevTile key={pub.id} className={styles.tile} href="publishers" item={pub}  /> )}
        </div>
        </>
    )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
    await mongoose.connect(process.env.MONGO_URI!)
    const queryRes = await Publishers.find().exec();

    const pubs: PubWithId[] = []
    for (let item of queryRes) {
        const pub = extract(item, ['name', 'logo', 'id'])
        
        pubs.push((pub as PubWithId));
    }
    return {
        props: {
            pubs
        }
    }
}