import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from '../components/layout'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>IGDB</title>
            </Head>
            <Layout>
                <main>
                    <Component {...pageProps} />
                </main>
            </Layout>
        </>
    )
}

export default MyApp
