import Head from 'next/head'
import Script from 'next/script'
import '../styles/globals.css'
import { ApolloProvider, ApolloClient, InMemoryCache, gql } from "@apollo/client";
import 'bootstrap/dist/css/bootstrap.css'
import client from '../apollo-client';
import Layout from '../components/Layout';


function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <ApolloProvider client={client}>
        <Head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </ApolloProvider>
    </Layout>
  )
}

export default MyApp
