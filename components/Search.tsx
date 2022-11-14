import { motion } from "framer-motion"
import { SetStateAction, useEffect, useRef } from "react"
import styles from "../styles/Search.module.scss"

interface P {
    setIsSearch: React.Dispatch<SetStateAction<boolean>>
}

export default function Search({ setIsSearch }: P) {
    const inputElem = useRef<HTMLInputElement>(null)!;
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        inputElem.current?.focus();
    }, [])
    return (
        <motion.div
            className={styles.container}
            initial={{ y: '-100vh' }}
            animate={{ y: 0 }}
            exit={{y: '-100vh'}}
            transition={{type: 'tween', ease: "easeOut", duration: 0.25}}
        >
            <button
                className={styles.close}
                onClick={() => {
                    setIsSearch(false);
                    document.body.style.overflow = 'auto'
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
            </button>
            <input
                className={styles.input}
                type="search"
                placeholder="Search..."
                ref={inputElem}
            />
        </motion.div>
    )
}