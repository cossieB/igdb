import mongoose from 'mongoose';
import { GetStaticPropsResult } from 'next';
import Link from 'next/link';
import { DevWithId, Developers } from '../../models/developers';
import styles from '../../styles/Devs.module.scss'
import { extractDevFields } from '../../utils/extractDocFields';


interface Props {
    devs: DevWithId[]
}

export default function DeveloperIndex({ devs }: Props) {
    return (
        <div className={styles.container} >
            {devs.map(dev => (
                <Link href={`developers/${dev.id}`} >
                    <a>
                        <div className={styles.tile} key={`${dev.name}`} >
                            <img src={dev.logo} alt={`${dev.name} Logo`} />
                        </div>
                    </a>
                </Link>
            ))}
        </div>
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