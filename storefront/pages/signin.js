import { useState } from 'react'
import styled from 'styled-components'
import { gql, useMutation } from '@apollo/client'

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
	const [createAcount, setCreateAccount] = useState(true)
	const [variables, setVariables] = useState({
		name: '',
		email: '',
		password: '',
	})
	const [createUser, { loading, error }] = useMutation(ADD_USER, { variables })
	function handleChange(e) {
		let { value, name, type } = e.target;
		if (type === 'number') {
			value = parseFloat(value);
		}
		if (type === 'file') {
			if(window !== 'undefined') {
				value = '/' + e.target.files[0].name
			}
		}
		setVariables({
			...variables,
			[name]: value,
		});
	}
	return (
		<AccountPageLayout>
			{createAcount ? (
				<>
					<h1>Create Account</h1>
					<StyledForm
						onSubmit={async e => {
					        e.preventDefault();
					        const res = await createUser();
					        console.log(res);
						}}
					>
						<input type="text" name="name"  placeholder="Name" onChange={handleChange}/>
						<input type="email" name="email"  placeholder="Email" onChange={handleChange}/>
						<input type="password" name="password" placeholder="Password" onChange={handleChange}/>
						<button type="submit">Create Account</button>
					</StyledForm>
					<span>already has account? <span onClick={() => setCreateAccount(false)}>Login</span></span>
				</>
			) : (
				<>
					<h1>Login</h1>
					<StyledForm
						onSubmit={async e => {
					        e.preventDefault();
					        const res = await createUser();
					        console.log(res);
						}}
					>
						<input type="email" name="email"  placeholder="Email" onChange={handleChange}/>
						<input type="password" name="password" placeholder="Password" onChange={handleChange}/>
						<button type="submit">Create Account</button>
					</StyledForm>
					<span>No account? <span onClick={() => setCreateAccount(true)}>Create An Account</span></span>
				</>
			)}
		</AccountPageLayout>
	)
}