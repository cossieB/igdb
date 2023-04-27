import styles from '../../styles/Pubs.module.scss';
import DevTile from "../../components/DevTile";
import { db } from "../../prisma/db";

export default async function PublisherIndex() {
    const pubs = await getData()
    return (
        <div className={styles.logos} >
            {pubs.map(pub => <DevTile key={pub.publisherId} className={styles.tile} href="publisher" item={{...pub, id: pub.publisherId}}  /> )}
        </div>
    )
}

export async function getData() {
    return await db.publisher.findMany()
}