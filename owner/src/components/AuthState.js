import React, { createContext, useContext, useState, useEffect } from 'react';
import { gql, useQuery, useLazyQuery, useMutation, useApolloClient } from '@apollo/client';
import { useHistory } from "react-router-dom"
import useUser from '../hooks/useUser'

export const AuthContext = createContext()

const userFragment = `
  id
  name
  email
`;

const ADD_USER = gql`
  mutation ADD_PRODUCT(
    $name: String
    $email: String
    $password: String
  ) {
    createUser( data: {
      name: $name
      email: $email
      password: $password
    }) {
      id
      name
      email
    }
  }
`;

const USER_QUERY = gql`
  query {
    authenticatedUser {
      ${userFragment}
    }
  }
`;

const AUTH_MUTATION = gql`
  mutation signin($email: String, $password: String) {
    authenticateUserWithPassword(email: $email, password: $password) {
      item {
        ${userFragment}
      }
    }
  }
`;

const AUTH_MUTATION_CUSTOM = gql`
  mutation AUTH_MUTATION_CUSTOM($email: String!, $password: String!){
    loginExtended(email: $email, password: $password) {
      success
    }
  }
`

const UNAUTH_MUTATION = gql`
  mutation {
    unauthenticateUser {
      success
    }
  }
`;


export default function AuthProvider({ children }) {
	// const AuthedUser = useUser()
	// console.log(AuthedUser)
  const [user, setUser] = useState(null);
  const client = useApolloClient();
  let history = useHistory()

  useEffect(() => {
    getAuthedUser()
  },[])

  const [createUser, { data: addedUserData, loading, error: errorOnAddingUser }] = useMutation(ADD_USER, {
    onCompleted: async ({ createUser }) => {
      if (errorOnAddingUser) {
        throw errorOnAddingUser
      }
      await setUser(createUser)
      history.push({ pathname: '/profile', query: { id: createUser.id }})
    }
  })

  const [getAuthedUser, { loading: userLoading, data: userData }] = useLazyQuery(USER_QUERY, {
    fetchPolicy: 'no-cache',
    onCompleted: ({ authenticatedUser, error }) => {
      if (error) {
        throw error;
      }
      console.log(authenticatedUser)
      setUser(authenticatedUser);

    },
    onError: console.error,
  });

  const [login, {data, loading: authLoading }] = useMutation(AUTH_MUTATION, {
    onCompleted: async ({ authenticateUserWithPassword: { item } = {}, error }) => {
      if (error) {
        throw error;
      }

      // Ensure there's no old unauthenticated data hanging around
      await client.resetStore();

      if (item) {
        await setUser(item);
        console.log(user)
        history.push('/')
      }
    },
    onError: console.error,
  });


  const [logout, { data: signoutData, loading: unauthLoading }] = useMutation(UNAUTH_MUTATION, {
    onCompleted: async ({ unauthenticateUser: { success } = {}, error }) => {
      if (error) {
        throw error;
      }

      // Ensure there's no old authenticated data hanging around
      await client.resetStore();

      if (success) {
        setUser(null);
        console.log(user)
        history.push({ pathname: '/'})
      }
    },
    onError: console.error,
  });

  console.log('loading')
      console.log(user)

  return userData ? (
		<AuthContext.Provider
			value={{
		        isAuthenticated: !!user,
		        isLoading: userLoading || authLoading || unauthLoading,
		        login,
		        logout,
		        user,
		        createUser
          }}
		>
			{children}
		</AuthContext.Provider>
  ) : null
}

export const useAuth = () => useContext(AuthContext)