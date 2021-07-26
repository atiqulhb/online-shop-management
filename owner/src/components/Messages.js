import { useState, useEffect, useLayoutEffect } from 'react'
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client'
import styled from 'styled-components'
import merge from 'deepmerge'
import { IoMdSend } from "react-icons/io"
import ScrollBar from './ScrollBar'
import ChatPartners from './ChatPartners'
import Chats from './Chats'
import SearchPeople from './SearchPeople'
import { useAuth } from './AuthState'



const SEND_MESSAGE = gql`
	mutation SEND_MESSAGE ($senderId: ID!, $receiverId: ID!, $text: String!, $timeStamp: DateTime!) {
		createMessage(data: {
			from: {
				connect: { id: $senderId }
			}
			to: {
				connect: { id: $receiverId }
			}
			text: $text
			timeStamp: $timeStamp
		}) {
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

const MessagesStyle = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
`

const SendersArea = styled.div`
	width: 250px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

const SearchArea = styled.div`
	width: 100%;
	height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
`

const SendersBox = styled.div`
	width: calc(100% - 10px);
	height: calc(100% - 60px);
	box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.25);
	border-radius: 10px;
	margin: 5px 5px 10px 10px;
`

const MessageArea = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
`

const MessagesBox = styled.div`
	flex: 1;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	overflow: hidden;
	padding: 5px;
`
const MessagesField = styled.div`
	width: calc(100% - 10px);
	height: calc(100% - 20px);
	box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.25);
	border-radius: 10px;
`

const InputArea = styled.div`
	height: 50px;
	display: flex;
`

const InputBox = styled.div`
	flex: 1;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
`

const InputField = styled.textarea`
	width: calc(100% - 15px);
	margin-left: 5px;
	height: calc(100% - 10px);
	box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.25);
	border-radius: 10px;
	border: none;
	resize: none;
	overflow: auto;
    overflow: -moz-scrollbars-none;
    -ms-overflow-style: none;
    vertical-align: middle;
    padding: 12.5px;
    &::-webkit-scrollbar {
    	display: none
    }
	&:focus {
		outline: none;
	}
` 

const SendBox = styled.div`
	width: 50px;
	height: 50px;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
`

const SendButton = styled.div`
	width: 40px;
	height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.25);
	border-radius: 50%;
	cursor: pointer;
	svg {
		margin-left: 4px;
		transform: scale(1.25);
	}
`

export default function Messages() {
	const { user } = useAuth()
	console.log(user?.id)
	const [partner, setPartner] = useState(undefined)
	const [text, setText] = useState('')

	const [send] = useMutation(SEND_MESSAGE)
	
	async function handleSend () {
		if (text !== '') {
			const res = await send({ variables: { senderId: user?.id, receiverId: partner, text, timeStamp: new Date() }})
			console.log(res)
			if (res.data) {
				setText('')
			}
		}
	}

	return (
		<MessagesStyle>
			<SendersArea>
				<SearchArea>
				{/* <SearchBox> */}
					<SearchPeople setPartner={d => setPartner(d)}/>
				{/* </SearchBox> */}
				</SearchArea>
				<SendersBox>
					<ChatPartners selectedPartner={d => setPartner(d)}/>
				</SendersBox>
			</SendersArea>
			<MessageArea>
				<MessagesBox>
					<MessagesField>
						<Chats partner={partner}/>
					</MessagesField>
				</MessagesBox>
				<InputArea>
					<InputBox>
						<InputField value={text} onChange={e => setText(e.target.value)}/>
					</InputBox>
					<SendBox>
						<SendButton onClick={handleSend}>
							<IoMdSend/>
						</SendButton>
					</SendBox>
				</InputArea>
			</MessageArea>
		</MessagesStyle>
	)
}