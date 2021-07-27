import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { useLocalState } from '../components/LocalState'

const NotificationStyled = styled.div`
	width: 300px;
	height: 50px;
	position: absolute;
	z-index: 9999999999;
	transition: left 250ms ease-in-out;
	background-color: #fff;
	border: 1px solid black;
	box-shadow: 0 1px 2px rgba(0,0,0,0.15);
	border-radius: 10px;
	display: flex;
`

const Message = styled.div`
	flex: 5;
	display: flex;
	justify-content: center;
	align-items: center;
`

const Close = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
`

export default function Notification() {
	const { notification, setNotification } = useLocalState()
	return (
		<NotificationStyled style={notification.open ? { left: 'calc(100% - 300px)' } : { left: '100%' } }>
			<Message>
				{notification.message}
			</Message>
			<Close onClick={() => setNotification({ open: false, message: '' })}>X</Close>
		</NotificationStyled>
	)
}