import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
    icon: JSX.Element,
    label: string
}

export default function NavButton(props: Props) {
    const { icon, label } = props;
    const router = useRouter();
    const className = router.pathname.toLowerCase() == `/admin/${label}`.toLowerCase() ? "active" : ""
    return (
        <li className={className}>
            <Link href={`/admin/${label.toLowerCase()}`}>
                    {icon}
                    <span>{label}</span>
            </Link>
        </li>
    )
}