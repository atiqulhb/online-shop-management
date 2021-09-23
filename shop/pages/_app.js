import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apolloClient'
import Layout from '../components/Layout'
import { LocalState } from '../components/LocalState'
import { AuthProvider } from '../lib/authentication'
// import PWAHeader from '../components/PWAHeader'

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps)

  return (
    <ApolloProvider client={apolloClient}>
    	<AuthProvider>
        <LocalState>
  				<Layout>
            {/* <PWAHeader/> */}
      			<Component {...pageProps} />
          </Layout>
        </LocalState>
    	</AuthProvider>
    </ApolloProvider>
  )
}