import Link from "next/link";
import styles from './../styles/Devs.module.scss'

interface Props {
    item: {
        id: string,
        name: string,
        logo: string
    },
    className?: string,
    href: 'developer' | 'publisher' | 'platform'
    icon?: JSX.Element
}

export default function DevTile({ item, className, href, icon }: Props) {
    return (
        <Link href={`/${href}s/${item.id}`} >
            <div className={`${className} ${styles.tile}`} key={`${item.name}`} >
                {icon}
                <img src={item.logo} alt={`${item.name} Logo`} />
            </div>
        </Link>
    )
}
type Item = ({ developerId: string } | { publisherId: string } | { platformId: string }) & {
    name: string,
    logo: string
}

type P = {
    promise: Promise<Item[]>,
    className?: string,
    href: Props['href']
}

export async function DevsStreaming({ promise, className, href }: P) {
    const items = await promise
    return (
        <div className={className}>
            {items.map(item =>
                <DevTile
                    //@ts-expect-error
                    key={item[`${href}Id`]}
                    item={{
                        //@ts-expect-error
                        id: item[`${href}Id`],
                        logo: item.logo,
                        name: item.name
                    }}
                    href={href}
                />
            )}
        </div>
    )
}
