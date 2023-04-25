import { motion, Variant } from "framer-motion"
import styles from "../../styles/Spinner.module.scss";

type Var = {
    [x: string]: Variant
}

const loaderVariants: Var = {
    animation1: {
        x: ['-100%', '100%'],
        backgroundColor: ['#fdba74', '#0b981'],
        transition: {
            x: {
                repeat: Infinity,
                repeatType: 'reverse',
                repeatDelay: 0.25,
                duration: 0.5,
                ease: 'easeInOut'
            },
            backgroundColor: {
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 1,
                ease: 'easeInOut'
            }
        }
    },
    animation2: {
        x: ['100%', '-100%'],
        backgroundColor: ['#0b981', '#fdba74'],
        transition: {
            x: {
                repeat: Infinity,
                repeatType: 'mirror',
                repeatDelay: 0.25,
                duration: 0.5,
                ease: 'easeInOut'
            },
            backgroundColor: {
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 1,
                ease: 'easeInOut'
            }
        },
    },
}

export function Spinner() {
    return (
        <div className={styles.spinner}>
            <motion.div
                variants={loaderVariants}
                animate="animation1"
                className="w-3 h-3 rounded-full bg-orange-300"
            />
            <motion.div
                variants={loaderVariants}
                animate="animation2"
                className="w-3 h-3 rounded-full bg-orange-300"
            />
        </div>
    )
}
