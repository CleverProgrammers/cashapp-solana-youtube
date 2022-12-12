import dynamic from 'next/dynamic'
import Head from 'next/head'
import '../styles/globals.css'



function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
                <title>Cash App</title>
            </Head>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp
