import { useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { gql, useMutation } from '@apollo/client'
import { useAuth } from '../lib/authentication'

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

const AccountPageLayout = styled.div`
	width: 100%;
	height: 100vh;
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
	const { login } = useAuth()
	const [variables, setVariables] = useState({
		email: '',
		password: '',	
	})

	function handleChange(e) {
		let { value, name, type } = e.target
		setVariables({
			...variables,
			[name]: value,
		});
	}
	return (
		<AccountPageLayout>
			<h1>Login</h1>
			<StyledForm
				onSubmit={async e => {
			        e.preventDefault();
			        const res = await login({ variables });
			        console.log(res);
				}}
			>
				<input type="email" name="email"  placeholder="Email" onChange={handleChange}/>
				<input type="password" name="password" placeholder="Password" onChange={handleChange}/>
				<button type="submit">Login</button>
			</StyledForm>
		</AccountPageLayout>
	)
}

// learn about autocomplete attribute in password input