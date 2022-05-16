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
import { useRouter } from 'next/router'

const TopBarLayout = styled.div`
	width: 100%;
	display: flex;
	/*position: absolute;*/
	height: 50px;
	justify-content: space-around;
	align-items: center;
	/*margin: 10px 0;*/
	transition: transform 250ms ease-in-out;
	/*box-shadow: 0px 0px 0px 0.5px rgba(0, 0, 0, 0.5);*/
	z-index: 999999;
	top: 0;
	background-color: #fff;
	@media (max-width: 650px) {
		display: none;
	}
`

const Menu = styled.div`
	cursor: pointer;
	@media (min-width: 651px) {
		display: none;
	}
`

const Home = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	span {
		cursor: pointer;
	}
	@media (max-width: 650px) {
		display: none;
	}
`

const Login = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	span {
		cursor: pointer;
	}
	@media (max-width: 650px) {
		display: none;
	}
`

const Logo = styled.img`
	margin: 0;
	@media (min-width: 651px) {
		display: none;
	}
`

const SearchBar = styled.div`
	flex: 4;
	height: 30px;
	@media (max-width: 650px) {
		display: none;
	}
`

const CartSection = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	@media (max-width: 650px) {
		display: none;
	}
`

const Cart = styled.div`
	cursor: pointer;
	position: relative;
`

const SpaceForCartBadge = styled.div`
	width: 20px;
	height: 20px;
	position: absolute;
	top: -10px;
	right: -15px;
`

const ToggleFullScreen = styled.div`
	cursor: pointer;
	@media (min-width: 651px) {
		display: none;
	}
`

export default function TopBar() {
	const { user, isAthenticated, isLoading } = useAuth()
	const { menuState, setMenuState, scrollingTo, topBarInfo, setTopBarInfo } = useLocalState()
	const { pathname } = useRouter()

	const TopBarRef = useRef()
	// useEffect(() => {
	// 	const TopBarHeight = TopBarRef.current.clientHeight
	// 	setTopBarInfo({...topBarInfo, height: TopBarHeight})
	// },[topBarInfo,setTopBarInfo])
	// console.log(isLoading)
	const { toggle, fullScreen } = useFullScreen()
	// const { user } = useUser()
	// console.log(user, 'from TopBar.js')
	return (
		<TopBarLayout ref={TopBarRef}>
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
			<Home>
				<Link href={{ pathname: '/' }} passHref>
					<span>Home</span>
				</Link>
			</Home>
			<Login>
				{(() => {
					if (user) {
						return (
							<Link href={{ pathname: '/profile', query: { id: user.id }}} passHref>
					        	<span>{user.name}</span>
					        </Link>
						)
					} else {
						return  (
							<Link href={{ pathname: `/account`}} passHref>
					        	<span>login</span>
					        </Link>
						)
					}
				})()}
			</Login>
			<Logo src="/ecomm-icon.svg" height="20px"/>
			<SearchBar>
				<Search/>
			</SearchBar>
			<CartSection>
				<Link href="/cart" passHref>
					<Cart>
						<span>cart</span>
						<SpaceForCartBadge>
							<CartItemNumberBadge/>
						</SpaceForCartBadge>
					</Cart>
				</Link>
			</CartSection>
			<ToggleFullScreen onClick={toggle}>
				{fullScreen ? <CgMinimizeAlt/> : <CgArrowsExpandRight/>}
			</ToggleFullScreen>
		</TopBarLayout>
	)
}