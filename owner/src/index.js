import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider, split, ApolloLink } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws'
import { BrowserRouter } from 'react-router-dom'
import { onError } from "apollo-link-error"
import AuthProvider from './components/AuthState' 

const uploadLink = createUploadLink({
  uri: process.env.REACT_APP_GRAPHQL_API_ENDPOINT,
  fetchOptions: {
    credentials: 'include',
  }
})

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_WEBSOCKET_ENDPOINT,
  options: {
    reconnect: true,
    timeout: 20000,
    lazy: true,
  }
})

const splitLink = split(({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  uploadLink,
)

 
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
})


const client = new ApolloClient({
  link: ApolloLink.from([errorLink, splitLink]),
  cache: new InMemoryCache(),
})


ReactDOM.render(
  <React.StrictMode>
  	<ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
    	    <App/>
        </AuthProvider>
      </BrowserRouter>
  	</ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();