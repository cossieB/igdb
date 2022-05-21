import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from '../components/layout'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>IGDB</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;700&family=Press+Start+2P&display=swap" rel="stylesheet" />

            </Head>
            <Layout></Layout>
            <main>
            <Component {...pageProps} />
            </main>
        </>
    )
}

export default MyApp
