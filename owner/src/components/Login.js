import { useState, useEffect } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useHistory, useLocation, Redirect } from "react-router-dom"
import { useAuth } from './AuthState'
import styled from 'styled-components'

const SEND_EMAIL_FOR_2F_AUTHENTICATION = gql`
	mutation SEND_EMAIL_FOR_2F_AUTHENTICATION ($email: String!, $role: ID!){
		loginWithOTP (email: $email, role: $role) {
			success
		}
	}
`

const VERIFY_OTP = gql`
	mutation VERIFY_OTP ($email: String!, $token: String!) {
		verifyToken (
			email: $email
			token: $token
			){
				success
			}
	}
`

const ALL_ROLES = gql`
	query ALL_ROLES {
		allRoles {
			id
			title
		}
	}
`

const LoginStyle = styled.div`
	width: 100%;
	height: 100vh;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	div {
		display: flex;
		flex-direction: column;
	}
	& > form {
		display: flex;
		flex-direction: column;
	}
`

export default function Login() {
	const { login } = useAuth()
	let history = useHistory()
	const { state } = useLocation()

	console.log(state)

	const [ redirectToReferrer, setRedirectToReferrer] = useState(false)

	const [role, setRole] = useState('')
	const [email, setEmail] = useState('')
	const [token, setToken] = useState('')
	const [password, setPassword] = useState('')

	const [emailRoleMatched, setEmailRoleMatched] = useState(false)
	const [otpVerified, setOTPVerified] = useState(false)

	const { data } = useQuery(ALL_ROLES)
	const [verifyMathingRoleAndEmail] = useMutation(SEND_EMAIL_FOR_2F_AUTHENTICATION)
	const [verifyOTP] = useMutation(VERIFY_OTP)

	async function handleMatchingRoleAndEmail() {
		const res = await verifyMathingRoleAndEmail({ variables: { email, role }})
		console.log(res)
		const { success } = res?.data?.loginWithOTP
		if (success) {
			setEmailRoleMatched(true)
		}
	}

	async function handleMatchingOTP() {
		const res = await verifyOTP({ variables: { email, token }})
		console.log(res)
		const { success } = res?.data?.verifyToken
		if (success) {
			setOTPVerified(true)
		}
	}

	// async function handleLogin() {
	// 	const res = await login({ variables: { email, password }})
	// 	console.log(res)
	// 	if (res.data?.authenticateUserWithPassword.item) {
	// 		setRedirectToReferrer(true)
	// 	}
	// }

	async function handleLogin(e) {
		e.preventDefault()
		const res = await login({ variables: { email, password }})
		console.log(res)
		if (res.data?.authenticateUserWithPassword.item) {
			setRedirectToReferrer(true)
		}
	}

	if (redirectToReferrer === true) {
	    return <Redirect to={state?.from.pathname || '/'} />
	  }

	return (
		<LoginStyle>
			{/* <div> */}
			{/* 	{ !emailRoleMatched ? ( */}
			{/* 		<> */}
			{/* 		<label>Select Role</label> */}
			{/* 		<select onChange={e => setRole(e.target.value)}> */}
			{/* 			{ data?.allRoles?.map(({ id, title }) => ( */}
			{/* 				<option key={id} value={id}>{title}</option> */}
			{/* 			))} */}
			{/* 		</select> */}
			{/* 		<label>Enter Your Email Adress</label> */}
			{/* 		<input type="email" onChange={e => setEmail(e.target.value)}/> */}
			{/* 		<button onClick={handleMatchingRoleAndEmail}>Done</button> */}
			{/* 		</> */}
			{/* 	) : !otpVerified ? ( */}
			{/* 		<> */}
			{/* 		<label>Enter token</label> */}
			{/* 		<input type="number" onChange={e => setToken(e.target.value)}/> */}
			{/* 		<button onClick={handleMatchingOTP}>Done</button> */}
			{/* 		</> */}
			{/* 	) : ( */}
			{/* 		<> */}
			{/* 		<label>Enter Password</label> */}
			{/* 		<input type="password" onChange={e => setPassword(e.target.value)}/> */}
			{/* 		<button onClick={handleLogin}>Login</button> */}
			{/* 		</> */}
			{/* 	)} */}
			{/* </div> */}
			<form onSubmit={handleLogin}>

					<label>Enter Your Email Adress</label>
					<input type="email" onChange={e => setEmail(e.target.value)}/>
					<label>Enter Password</label>
					<input type="password" onChange={e => setPassword(e.target.value)}/>
					<button type="submit" onClick={handleLogin}>Login</button>
			</form>
		</LoginStyle>
	)
}

