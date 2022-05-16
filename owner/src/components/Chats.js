import { useState, useEffect, useLayoutEffect } from 'react'
import { useAuth } from './AuthState'
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client'
import styled from 'styled-components'
import ScrollBar from './ScrollBar'

export const NEW_MESSAGE = gql`
	subscription NEW_MESSAGE {
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

const ChatsStyle = styled.div`
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

export default function Chats({ partner }) {
	const { user } = useAuth()
	const { data, loading, error, subscribeToMore } = useQuery(ALL_MESSAGES, { variables: { senderId: partner, receiverId: user?.id }})

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
		}
		if (unsubscribe) return () => unsubscribe()
	},[subscribeToMore])

	if (loading) return <p>loading...</p>
	if (error) return <p>You did not choose any partner yet.</p>


	return (
		<ChatsStyle>
			<ScrollBar>
				{data.allMessages.map(message => (
					<Message key={message.id} style={ message.from.id === user?.id ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }}>
						<p  style={ message.from.id === user?.id ? { backgroundColor: "#E1F8DC" } : { backgroundColor: "#ddd" }}>{message.text}</p>
					</Message>
				))}
			</ScrollBar>
		</ChatsStyle>
	)
}