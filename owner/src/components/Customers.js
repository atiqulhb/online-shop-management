import { gql, useQuery, useMutation } from '@apollo/client'

const ALL_CUSTOMERS = gql`
	{
		allUsers {
			id
			name
		}
	}
`

const DELETE_ALL_CUSTOMERS = gql`
	mutation DELETE_ALL_CUSTOMERS ($ids: [ID!]) {
		deleteUsers (ids: $ids) {
			id
			name
		}
	}
`

export default function Customers() {
	const { data } = useQuery(ALL_CUSTOMERS)
	const [deleteAllUsers] = useMutation(DELETE_ALL_CUSTOMERS)
	if (!data) return null
	console.log(data)

	let ids = [],
		i = 0
	
	for (i; i<data.allUsers.length; i++) {
		ids[i] = data.allUsers[i].id
	}
	return (
		<div>
			<button onClick={async() => {
				const res = await deleteAllUsers({ variables: { ids }})
				}}>delete all</button>
			all Users
			{data.allUsers.map(user => (
				<li key={user.id}>{user.name}</li>
			))}
			<br/>
		</div>
	)
}