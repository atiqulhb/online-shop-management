import { useRef, useEffect, useState, useLayoutEffect } from 'react'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client'
import styled from 'styled-components'
import { GrSend } from "react-icons/gr"
import { IoIosHelpCircleOutline } from "react-icons/io"
import { AiFillCaretDown } from "react-icons/ai"
import Messages from '../components/Messages'
import ScrollToBottom from './ScrollToBottom'
import { useAuth } from '../lib/authentication'

const ADMIN_AND_EMPLOYEES = gql`
	query ADMIN_AND_EMPLOYEES ($role: String!) {
	  allUsers (where: {
	    role_every: {
          title: $role
	    }
	  }){
	    id
	    name
	  }
	}
`

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

const ChatStyle = styled.div`
	position: absolute;
	width: 50px;
	height: 50px;
	border-radius: 15px;
	z-index: 9999999;
	bottom: 15px;
	right: 15px;
	transition: all .3s ease-in-out;
	display: flex;
	flex-direction: column;
	background-color: #fff;
	@media (max-width: 650px) {
		display: none;
	}
`

const ChatTopBar = styled.div`
	width: 100%;
	height: 30px;
	/*display: flex;*/
	display: none;
	& > div {
		&:nth-child(1) {
			width: 50px;
			height: 100%;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			svg {
				/*margin-t: 5px 0;*/
				/*margin-left: 15px;*/
				/*background-color: yellowgreen;*/
				/*padding: 10px;*/
				margin-top: 5px;
			}
		}
		&:nth-child(2) {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			span {
				font-size: 14px;
			}
		}
		&:nth-child(3) {
			width: 50px;
			height: 100%;
		}
	}
`

const MessageBox = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
`

const AreaForMessages = styled.div`
	width: calc(100% - 20px);
	height: calc(100% - 10px);
	box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.25);
	border-radius: 15px;
	display: none;
`

const SendBox = styled.div`
	display: flex;
	height: 50px;
`

const Input = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	
`

const InputField = styled.textarea`
	width: calc(100% - 20px);
	height: 30px;
	box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.25);
	border-radius: 15px;
	display: none;
	border: none;
	resize: none;
	overflow: auto;
    overflow: -moz-scrollbars-none;
    -ms-overflow-style: none;
    vertical-align: middle;
    padding: 7.5px;
    &::-webkit-scrollbar {
    	display: none
    }
	&:focus {
		outline: none;
	}
`

const Send = styled.div`
	width: 50px;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
`

const SendButton = styled.div`
	position: absolute;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50px;
	bottom: 5px;
	right: 5px;
	cursor: pointer;
	box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.25);
	svg {
		transform: scale(1.5)
	}
`

export default function Chat() {
	const { user } = useAuth()

	const [helpIcon, setHelpIcon] = useState(false)

	const [text, setText] = useState('')
	const [to, setTo] = useState('')

	const ChatRef = useRef()
	const ChatTopBarRef = useRef()
	const InputFieldRef = useRef()
	const SendButtonRef = useRef()
	const MessagesRef = useRef()
	const ChatMinimizeRef = useRef()

	useEffect(() => {
		let t1, t2, t3

		ChatRef.current.onclick = function() {
			this.style.borderRadius = '15px'
			this.style.boxShadow = '0px 0px 3px 1px rgba(0,0,0,0.25)'
			this.style.width = '300px'
			setTimeout(function() {
				InputFieldRef.current.style.display = 'block'
			}, 50)
			t1 = setTimeout(function() {
				ChatRef.current.style.height = '500px'
				MessagesRef.current.style.display = 'block'
				t3 = setTimeout(function() {
					ChatTopBarRef.current.style.display = 'flex'
				}, 300)
			}, 300)
		}

		ChatMinimizeRef.current.onclick = function() {
			ChatTopBarRef.current.style.display = 'none'
			ChatRef.current.style.height = '50px'
			setTimeout(function() {
				MessagesRef.current.style.display = 'none'
				ChatRef.current.style.width = '50px'
				setTimeout(function() {
					InputFieldRef.current.style.display = 'none'
				}, 250)
				t2 = setTimeout(function() {
					ChatRef.current.style.borderRadius = '50px'
					ChatRef.current.style.boxShadow = 'none'
				}, 300)
				clearTimeout(t1)
			}, 300)
			clearTimeout(t2)
		}
	},[])

	let CustomerCare = useQuery(ADMIN_AND_EMPLOYEES, { variables: { role: "ADMIN" }})
		
	CustomerCare = CustomerCare.data?.allUsers[0]

	const [send] = useMutation(SEND_MESSAGE)
 

	async function handleSend() {
		if (text !== '') {
			const res = await send({ variables: { senderId: user?.id, receiverId: CustomerCare?.id, text, timeStamp: new Date() } })
			console.log(res)
			if (res.data) {
				setText('')
			}
		}
	}
	return (
		<ChatStyle ref={ChatRef}>
			<ChatTopBar ref={ChatTopBarRef}>
				<div ref={ChatMinimizeRef}>
					<AiFillCaretDown/>
				</div>
				<div>
					<span>Chat with {CustomerCare?.name}</span>
				</div>
				<div/>
			</ChatTopBar>
			<MessageBox>
				<AreaForMessages ref={MessagesRef}>
					{/* <Messages from={to}/> */}
					<Messages from={CustomerCare?.id}/>
				</AreaForMessages>
			</MessageBox>
			<SendBox>
				<Input >
					<InputField ref={InputFieldRef} value={text} onChange={e => setText(e.target.value)}/>
				</Input>
				<Send>
					<SendButton ref={SendButtonRef} onClick={handleSend}>
						{ helpIcon ? <IoIosHelpCircleOutline/> : <GrSend/> }
					</SendButton>
				</Send>
			</SendBox>
		</ChatStyle>
	)
}