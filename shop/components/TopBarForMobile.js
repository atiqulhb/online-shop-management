import { useRef, useEffect } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { IoMenuOutline } from "react-icons/io5"
import { CgArrowsExpandRight, CgMinimizeAlt } from "react-icons/cg"
import { useFullScreen } from 'react-browser-hooks'
import Search from './Search'
import CartItemNumberBadge from './CartItemNumberBadge'
import useUser from '../hooks/useUser'
import { useAuth } from '../lib/authentication'
import { useLocalState } from './LocalState'

const TopBarLayout = styled.div`
	width: 100%;
	display: flex;
	/*position: absolute;*/
	height: 40px;
	justify-content: space-around;
	align-items: center;
	/*margin: 10px 0;*/
	transition: top 250ms ease-in-out;
	box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
	z-index: 999999;
	top: -50px;
	background-color: #fff;
	@media (min-width: 651px) {
		display: none;
	}
`

const Menu = styled.div`
	cursor: pointer;
`

const Logo = styled.img`
	margin: 0;
`

const ToggleFullScreen = styled.div`
	cursor: pointer;
`

export default function TopBar() {
	const { menuState, setMenuState, scrollingTo } = useLocalState()
	// console.log(scrollingTo)
	const { toggle, fullScreen } = useFullScreen()
	return (
		// <TopBarLayout style={scrollingTo ? { transform: 'translateY(-100%)' } : { transform: 'translateY(0%)' }}>
		// <TopBarLayout style={scrollingTo ? { top: '-50px' } : { top: '0px' }}>
		<TopBarLayout>
			<Menu>
				<IoMenuOutline onClick={() => {
					if (menuState.initial) {
						if (menuState.comeIn) {
							setMenuState({...menuState, comeIn: false})
						} else {
							setMenuState({...menuState, comeIn: true})
						}
					} else {
						setMenuState({initial: true, comeIn: true})
					}
				}}/>
			</Menu>
			<Link href={{ pathname: '/' }} passHref>
				<Logo src="/ecomm-icon.svg" height="20px"/>
			</Link>
			<ToggleFullScreen onClick={toggle}>
				{fullScreen ? <CgMinimizeAlt/> : <CgArrowsExpandRight/>}
			</ToggleFullScreen>
		</TopBarLayout>
	)
}