import { useState } from 'react'
import { useRouter } from 'next/router'
import { gql, useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components'
import { useAuth } from '../lib/authentication'
import Login from '../components/Login'
// import TopBar from '../components/TopBar'
import useUser from '../hooks/useUser'

const USER_QUERY = gql`
	query USER_QUERY($id: ID!){
	  User(where: {
	    id: $id
	  }){
	    name
	    email
	    
	  }
	}
`

const LOGOUT_MUTATION = gql`
	mutation {
	  unauthenticateUser {
	    success
	  }
	}
`

const ProfilePageLayout = styled.div`
	width: 100%;
	height: auto;
	h1 {
		text-align: center;
	}
`

const ProfilePageMenu = styled.div`
	display: flex;
	justify-content: space-around;
	width: 80%;
	margin: 0 auto;
	span {
		cursor: pointer;
		&.active {
			border-bottom: 1px solid black;
		}
	}
`

const ProfileComponentLayout = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 400px;
	flex-direction: column;
	span, button {
		margin: 5px;
	}
`

const AccountInfoAndSettingsLayout = styled.div`
	display: flex;
	flex-direction: column;
	height: 400px;
	justify-content: center;
	span {
		margin: 5px 0;
		margin-left: 100px;
	}
`

const TransactionHistoryLayout = styled.div`
	margin-top: 15px;
	display: flex;
	justify-content: space-around;
`
const WishListLayout = styled.div`
	margin-top: 15px;
	display: flex;
	justify-content: space-around;
`

export default function CustomerPanel(props) {
	const { user } = useAuth()
	// const user = useUser()
	console.log(user)
	const [tab, setTab] = useState('profile')
	if (!user) return (
		<>
			<span>you are not logged in</span>
			<Login/>
		</>
	)
	return (
		<ProfilePageLayout>
			<h1>Customer Panel</h1>
			<ProfilePageMenu>
				<span className={ tab == 'profile' ? 'active' : null } onClick={() => setTab('profile')}>Profile</span>
				<span className={ tab == 'account-info-and-settings' ? 'active' : null } onClick={() => setTab('account-info-and-settings')}>Account Info and Settings</span>
				<span className={ tab == 'transaction-history' ? 'active' : null } onClick={() => setTab('transaction-history')}>Transaction History</span>
				<span className={ tab == 'wishlist' ? 'active' : null } onClick={() => setTab('wishlist')}>Wish List</span>
			</ProfilePageMenu>
			{{
	          'profile': <Profile id={user.id}/>,
	          'account-info-and-settings': <AccountInfoAndSettings/>,
	          'transaction-history': <TransactionHistory />,
	          'wishlist': <WishList />,
		    } [tab] }
		</ProfilePageLayout>
	)
}

function Profile({ id }) {
	const { logout } = useAuth()
	const { data } = useQuery(USER_QUERY, { variables: { id } })
	if(!data) return null
	const { name, email } = data.User
	// const [logout] = useMutation(LOGOUT_MUTATION)
	
	return (
		<ProfileComponentLayout>
			<span>Name: {name}</span>
			<span>Email: {email}</span>
			<span>Phone Number</span>
			<span>Address</span>
			<button onClick={async () => {
				await logout()
				// console.log(res)
			}}>logout</button>
		</ProfileComponentLayout>
	)
}

function AccountInfoAndSettings() {
	return (
		<AccountInfoAndSettingsLayout>
			<span>Unique Name</span>
			<span>Reset Password</span>
			<span>Join Date</span>
			<span>Delete Account</span>
		</AccountInfoAndSettingsLayout>
	)
}

function TransactionHistory() {
	return (
		<TransactionHistoryLayout>
			<span>serial</span>
			<span>number of days ago</span>
			<span>date</span>
			<span>order no</span>
			<span>transaction amount</span>
			<span>transaction status</span>
		</TransactionHistoryLayout>
	)
}

function WishList() {
	return (
		<WishListLayout>
			<span>serial</span>
			<span>product name</span>
			<span>weight</span>
			<span>price</span>
			<span>add to cart</span>
			<span>delete</span>
		</WishListLayout>
	)
}

