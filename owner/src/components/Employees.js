import { useState } from 'react'
import styled from 'styled-components'
import { gql, useMutation, useQuery } from '@apollo/client'

const ADD_EMPLOYEE = gql`
	mutation ADD_EMPLOYEE ($name: String, $email: String!, $password: String, $role: ID!) {
		createUser(data: {
			name: $name
			email: $email
			password: $password
			role: { connect: { id: $role }}
		}){
			id
			name
			email
			password_is_set
			role {
				id
				title
			}
		}
	}
`

const ALL_EMPLOYEES = gql`
	query ALL_EMPLOYEES {
		allUsers(where: {
			role_some: {
		      OR: [
		        { id: "60addf3c1f8d8e1d73b9b627" }
		        { id: "60b62ac791f0920acfc47e4a"}
		      ]
		    }
		}){
			id
			name
			email
			role {
				id
				title
			}
		}
	}
`

const ALL_ROLES = gql`
	{
	  allRoles {
	    id
	    title
	  }
	}
`

const EmployeesStyle = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	& > h2 {
		height: 40px;
		text-align: center;
	}
	& > div:nth-child(2) {
		height: 50px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		span {
			height: 25px;
			cursor: pointer;
			&.active {
				border-bottom: 1px solid black;
			}
		}
	}
	& > div:nth-child(3) {
		flex: 1;
	}
`

const Nav = styled.div`
	
`

export default function Employees() {
	const [tab, setTab] = useState('all-employess')
	return (
		<EmployeesStyle>
			<h2>Employees</h2>
			<div>
				<span className={ tab === 'all-employess' ? 'active' : null } onClick={() => setTab('all-employess')}>All Employees</span>
				<span className={ tab === 'add-employee' ? 'active' : null } onClick={() => setTab('add-employee')}>Add Employee</span>
				<span className={ tab === 'manage-permissions' ? 'active' : null } onClick={() => setTab('manage-permissions')}>Manage Permissions</span>
			</div>
			<div>
				{{
					'all-employess': <AllEmployees/>,
					'add-employee': <AddEmployee/>,
					'manage-permissions': <ManagePermissions/>,
			    } [tab] }
			</div>
		</EmployeesStyle>
	)
}

function AllEmployees() {
	const { data } = useQuery(ALL_EMPLOYEES)
	return (
		<div>
			<ol>
				{data?.allUsers?.map(({ id, name, email, role }) => (
					<li key={id}>
						<ul>
							<li>{name}</li>
							<li>{email}</li>
							<li>
								<ul>
									{ role.map(({ id, title }) => (
										<li key={id}>{title}</li>
									))}
								</ul>
							</li>
						</ul>
					</li>
				))}
			</ol>
		</div>
	)
}

const AddEmployeeStyle = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	& > form {
		display: flex;
		flex-direction: column;
	}
`

function AddEmployee() {
	const [variables, setVariables] = useState({
		name: undefined,
		email: undefined,
		password: undefined,
		role: undefined
	})
	const { data } = useQuery(ALL_ROLES)
	const [add] = useMutation(ADD_EMPLOYEE, { variables })
	function handleChange(e) {
		const { name, value } = e.target
		setVariables({ ...variables, [name]: value })
	}
	async function handleSubmit(e) {
		e.preventDefault()
		const res = await add()
		console.log(res)
		if (res.data) {
			document.getElementById('form').reset()
        	setVariables({ name: undefined, email: undefined, password: undefined, role: undefined })
		}
	}
	return (
		<AddEmployeeStyle>
			<form id="form" onSubmit={handleSubmit}>
				<input type="text" name="name" placeholder="Name" onChange={handleChange}/>
				<input type="email" name="email" placeholder="Email" onChange={handleChange}/>
				<input type="password" name="password" placeholder="Password" onChange={handleChange}/>
				<select name="role" onChange={handleChange}>
					{ data?.allRoles?.map(({ id, title }) => (
						<option key={id} value={id}>{title}</option>
					))}
				</select>
				<button type="submit">Add Employee</button>
			</form>
		</AddEmployeeStyle>
	)
}

function ManagePermissions() {
	return (
		<div/>
	)
}
