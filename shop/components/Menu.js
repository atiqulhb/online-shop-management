import { useState, useEffect } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { useTransition, animated, config } from "react-spring"
import { useLocalState } from '../components/LocalState'

const StyledMenu = styled(animated.div)`
	width: 250px;
	height: 60%;
	top: 50px;
	position: absolute;
	border: 1px solid black;
	box-shadow: 5px 5px 4px 0.5px rgba(0, 0, 0, 0.25);
	border-radius: 7.5px;
	background-color: #fff;
	z-index: 9999999999;
	transform: translateX(-103%);
	transition: transform 250ms ease-in-out
`

export default function Menu() {
	const { menuState } = useLocalState()
	const [appear, setAppear] = useState(false)
	useEffect(() => {
		setAppear(true)
	},[])
	useEffect(() => {
		setAppear(menuState.comeIn)
	},[menuState])
	return (
		<StyledMenu style={appear ? { transform: 'translateX(0%)' } : { transform: 'translateX(-103%)'}}>
			
		</StyledMenu>
	)
}