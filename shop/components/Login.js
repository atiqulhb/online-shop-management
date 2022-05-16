import { useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { gql, useMutation } from '@apollo/client'
import { useAuth } from '../lib/authentication'
import { useRouter } from 'next/router'

const LoginLayout = styled.div`
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

const Button = styled.button`
	padding: 10px 20px;
	border-radius: 50px;
	cursor: pointer;
	background-color: #fff;
	border: 1px solid black;
	&:focus {
		outline: none;
	}
`

export default function Login() {
	const router = useRouter()

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

	async function handleSubmission(e) {
		e.preventDefault();
		await login({ variables });
	}

	return (
		<LoginLayout>
			<Link href="http://localhost:8800/auth/google" passHref>
				<Button>Login with Google</Button>
			</Link>
			<h1>Login</h1>
			<StyledForm onSubmit={handleSubmission}>
				<input type="email" name="email"  placeholder="Email" onChange={handleChange}/>
				<input type="password" name="password" placeholder="Password" autoComplete="off" onChange={handleChange}/>
				<button type="submit">Login</button>
			</StyledForm>
		</LoginLayout>
	)
}

// learn about autocomplete attribute in password input