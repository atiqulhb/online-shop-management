import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { gql, useMutation, useQuery } from '@apollo/client'
import { BsFillTrashFill } from 'react-icons/bs'
import { useLocalState } from '../components/LocalState'
import TopBar from '../components/TopBar'
import CartItems from '../components/CartItems'
import { useAuth } from '../lib/authentication'
import Login from '../components/Login'
import ScrollBar from '../components/ScrollBarContainer'
import Payment from '../components/Payment'

const ORDER = gql`
	mutation ORDER($date: DateTime, $ordererId: ID!, $totalItems: Int, $totalAmounts: Float){
	  createOrder(data: {
	   date: $date
	   orderer: {
	    connect: { id: $ordererId }
	  }
	  totalItems: $totalItems
	  totalAmounts: $totalAmounts
	  }) {
	  	date
	    orderer {
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

const CartContainer = styled.div`
	width: 100%;
	height: 100%;
	/*background-color: yellow;*/
	display: flex;
	/*flex-direction: column;*/
`

const CartItemsContainer = styled.div`
	flex: 1;
	overflow-y: auto;
`

const CartItemContainer = styled.div`
	width: 90%;
	height: auto;
	margin: 15px auto;
	box-shadow: 3px 3px 6px #333;
	border-radius: 7.5px;
	display: flex;
`

const CartItemImageContainer = styled.div`
	flex: 1;
`

const CartItemImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: contain;
`

const CartItemInfo = styled.div`
	flex: 2;
	display: flex;
	flex-direction: column;
`

const AmountForSingleItem = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
`
const IncreaseDecrease = styled.div`
	flex: 0.5;
	display: flex;
	flex-direction: column;
	font-size: 24px;
	font-weight: bold;
`
const RemoveFromCart = styled.div`
	flex: 0.5;
	display: flex;
	justify-content: center;
	align-items: center;
	svg {
		cursor: pointer;
	}
`

const Title = styled.div`
	flex: 1
`

const PriceAndNumberOfItem = styled.div`
	flex: 1;
	display: flex;
	align-items: flex-end;
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

const CartInfoContainer = styled.div`
	width: 100%;
	height: 100px;
	z-index: 5;
	align-self: flex-end;
	box-shadow: 0px -10px 5px -5px rgba(0,0,0,.25)
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
	padding: 10px 40px;
	border-radius: 50px;
	color: white;
	text-transform: uppercase;
	font-weight: bold;
	background-color: orange;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
`

const PaymentSection = styled.div`
	flex: 1;
	box-shadow: -15px 0px 15px -15px rgba(0,0,0,.3);
	
`

export default function CartPage() {
	const { user } = useAuth()
	const { reloadShoppingCart, setReloadShoppingCart } = useLocalState()
	const [itemsInCart, setItemsInCart] = useState([])


	useEffect(() => {
		const ItemsInCart_serialized = localStorage.getItem('cart')
		const ItemsInCart = JSON.parse(ItemsInCart_serialized)
		setItemsInCart(ItemsInCart)
	}, [reloadShoppingCart])

	const [order] = useMutation(ORDER)

	function IncreaseNumberOfItem(id) {
		if (typeof window !== 'undefined') {
			const itemsInCart = localStorage.getItem('cart')
			const itemsInCart_deserialized = JSON.parse(itemsInCart)
			const itemInCart = itemsInCart_deserialized.find(c => c.id === id)
			const index = itemsInCart_deserialized.indexOf(itemInCart)
			if (index >= 0) { itemsInCart_deserialized.splice(index, 1)}
			itemInCart.numberOfItem += 1
			if (index >= 0) { itemsInCart_deserialized.splice(index, 0, itemInCart)}
			const ItemsInCart_serialized = JSON.stringify(itemsInCart_deserialized)
	        localStorage.setItem('cart', ItemsInCart_serialized)
	        setReloadShoppingCart(Math.random())
		}
	}

	function DecreaseNumberOfItem(id) {
		if (typeof window !== 'undefined') {
			const itemsInCart = localStorage.getItem('cart')
			const itemsInCart_deserialized = JSON.parse(itemsInCart)
			const itemInCart = itemsInCart_deserialized.find(c => c.id === id)
			const index = itemsInCart_deserialized.indexOf(itemInCart)
			if (index >= 0) { itemsInCart_deserialized.splice(index, 1)}
			if (itemInCart.numberOfItem > 1) { itemInCart.numberOfItem -= 1 }
			if (index >= 0) { itemsInCart_deserialized.splice(index, 0, itemInCart)}
			const ItemsInCart_serialized = JSON.stringify(itemsInCart_deserialized)
	        localStorage.setItem('cart', ItemsInCart_serialized)
	        setReloadShoppingCart(Math.random())
		}
	}

	function IncreaseNumberOfItem2(id){
		if (typeof window !== 'undefined') {
			const itemsInCart = localStorage.getItem('cart')
			const itemsInCart_deserialized = JSON.parse(itemsInCart)
			const itemInCart = itemsInCart_deserialized.find(c => c.id === id)
			const index = itemsInCart_deserialized.indexOf(itemInCart)
		}
	}

	function RemoveItemFromCart(id) {
		if (typeof window !== 'undefined') {
			const itemsInCart = localStorage.getItem('cart')
			const itemsInCart_deserialized = JSON.parse(itemsInCart)
			const itemInCart = itemsInCart_deserialized.find(c => c.id === id);
			const indexOfTheItem = itemsInCart_deserialized.indexOf(itemInCart)
			itemsInCart_deserialized.splice(indexOfTheItem, 1)
			const ItemsInCart_serialized = JSON.stringify(itemsInCart_deserialized)
	        localStorage.setItem('cart', ItemsInCart_serialized)
	        setReloadShoppingCart(Math.random())
		}
	}

	return (
		<CartContainer>
			{ (!user) ? (
				<>
				<span>You need to login</span>
				<Login/>
				</>
			) : (
				<>
					<CartItemsContainer>
							<CartItems userId={user.id}/>
					</CartItemsContainer>
					<PaymentSection>
						<Payment/>
					</PaymentSection>
				</>
			)}
		</CartContainer>
	)
}