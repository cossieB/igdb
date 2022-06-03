import { motion } from "framer-motion"

interface P1 {
    className?: string
    children: React.ReactNode
}

export default function Popup({ children, className }: P1) {
    return (
        <motion.div
            className={className || "popup"}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
        >
            {children}
        </motion.div>
    )
}