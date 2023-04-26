import styles from '../../styles/Pubs.module.scss';
import DevTile from "../../components/DevTile";
import { db } from "../../prisma/db";

export default async function PublisherIndex() {
    const pubs = await getStaticProps()
    return (
        <div className={styles.logos} >
            {pubs.map(pub => <DevTile key={pub.publisherId} className={styles.tile} href="publishers" item={{...pub, id: pub.publisherId}}  /> )}
        </div>
    )
}

export async function getStaticProps() {
    return await db.publisher.findMany()
}