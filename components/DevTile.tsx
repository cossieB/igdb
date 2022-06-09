import Link from "next/link"

interface Props {
    item: {
        id: string,
        name: string,
        logo: string
    },
    className: string,
    href: 'developers' | 'publishers' | 'platforms'
}

export default function DevTile({item, className, href}: Props) {
    return (
        <Link href={`/${href}/${item.id}`} >
        <a>
            <div className={className} key={`${item.name}`} >
                <img src={item.logo} alt={`${item.name} Logo`} />
            </div>
        </a>
    </Link>
    )
}