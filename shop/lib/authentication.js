import React, { createContext, useContext, useState, useEffect } from 'react';
import { gql, useQuery, useLazyQuery, useMutation, useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router'
/**
 * AuthContext
 * -----------
 * This is the base react context instance. It should not be used
 * directly but is exported here to simplify testing.
 */
export const AuthContext = createContext();

/**
 * useAuth
 * -------
 * A hook which provides access to the AuthContext
 */
export const useAuth = () => useContext(AuthContext);

const userFragment = `
  id
  name
  email
`;

// const ADD_USER = gql`
//    mutation ADD_PRODUCT($name: String, $email: String, $password: String) {
//     createUser(data: { name: $name, email: $email, password: $password }) {
//       ${userFragment}
//     }
//   }
// `

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

/**
 * AuthProvider
 * ------------
 * AuthProvider is a component which keeps track of the user's
 * authenticated state and provides methods for managing the auth state.
 */
export const AuthProvider = ({ children, initialUserValue }) => {
  const [user, setUser] = useState(initialUserValue);
  const client = useApolloClient();
  const router = useRouter()

  useEffect(() => {
    getAuthedUser()
  },[])

  const [createUser, { data: addedUserData, loading, error: errorOnAddingUser }] = useMutation(ADD_USER, {
    onCompleted: async ({ createUser }) => {
      if (errorOnAddingUser) {
        throw errorOnAddingUser
      }
      await setUser(createUser)
      router.push({ pathname: '/profile', query: { id: createUser.id }})
    }
  })

  const [getAuthedUser, { data: userData, loading: userLoading }] = useLazyQuery(USER_QUERY, {
    fetchPolicy: 'no-cache',
    onCompleted: ({ authenticatedUser, error }) => {
      if (error) {
        throw error;
      }
      setUser(authenticatedUser)
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
        // console.log(user)
        // console.log( typeof setReloadCartComponent )
        router.push({ pathname: '/profile', query: { id: item.id }})
      }
    },
    onError: console.error,
  });

  const [loginExt] = useMutation(AUTH_MUTATION_CUSTOM)

  

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
        router.push({ pathname: '/'})
      }
    },
    onError: console.error,
  });

  return !userLoading ? (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading: userLoading || authLoading || unauthLoading,
        login,
        logout,
        user,
        createUser,
        loginExt
      }}
    >
      {children}
    </AuthContext.Provider>
  ) : null
};
