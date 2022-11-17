import { AnimatePresence } from "framer-motion"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Nav from "./Nav"
import Search from "./Search"

interface P {
    children: React.ReactNode
}

export default function Layout({ children }: P) {
    const [isSearch, setIsSearch] = useState(false)
    const router = useRouter()
    
    useEffect(() => {
        setIsSearch(false)
    }, [router.asPath])
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