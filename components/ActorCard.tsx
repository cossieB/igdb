import Link from 'next/link';
import styles from '../styles/Games.module.scss';

export function ActorCard({ item }: { item: { actor: { actorId: string; name: string; photo: string | null; summary: string | null; }; } & { actorId: string; gameId: string; character: string; importance: number; characterId: string; }; }) {
    return (
        <Link href={`/actors/${item.actorId}`} key={item.actorId}>
            <div className={styles.actorCard}>
                <div className={styles.imgContainer}>
                    <img src={item.actor.photo ?? "https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg"} alt={item.actor.name} />
                </div>
                <div>
                    <span>{item.actor.name}</span> <br />
                    <span className={styles.char}>{item.character}</span>
                </div>
            </div>
        </Link>
    );
}
