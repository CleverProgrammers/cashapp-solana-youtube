import dynamic from 'next/dynamic'
import Head from 'next/head'
import '../styles/globals.css'

const WalletConnectionProvider = dynamic(() => import('../context/WalletConnectionProvider'), {
    ssr: false,
})

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
                <title>Cash App</title>
            </Head>
            <WalletConnectionProvider>
                <Component {...pageProps} />
            </WalletConnectionProvider>
        </>
    )
}

export default MyApp
