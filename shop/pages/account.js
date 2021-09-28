import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import { gql, useMutation } from '@apollo/client'
import { useAuth } from '../lib/authentication'
import CreateAccount from '../components/CreateAccount'
import Login from '../components/Login.js'

const ADD_USER = gql`
  mutation ADD_PRODUCT(
    $name: String
    $email: String
    $password: String
  ) {
    createUser(
      data: {
        name: $name
        email: $email
        password: $password
      }
    ) {
      	id
      	name
		email
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
	    item {
	      id
	      email
	      name
	    }
    }
  }
`;

const CURRENT_USER_QUERY = gql`
  query {
    authenticatedUser {
        id
        email
        name
    }
  }
`;

const AccountPageLayout = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	h3 {
		text-align: center;
	}
	span {
		span {
			text-decoration: underline;
			cursor: pointer;
		}
	}
`

const StyledForm = styled.form`
	width: 300px;
	height: auto;
	display: flex;
	flex-direction: column;
`

export default function Account() {
	const [createAcount, setCreateAccount] = useState(false)
	return (
		<AccountPageLayout>
			{createAcount ? (
				<>
					<CreateAccount/>
					<span>already has account? <span onClick={() => setCreateAccount(false)}>Login</span></span>
				</>
			) : (
				<>
					<Login/>
					<span>No account? <span onClick={() => setCreateAccount(true)}>Create An Account</span></span>
 					<span>Forgot Password?  <Link href="/forget-password" passHref><span>Click here</span></Link></span>
				</>
			)}
			
		</AccountPageLayout>
	)
}