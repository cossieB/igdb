import { AnimatePresence } from "framer-motion"
import { useState } from "react"
import Nav from "./Nav"
import Search from "./Search"

interface P {
    children: React.ReactNode
}

export default function Layout({ children }: P) {
    const [isSearch, setIsSearch] = useState(false)
    return (
        <>
            <Nav setIsSearch={setIsSearch} />
            {children}
            <AnimatePresence>
                {isSearch && <Search setIsSearch={setIsSearch} />}
            </AnimatePresence>
        </>
    )
}