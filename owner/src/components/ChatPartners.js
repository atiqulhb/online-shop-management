import { useEffect } from 'react'
import styled from 'styled-components'
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client'
import ScrollBar from './ScrollBar'
import { useAuth } from './AuthState'
import { NEW_MESSAGE } from './Chats'

export const NEW_PARTNER = gql`
	subscription NEW_PARTNER {
	  newMessage{
	    id
	    from {
	      id
	      name
	    }
	    to {
	      id
	      name
	    }
	  }
	}
`

const ALL_CHAT_PARTNERS = gql`
	query ALL_CHAT_PARTNERS ($currentUserId: ID!) {
		allMessages(where: {
			OR: [
				{ from: { id: $currentUserId }} 
				{ to: { id: $currentUserId }}
			]
		}){
			id
			from {
				id
				name
			}
			to {
				id
				name
			}
		}
	}
`

const ChatPartnersStyle = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
`

const Partner = styled.div`
	width: 100%;
	height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	border-bottom: 0.25px solid rgba(0,0,0,0.25);
	/*box-shadow: 0px 3px 5px -5px rgba(0,0,0,1);*/
`

export default function ChatPartners({ selectedPartner }) {
	const { user } = useAuth()

	// console.log(user?.id)

	const { loading, error, data, subscribeToMore } = useQuery(ALL_CHAT_PARTNERS, { variables: { currentUserId: user?.id }})

// 	useEffect(() => {
// 		let unsubscribe
// 
// 		if (subscribeToMore) {
// 		  	unsubscribe = subscribeToMore({
// 		      document: NEW_PARTNER,
// 		      updateQuery: (prev, { subscriptionData }) => {
// 		        if (!subscriptionData.data) return prev;
// 		        const newMessage = subscriptionData.data.newMessage;
// 		        return Object.assign({}, prev, {
// 		          allMessages: [...prev.allMessages, newMessage]
// 		        });
// 		      }
// 		    })
// 		}
// 		if (unsubscribe) return () => unsubscribe()
// 	},[subscribeToMore])

	if (loading) return <p>loading...</p>
	if (error) return <p>error occured</p>

	let c = []

	data.allMessages.map(({ from, to }) => c.push({ id: from.id, name: from.name}, { id: to.id, name: to.name }) )

	const uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))

	let nc = uniqueArray(c)

	let rcp = nc.filter(x => x.id !== user?.id)

	rcp = rcp.reverse()
	
	// console.log(rcp)

	function selectPartner(id) {
		console.log(id)
		selectedPartner && selectedPartner(id)
	}

	return (
		<ChatPartnersStyle>
			<ScrollBar>
				{rcp.map(({ id, name}) => (
					<Partner onClick={() => selectPartner(id)}key={id}>{name}</Partner>
				))}
			</ScrollBar>
		</ChatPartnersStyle>
	)
}