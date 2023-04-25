import Link from "next/link";
import styles from './../styles/Devs.module.scss'

interface Props {
    item: {
        id: string,
        name: string,
        logo: string
    },
    className?: string,
    href: 'developers' | 'publishers' | 'platforms'
}

export default function DevTile({ item, className, href }: Props) {
    return (
        <Link href={`/${href}/${item.id}`} >
            <div className={className || styles.tile} key={`${item.name}`} >
                <img src={item.logo} alt={`${item.name} Logo`} />
            </div>
        </Link>
    )
}