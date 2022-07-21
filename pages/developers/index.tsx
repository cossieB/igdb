import mongoose from 'mongoose';
import { GetStaticPropsResult } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import DevTile from '../../components/DevTile';
import { DevWithId, Developers } from '../../models/developers';
import styles from '../../styles/Devs.module.scss'
import { extractDevFields } from '../../utils/extractDocFields';


interface Props {
    devs: DevWithId[]
}

export default function DeveloperIndex({ devs }: Props) {
    return (
        <>
        <Head>
            <title> IGDB | Developers </title>
        </Head>
        <div className={styles.logos} >
            {devs.map(dev => <DevTile key={dev.id} className={styles.tile} href={'developers'} item={dev} /> )}
        </div>
        </>
    )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
    await mongoose.connect(process.env.MONGO_URI!)
    const queryRes = await Developers.find().exec();

    const devs: DevWithId[] = []
    for (let item of queryRes) {
        const dev = extractDevFields(item)
        devs.push(dev);
    }
    return {
        props: {
            devs
        }
    }
}