import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from '../components/Layout'
import Apollo from '../components/Apollo'

function MyApp({ Component, pageProps }: AppProps) {

    return (
        <Apollo>
            <Head>
                <title>IGDB</title>
            </Head>
            <Layout>
                <main>
                    <Component {...pageProps} />
                </main>
            </Layout>
        </Apollo>
    )
}

export default MyApp
