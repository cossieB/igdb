import Carousel from '../components/Carousel'
import styles from '../styles/Home.module.scss'

export default function Home() {
    return (
        <div>
            <Carousel  />
            <div className={styles.hero} >
                <h1 className={styles.h1} > <span>The</span> <span  >Internet</span> <span >Games</span> <span >Database</span></h1>
            </div>
        </div>
    )
}