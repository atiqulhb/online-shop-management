/**
 * @format
 */

import React from 'react'
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import FirstPage from './components/FirstPage'

const client = new ApolloClient({
  // uri: 'http://192.168.43.243:8800/graphql',
  uri: 'http://192.168.43.73:8800/graphql',
  cache: new InMemoryCache()
});

const App = () => (
  <ApolloProvider client={client}>
    <FirstPage />
  </ApolloProvider>
)

AppRegistry.registerComponent(appName, () => App);
