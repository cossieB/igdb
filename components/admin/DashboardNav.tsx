import { devSvg, gamesSvg, platformSvg, pubSvg } from "../../utils/svgs";
import NavButton from "./NavButton";
import styles from "../../styles/DashboardNav.module.scss"

export default function DashboardNav() {
    return (
        <ul className={styles.ul}>
            <NavButton icon={gamesSvg} label="Games" />
            <NavButton icon={devSvg} label="Developers" />
            <NavButton icon={pubSvg} label="Publishers" />
            <NavButton icon={platformSvg} label="Platforms" />
        </ul>
    )
}