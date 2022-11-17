import { motion } from "framer-motion";
import { SetStateAction, useEffect, useState } from "react"
import styles from "../styles/Search.module.scss"
import { GamePick, PubPick, DevPick } from "../utils/customTypes";
import { circleCloseSvg } from "../utils/svgs";
import DevTile from "./DevTile";
import GameTile from "./GameTile";
import Header from "./Header";
import SearchInput from "./SearchInput";

interface P {
    setIsSearch: React.Dispatch<SetStateAction<boolean>>
}
export default function Search({ setIsSearch }: P) {
    const [games, setGames] = useState<GamePick[]>([])
    const [pubs, setPubs] = useState<PubPick[]>([])
    const [devs, setDevs] = useState<DevPick[]>([])
    const [error, setError] = useState("")

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [])

    return (
        <motion.div
            className={devs.length + pubs.length + games.length == 0 ? `${styles.container} ${styles.init}` : `${styles.container}`}
            initial={{ y: '-100vh', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100vh', opacity: 0 }}
            transition={{ type: 'tween', ease: "easeOut", duration: 0.25 }}
        >
            <button
                className={styles.close}
                onClick={() => {
                    setIsSearch(false);
                    document.body.style.overflow = 'auto'
                }}
            >
                {circleCloseSvg}
            </button>
            <SearchInput
                setGames={setGames}
                setPubs={setPubs}
                setDevs={setDevs}
                setError={setError}
            />
            {error && <div className={styles.error}>{error}</div>}
            {games.length > 0 &&
                <>
                    <Header heading="Games" />
                    <div className={styles.games}>
                        {games.map(game =>
                            <GameTile
                                game={game}
                                key={game.gameId}
                            />
                        )}
                    </div>
                </>
            }
            {devs.length > 0 &&
                <>
                    <Header heading="Developers" />
                    <div className={styles.logos}>
                        {devs.map(dev =>
                            <DevTile
                                key={dev.developerId}
                                item={{
                                    id: dev.developerId,
                                    logo: dev.logo,
                                    name: dev.name
                                }}
                                href="developers"
                            />
                        )}
                    </div>
                </>
            }
            {pubs.length > 0 &&
                <>
                    <Header heading="Publishers" />
                    <div className={styles.logos}>
                        {pubs.map(pub =>
                            <DevTile
                                key={pub.publisherId}
                                item={{
                                    id: pub.publisherId,
                                    logo: pub.logo,
                                    name: pub.name
                                }}
                                href="publishers"
                            />
                        )}
                    </div>
                </>
            }
        </motion.div>
    )
}