import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from "react";
import debounce from "../lib/debounce";
import sendData from "../lib/sendData";
import styles from "../styles/Search.module.scss";
import { DevPick, GamePick, PubPick } from "../utils/customTypes";

interface P {
    setGames: Dispatch<SetStateAction<GamePick[]>>
    setDevs: Dispatch<SetStateAction<DevPick[]>>
    setPubs: Dispatch<SetStateAction<PubPick[]>>
    setError: Dispatch<SetStateAction<string>>
}

export default function SearchInput(props: P) {
    const {setDevs, setGames, setPubs, setError} = props;
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const inputElem = ref.current!
        inputElem.focus();
    }, [])
    
    const search = debounce(async (text: string) => {
        if (text == "") return;
        if (text.length < 4) return setError("Search text needs to be at least 4 characters")
        const data = await sendData<{games: GamePick[], devs: DevPick[], pubs: PubPick[]}>(`/api/search?text=${text}`)
        setGames(data.games)
        setPubs(data.pubs)
        setDevs(data.devs)
    }, 1000)

    return (
        <input
            className={styles.input}
            type="search"
            placeholder="Search..."
            ref={ref}
            onChange={e => {
                setError("")
                if (e.target.value == "") {
                    setGames([])
                    setDevs([])
                    setPubs([])
                }
                search(e.target.value)
            }}
        />
    )
}