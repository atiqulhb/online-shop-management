import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useTransition, animated, config } from "react-spring"
import { BsArrowRight, BsTrash } from "react-icons/bs"
import { IoReload } from 'react-icons/io5'
import { useAuth } from '../lib/authentication'
import { useLocalState } from '../components/LocalState'
import CartItems from './CartItems'
import CartItemsForLocalStorage from './CartItemsForLocalStorage'
import Login from './Login'
import CreateAccount from './CreateAccount'
import useUser from '../hooks/useUser'

const REMOVE_FROM_CART = gql`
  mutation REMOVE_FROM_CART($cartItemId: ID!) {
    removeFromCart(cartItemId: $cartItemId) {
      success
    }
  }
`

const CartWrapper = styled.div`
	top: 50px;
	position: absolute;
	width: 300px;
	height: 600px;
	z-index: 9999;
	left: calc(100% + 5px);
	transition: left 310ms ease-in-out;
	border-radius: 7.5px;
	box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.25);
	z-index: 999999999;
	background-color: #fff;
	& > svg {
		&:nth-child(1) {
			margin-top: 20px;
			margin-left: 20px;
			cursor: pointer;
			transform: scale(1.5);
		}
		&:nth-child(2), &:nth-child(3) {
			float: right;
			margin-top: 20px;
			cursor: pointer;
		}
		&:nth-child(2){
			margin-right: 20px;
		}
		&:nth-child(3)  {
			margin-right: 10px;
		}

	}
	@media (max-width: 650px) {
		display: none;
	}
	& > p > span {
		color: #00d;
		text-decoration: underline;
		cursor: pointer;
	}
`

const IncreaseDecrease = styled.div`
	flex: 0.5;
	display: flex;
	flex-direction: column;
	font-size: 24px;
	font-weight: bold;
`
const Increase = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
`
const Decrease = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
`

export default function Cart() {
	const { user } = useAuth()
	const [cartStateOnNoUser, setCartStateOnNoUser] = useState('cartItemsForLocalStorage')
	const { cartState, reFetchCartItems, reloadCartComponent } = useLocalState()
	const [itemsInCart, setItemsInCart] = useState([])
	const [appear, setAppear] = useState(cartState.comeIn)

	useEffect(() => {
		setAppear(true)
	},[])

	useEffect(() => {
		setAppear(true)
	},[cartState])

	const [removeFromCart] = useMutation(REMOVE_FROM_CART)

	let totalItems = 0
	let totalAmount = 0

	if (itemsInCart) {
		
		for(let i=0; i<itemsInCart.length; i++) {
			totalItems += itemsInCart[i].numberOfItem
			totalAmount += itemsInCart[i].price*itemsInCart[i].numberOfItem
		}
	}

	return (
		<CartWrapper style={appear ? { left: 'calc(100% - 305px)' } : { left: 'calc(100% + 5px)' }}>
			<BsArrowRight onClick={() => setAppear(false)}/>
			<BsTrash/>
			<IoReload/>
			{ !user ?
				<>
					{cartStateOnNoUser !== 'cartItemsForLocalStorage' ? <span onClick={() => setCartStateOnNoUser('cartItemsForLocalStorage')}>&lt;-</span> : null }
					<p><span onClick={() => setCartStateOnNoUser('login')}>Login</span> or <span onClick={() => setCartStateOnNoUser('createAccount')}>Create Account</span> to sync cart items to the server</p>
					{{
					  'cartItemsForLocalStorage': <CartItemsForLocalStorage/>,
					  'login': <Login/>,
					  'createAccount': <CreateAccount/>,
					} [cartStateOnNoUser] }
				</>
				:
				<CartItems userId={user.id} showCartInfo={true}/>
			}
		</CartWrapper>
	)
}