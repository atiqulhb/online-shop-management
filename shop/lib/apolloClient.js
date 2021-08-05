import { useMemo } from 'react'
import { ApolloClient, InMemoryCache, split, ApolloLink } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { concatPagination, getMainDefinition } from '@apollo/client/utilities'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { onError } from "@apollo/client/link/error"

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  credentials: 'include'
})

const wsLink = typeof window !== 'undefined' ? new WebSocketLink({
  uri: process.env.NEXT_PUBLIC_SUBSCRIPTION_URL,
  options: {
    reconnect: true,
    timeout: 20000,
    lazy: true,
  }
}) : null

const splitLink = typeof window !== 'undefined' ? split(({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  uploadLink,
) : uploadLink

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${JSON.stringify(path)}`
        // `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
})

// function createApolloClient() {
//   return new ApolloClient({
//     ssrMode: typeof window === 'undefined',
//     // link: splitLink,
//     link: ApolloLink.from([errorLink, splitLink]),
//     cache: new InMemoryCache({
//       typePolicies: {
//         Query: {
//           fields: {
//             allPosts: concatPagination(),
//           },
//         },
//       },
//     }),
//   })
// }

function createApolloClient(req) {
  console.log(req)
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createUploadLink({
      // TODO: server-side requests must have an absolute URI. We should find a way
      // to make this part of the project config, seems highly opinionated here
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
      credentials: 'include', // Additional fetch() options like `credentials` or `headers`
      headers: req && req.headers,
    }),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState = null, req) {
  const _apolloClient = apolloClient ?? createApolloClient(req)

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])
  return store
}