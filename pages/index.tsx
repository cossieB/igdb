import styles from '../styles/Home.module.scss'

export default function Home() {
    return (
        <div>
            <div className={styles.hero} >
                <h1  >The <span style={{color: '#f0f'}} >Internet</span> <span style={{color: '#1F51FF'}} >Games</span> <span style={{color: 'springgreen'}} >Database</span></h1>
            </div>
        </div>
    )
}