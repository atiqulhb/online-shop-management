import { gql, useQuery } from '@apollo/client';

export const CURRENT_USER_QUERY = gql`
 {
  authenticatedUser{
  	id
    name
  }
}
`;

export default function useUser() {
  const { data } = useQuery(CURRENT_USER_QUERY);
  return data?.authenticatedUser
}