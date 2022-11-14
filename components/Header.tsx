import styles from '../styles/Home.module.scss'

interface P {
    heading: string
}

export default function Header({heading}: P) {
    return (
        <div className={styles.header} >
            <h2>{heading}</h2>
            <div className={styles.line} ></div>
        </div>
    )
}