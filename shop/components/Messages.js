import { useEffect } from 'react'
import styled from 'styled-components'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client'
import ScrollBar2 from './ScrollBar2'
import { useAuth } from '../lib/authentication'

const NEW_MESSAGE = gql`
	subscription NEW_MESSAGE {
	  newMessage {
	    id
	    from {
	      id
	      name
	    }
	    to {
	      id
	      name
	    }
	    text
	    timeStamp
	  }
	}
`

const ALL_MESSAGES = gql`
	query ALL_MESSAGES ($senderId: ID!, $receiverId: ID!) {
	  allMessages (where: {
	  	OR: [
	  		{
	  			AND: [
				  { from : { id: $senderId } }
				  { to: { id: $receiverId } }
			  	]
	  		}
	  		{
	  			AND: [
				  { from : { id: $receiverId } }
				  { to: { id: $senderId } }
			  	]
	  		}
	  	]
	  	
	  }){
	    id
	    from {
	      id
	    }
	    to {
	      id
	    }
	    text
	    timeStamp
	  }
	}
`


const MessagesStyle = styled.div`
	width: 100%;
	height: 100%;
`

const Message = styled.div`
	width: 100%;
	height: auto;
	display: flex;
	p {
		background-color: #ddd;
		margin: 5px 0;
		padding: 5px 10px;
		border-radius: 15px;
	}
`

export default function Messages({ from }) {
	const { user } = useAuth()
	const { data, subscribeToMore } = useQuery(ALL_MESSAGES, { variables: { senderId: from, receiverId: user?.id }})

	useEffect(() => {
		let unsubscribe

		if (subscribeToMore) {
		    unsubscribe = subscribeToMore({
		      document: NEW_MESSAGE,
		      updateQuery: (prev, { subscriptionData }) => {
		        if (!subscriptionData.data) return prev;
		        const newMessage = subscriptionData.data.newMessage;
		        return Object.assign({}, prev, {
		          allMessages: [...prev.allMessages, newMessage]
		        });
		      }
		    })
		    if (unsubscribe) return () => unsubscribe()
		}
	},[subscribeToMore])

	return (
		<MessagesStyle>
			<ScrollBar2>
				{data?.allMessages?.map(message => (
					<Message key={message.id} style={ message?.from.id === user?.id ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }}>
						<p style={ message.from.id === user?.id ? { backgroundColor: "#CAF1DE" } : { backgroundColor: "#ddd" }}>{message.text}</p>
					</Message>
				))}
			</ScrollBar2>
		</MessagesStyle>
	)
}