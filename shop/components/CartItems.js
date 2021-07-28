import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { gql, useQuery, useMutation } from '@apollo/client'
import { IoReload } from 'react-icons/io5'
import { BsTrash } from 'react-icons/bs'
import CartItem from './CartItem'
import{ useLocalState } from '../components/LocalState'
import ScrollBarContainer from '../components/ScrollBarContainer'
import CartItemforLocalStorage from './CartItemforLocalStorage'
import { cartItemNumer } from '../components/LocalStateManagementWithApolloClient'
import { QUERY_CART } from '../graphql/queries'
import Link from 'next/link'
import formatter from '../lib/formatter'

const REMOVE_CART_ITEMS = gql`
	mutation REMOVE_CART_ITEMS($ids: [ID!]!){
	  deleteCartItems (ids: $ids) {
	    id
	  }
	}
`

const ORDER = gql`
	mutation ORDER($cartId: ID!, $timeStamp: DateTime, $ordererId: ID!, $totalItems: Int, $totalAmounts: Float){
	  createOrder(data: {
	   cart: { connect: { id: $cartId } }
	   timeStamp: $timeStamp
	   orderer: { connect: { id: $ordererId } }
	   totalItems: $totalItems
	   totalAmounts: $totalAmounts
	  }) {
	  	id
	  	cart {
	  		id
	  	}
	  	timeStamp
	    orderer {
	    	id
	    	name
	    }
	    totalItems
	    totalAmounts
	  }
	}
`

const POST_NEW_ORDER = gql`
	mutation POST_NEW_ORDER($ordererId: ID, $totalItems: Int, $totalAmounts: Float){
	  postNewOrder(
	    ordererId: $ordererId
	    totalItems: $totalItems
	    totalAmounts: $totalAmounts
	  ){
	    success
	  }
	}
`

const ADD_NEW_CART_ITEM = gql`
	mutation ADD_NEW_CART_ITEM($itemId: [ID!] $quantity: [Int!] $userId: [ID!]) {
		createCartItem(data: {
			item: {
			  connect: { id: $itemId }
			}
			quantity: $quantity
			user: {
			  connect: { id: $userId }
			}
		}){
			id
			item {
				name
			}
			quantity
			user {
				name
			}
		}
	}
`

const ADD_NEW_CART_ITEMS = gql`
	mutation ADD_NEW_CART_ITEMS($itemId: [ID!]!, $quantity: [Int!]!, $userId: [ID!]!) {
	  createCartItems (data:
	    [
	      {
	        data : {
	          item: { connect: { id: $itemId }}
	          quantity: $quantity
	          user: { connect: { id: $userId }}
	        }
	      }
	    ]
	  ){
	    item {
	      name
	    }
	    quantity
	    user {
	      name
	    }
	  }
	}
`

const CartComponentWrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
`

const CartItemsWrapper = styled.div`
	width: 100%;
	height: calc(100% - 145px);
`

const CartInfoContainer = styled.div`
	width: 100%;
	height: 100px;
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
const TotalAmout = styled.div`
	float: right;
`

const OrderContainer = styled.div`
	width: 100%;
	height: 50px;
	align-self: flex-end;
	display: flex;
	justify-content: center;
	align-items: center;
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

const Buttons = styled.div`
	margin-left: 10px;
	svg {
		margin-left: 5px;
		cursor: pointer;
	}
`

export default function CartItems({ userId, showCartInfo }) {
	const { setCartOpen, setCartItemNumber, addToCart, setCartInfo, cartState, setCartState } = useLocalState()
	  

	const [saveToServer] = useMutation(ADD_NEW_CART_ITEM)
	const [saveThemAllToServer] = useMutation(ADD_NEW_CART_ITEMS)

	const [removeAllCartItems] = useMutation(REMOVE_CART_ITEMS)

	const [order] = useMutation(ORDER)

	const router = useRouter()

	function getCartItemsFromLocalStorage() {
		if (typeof window !== 'undefined') {
			const cartItemsInLocalStorage = localStorage.getItem('ecomm-cart')
			const cartItemsInLocalStorage_deserialized = JSON.parse(cartItemsInLocalStorage)
			return cartItemsInLocalStorage_deserialized
		}
	}

	function RemoveItemFromCart(id) {
		if (typeof window !== 'undefined') {
			const itemsInCart = localStorage.getItem('ecomm-cart')
			const itemsInCart_deserialized = JSON.parse(itemsInCart)
			const itemInCart = itemsInCart_deserialized.find(c => c.id === id);
			const indexOfTheItem = itemsInCart_deserialized.indexOf(itemInCart)
			itemsInCart_deserialized.splice(indexOfTheItem, 1)
			const ItemsInCart_serialized = JSON.stringify(itemsInCart_deserialized)
	        localStorage.setItem('ecomm-cart', ItemsInCart_serialized)
		}
	}

	function RemoveItemsFromCart(arrayofId) {
		if (typeof window !== 'undefined') {
			const itemsInCart = localStorage.getItem('ecomm-cart')
			const itemsInCart_deserialized = JSON.parse(itemsInCart)

			for(let i=0; i<arrayofId.length; i++) {
				const itemInCart = itemsInCart_deserialized.find(c => c.id === arrayofId[i].id);
				const indexOfTheItem = itemsInCart_deserialized.indexOf(itemInCart)
				itemsInCart_deserialized.splice(indexOfTheItem, 1)
			}
			
			const ItemsInCart_serialized = JSON.stringify(itemsInCart_deserialized)
	        localStorage.setItem('ecomm-cart', ItemsInCart_serialized)
	        setReloadCartForLocalStorage(Math.random())
		}
	}

	const { data, refetch } = useQuery(QUERY_CART, { variables: { id: userId }})
	if (!data) return <p>No items</p>

	const cartId = data?.User.cart?.id

	const cartItems = data?.User.cart?.cartItems
	
	const totalItems = data?.User.cart?._cartItemsMeta.count

	let totalAmounts = 0,
		j = 0

	for (j; j<cartItems?.length; j++) {
		totalAmounts += cartItems[j]?.item?.price * cartItems[j]?.quantity
	}

	const cartItemsInLocalStorage = getCartItemsFromLocalStorage()

	let variables = [],
		arrayOfCartItemsId = [],
		arrayOfQuantity = [],
		i = 0

	for(i; i<cartItemsInLocalStorage?.length; i++) {
		arrayOfCartItemsId[i] = cartItemsInLocalStorage[i].id
		arrayOfQuantity[i] = cartItemsInLocalStorage[i].quantity
	}

	return (
		<CartComponentWrapper>
			<CartItemsWrapper>
				<ScrollBarContainer childrenStyle={{padding: '12px'}}>

					{cartItems?.map((cartItem,key) => (
						<CartItem key={key} item={cartItem} userId={userId}/>
					))}
					
					{ cartItemsInLocalStorage && cartItemsInLocalStorage[0] ? 
						(
						<>
						<span>these items are from localstorage</span>
						{cartItemsInLocalStorage?.map((cartItem,key) => (
							<CartItemforLocalStorage key={key} item={cartItem}/>
						))}
						</>
					) : null }
				</ScrollBarContainer>
			</CartItemsWrapper>
			{ showCartInfo ? (
				<CartInfoContainer>
					<div>
						<TotalItems>{totalItems} items</TotalItems>
					</div>
					<div>
						<TotalAmout>{ formatter.format(totalAmounts).replace(/\D00(?=\D*$)/, '') }</TotalAmout>
					</div>
					<div>
						<Order onClick={ async () => {
							const res = await order({ variables: { cartId, timeStamp: new Date(), ordererId: userId, totalItems, totalAmounts }})
							console.log(res)
						}}>order</Order>
						{/* <Link href="/checkout" onClick={() => setCartState({ ...cartState, comeIn: false })}> */}
						{/* 	<Order>Order</Order> */}
						{/* </Link> */}
					</div>
				</CartInfoContainer>
			) : null }
		</CartComponentWrapper>
	)
}