import DevTile from '../../components/DevTile';
import { db } from '../../prisma/db';
import styles from '../../styles/Devs.module.scss';

export const metadata = {
    title: "Developers"
}

export const revalidate = 3600;

export default async function DeveloperIndex() {
    const devs = await getData()
    return (
        <div className={styles.logos} >
            {devs.map(dev => <DevTile key={dev.developerId} className={styles.tile} href={'developers'} item={{ ...dev, id: dev.developerId }} />)}
        </div>
    )
}

export async function getData() {
    return await db.developer.findMany();
}