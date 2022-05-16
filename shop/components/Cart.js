import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { useTransition, animated, config } from "react-spring"
import { BsArrowRight, BsTrash } from "react-icons/bs"
import { IoReload } from 'react-icons/io5'
import { useAuth } from '../lib/authentication'
import { useLocalState } from '../components/LocalState'
import CartItems from './CartItems'
import CartItemsForLocalStorage from './CartItemsForLocalStorage'
import Login from './Login'
import CreateAccount from './CreateAccount'
import CartItem3 from './CartItem3'
import useUser from '../hooks/useUser'
import formatter from '../lib/formatter'
import { cartItemNumer } from './LocalStateManagementWithApolloClient'

const REMOVE_FROM_CART = gql`
  mutation REMOVE_FROM_CART($cartItemId: ID!) {
    removeFromCart(cartItemId: $cartItemId) {
      success
    }
  }
`

const REMOVE_CART_ITEMS_FROM_SERVER = gql`
	mutation REMOVE_CART_ITEMS_FROM_SERVER {
		removeItemsFromCartInServer {
			success
		}
	}
`

const CART_ITEMS_IN_SERVER = gql`
	query ($id: ID!) {
	  User(where: {
	    id: $id
	  }){
	    id
	    cart {
	      id
	      cartItems {
	        id
	        item {
	          id
	        }
	        history {
	          id
	          date
	          quantity
	        }
	      }
	    }
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
	display: flex;
	flex-direction: column;
/*	& > svg {
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

	}*/
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

const Menus = styled.div`
	height: 50px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0px 5px 15px -5px rgba(0,0,0,.3);
	& > svg {
		margin: 0px 20px;
		cursor: pointer;
		&:nth-child(1) {
			transform: scale(1.3)
		}	
	}
`

const CartItems2 = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
`

const OrderSection = styled.div`
	height: 100px;
	box-shadow: 0px -5px 15px -5px rgba(0,0,0,.3);
	display: flex;
	box-shadow: 0px -7px 5px -5px rgba(0,0,0,.125);
	& > div {
		flex: 1;
		&:nth-child(1) {
			& > div {
				margin-top: 10px;
				margin-left: 10px;
			}

		}
		&:nth-child(2) {
			order: 3;
			& > div {
				margin-top: 10px;
				margin-right: 10px;
			}
		}
		&:nth-child(3) {
			display: flex;
			align-items: flex-end;
			justify-content: center;
			margin-bottom: 10px;
		}
	}
`

const TotalItems = styled.div`
	float: left;
`
const TotalAmount = styled.div`
	float: right;
`

const Order = styled.div`
	padding: 7px 15px;
	border-radius: 50px;
	font-size: 13px;
	color: white;
	text-transform: uppercase;
	font-weight: bold;
	background-color: orange;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	cursor: pointer;
`

export default function Cart() {
	const { user } = useAuth()
	const [cartStateOnNoUser, setCartStateOnNoUser] = useState('cartItemsForLocalStorage')
	const { cartState, reFetchCartItems, reloadCartComponent, setReloadCartItemBadgeNumber } = useLocalState()
	const [cartInfos, setCartInfos] = useState({
		item: [],
		totalItems: 0,
		totalAmounts: 0
	})
	
	const [appear, setAppear] = useState(cartState.comeIn)
	const [reloadingCartFromInside, setReloadingCartFromInside] = useState(0)
	const [getCartItemsFromServer] = useLazyQuery(CART_ITEMS_IN_SERVER)

	useEffect(() => {
		setAppear(true)
	},[])

	useEffect(() => {
		setAppear(true)
	},[cartState])

	useEffect(()=> {
		const cartItemsInLocalStorage_serialized = localStorage.getItem('osm-cart')
		const cartItemsInLocalStorage = JSON.parse(cartItemsInLocalStorage_serialized)

		let totalAmounts = 0

		for (let i=0; i<cartItemsInLocalStorage?.length; i++) {
			let totalNumberOfThisItem = 0
			for (let j=0; j<cartItemsInLocalStorage[i].history.length; j++) {
				totalNumberOfThisItem+=cartItemsInLocalStorage[i].history[j].quantity
			}
			cartItemsInLocalStorage[i].quantity = totalNumberOfThisItem
			totalAmounts+= cartItemsInLocalStorage[i].price*totalNumberOfThisItem
		}

		setCartInfos({
			items: cartItemsInLocalStorage,
			totalItems: cartItemsInLocalStorage?.length || 0,
			totalAmounts
		})

		setReloadCartItemBadgeNumber(Math.random())

		// if (user) {
		// 	const res = getCartItemsFromServer({ variables: { id: user.id }})
		// 	console.log(res)
		// }

	},[reloadCartComponent,reloadingCartFromInside,setReloadCartItemBadgeNumber])

	const [removeFromCart] = useMutation(REMOVE_FROM_CART)
	const [clearCart] = useMutation(REMOVE_CART_ITEMS_FROM_SERVER)

	async function deleteCartItems() {
		if (typeof window !== 'undefined') {
			if (cartInfos.items) {
				localStorage.removeItem('osm-cart')
				setReloadingCartFromInside(Math.random())
				if (user) {
					const res = await clearCart()
					console.log(res)
				}
			}
		}
	}

	return (
		<CartWrapper style={appear ? { left: 'calc(100% - 305px)' } : { left: 'calc(100% + 5px)' }}>
			<Menus>
				<BsArrowRight onClick={() => setAppear(false)}/>
				<BsTrash onClick={deleteCartItems}/>
			</Menus>
			{/* 	<BsArrowRight onClick={() => setAppear(false)}/> */}
			{/* 	<BsTrash/> */}
			{/* </Menus> */}
			{/* <IoReload/> */}
			{/* { !user ? */}
			{/* 	<> */}
			{/* 		{cartStateOnNoUser !== 'cartItemsForLocalStorage' ? <span onClick={() => setCartStateOnNoUser('cartItemsForLocalStorage')}>&lt;-</span> : null } */}
			{/* 		<p><span onClick={() => setCartStateOnNoUser('login')}>Login</span> or <span onClick={() => setCartStateOnNoUser('createAccount')}>Create Account</span> to sync cart items to the server</p> */}
			{/* 		{{ */}
			{/* 		  'cartItemsForLocalStorage': <CartItemsForLocalStorage/>, */}
			{/* 		  'login': <Login/>, */}
			{/* 		  'createAccount': <CreateAccount/>, */}
			{/* 		} [cartStateOnNoUser] } */}
			{/* 	</> */}
			{/* 	: */}
			{/* 	<CartItems userId={user.id} showCartInfo={true}/> */}
			{/* } */}
				{/* <CartItems showCartInfo={true}/> */}
				<CartItems2>
					{cartInfos.items?.map((cartItem,key) => (
						<CartItem3 key={key} item={cartItem} callForReload={call => setReloadingCartFromInside(call)}/>
					))}
				</CartItems2>
				<OrderSection>
					<div>
						<TotalItems>{cartInfos.totalItems} item{cartInfos.totalItems > 1 ? 's' : null}</TotalItems>
					</div>
					<div>
						<TotalAmount>{ formatter.format(cartInfos.totalAmounts).replace(/\D00(?=\D*$)/, '') }</TotalAmount>
					</div>
					<div>
						{/* <Order onClick={ async () => { */}
						{/*  	const res = await order({ variables: { cartId, timeStamp: new Date(), ordererId: user.id, totalItems, totalAmounts }}) */}
						{/*  	console.log(res) */}
						{/*  }}>order</Order> */}
						<Link href="/checkout" onClick={() => setCartState({ ...cartState, comeIn: false })} passHref>
							<Order>Order</Order>
						</Link>
					</div>
				</OrderSection>

		</CartWrapper>
	)
}

const CartItems2Styled = styled.div`
	width: 100%;
	height: 100%;
`

// function CartItems2() {
// 	return (
// 			<CartItems2Styled>
// 				
// 			</CartItems2Styled>
// 		)
// }