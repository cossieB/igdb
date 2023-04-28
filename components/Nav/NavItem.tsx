import Link from "next/link";

type Props = {
    href: string,
    icon: JSX.Element,
    label: string
}

export default function NavItem({ href, icon, label }: Props) {
    return (
        <Link href={href} >
            <div className="navItem" >
                <span className="navIcon" >
                    {icon}
                </span>
                <span className="navText" >{label}</span>
            </div>
        </Link>
    )
}