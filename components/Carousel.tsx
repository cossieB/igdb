import { AnimatePresence, motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import styles from '../styles/Carousel.module.scss'

const images = ['/images/image (1).jpg', '/images/image (2).jpg', '/images/image (3).jpg', '/images/image (4).jpg', '/images/image (5).jpg']

const variant: Variants = {
    initial: {
        x: 500,
    },
    animate: {
        x: 0,
        transition: {
            duration: 0.2,
            ease: 'easeIn'
        }
    },
    exit: {
        x: '-100vw',
        transition: {
            duration: 0.2,
            ease: 'easeIn'
        }
    }
}

export default function Carousel() {
    const [current, setCurrent] = useState(0)
    const [previous, setPrevious] = useState(images.length - 1)
    const [next, setNext] = useState(1)

    useEffect(() => {
        const newCurrent = inc(current)
        const newPrev = inc(previous)
        const newNext = inc(next)
        let interval = setTimeout(() => {
            setCurrent(newCurrent)
            setPrevious(newPrev)
            setNext(newNext)
        }, 5000)
        console.log(current, next, previous)
        return () => clearTimeout(interval)
    }, [next])

    function inc(num: number) {
        if (num == images.length - 1) return 0
        return num + 1 % images.length
    }

    return (
        <div className={styles.carousel} >
            <AnimatePresence>
                <motion.img key={images[previous]}

                    initial={{ x: '-100%' }}
                    transition={{duration: 0.5, ease: 'easeOut'}}
                    animate={{ x: '-150%' }}
                    exit={{ x: '-250%' }}
                    // className={styles.previous}
                    src={images[previous]}
                    alt="" />
                <motion.img key={images[current]}
                    initial={{ x: '0%' }}
                    transition={{duration: 0.5, ease: 'easeOut'}}
                    animate={{ x: '-50%' }}
                    exit={{ x: '-100vw' }}
                    // className={styles.current}
                    src={images[current]}
                    alt="" />
                <motion.img key={images[next]}
                    initial={{x: '150%'}}
                    transition={{duration: 0.5, ease: 'easeOut'}}
                    animate={{x: '50%'}}
                    exit={{x: '-100vw'}}
                    // className={styles.next}
                    src={images[next]}
                    alt="" />
            </AnimatePresence>
        </div>
    )
}