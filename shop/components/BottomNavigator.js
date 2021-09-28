import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { AiOutlineHome, AiOutlineSearch, AiOutlineHeart } from "react-icons/ai"
import { BiCart } from "react-icons/bi"
import { CgProfile } from "react-icons/cg"
import CartItemNumberBadge from './CartItemNumberBadge'
import { useLocalState } from './LocalState'
import { useAuth } from '../lib/authentication'

const BottomNavigatorLayout = styled.div`
	background-color: #fff;
	bottom: 0;
	width: 100%;
	height: 50px;
	position: absolute;
	display: flex;
	justify-content: space-around;
	align-items: center;
	user-select: none;
	box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
	transition: transform 250ms ease-in-out;
	z-index: 999999;
	@media (min-width: 651px) {
		display: none;
	}
	svg {
		cursor: pointer;
		user-select: none;
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

export default function BottomNavigator() {
	const { isAuthenticated } = useAuth()
	const { scrollingTo } = useLocalState()
	return (
		<BottomNavigatorLayout style={scrollingTo ? { transform: 'translateY(100%)' } : { transform: 'translateY(0%)' }}>
			<Link href='/' passHref>
				<span><AiOutlineHome/></span>
			</Link>
			<AiOutlineSearch/>
			<Link href='/cart' passHref>
				<Cart>
					<BiCart/>
					{ isAuthenticated ? (
						<SpaceForCartBadge>
							<CartItemNumberBadge/>
						</SpaceForCartBadge>
					) : null }
				</Cart>
			</Link>
			<AiOutlineHeart/>
			<Link href='/profile' passHref>
				<span><CgProfile/></span>
			</Link>
		</BottomNavigatorLayout>
	)
}