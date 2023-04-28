import styles from '/styles/404.module.scss'

export default function NotFound() {
    return (
        <div className={styles.container}>    
            <div>GAME OVER</div>
            <div>You have taken a wrong turn</div>
        </div>
    )
}