import styled from 'styled-components'
import { useAuth } from '../lib/authentication'
import { gql, useQuery } from '@apollo/client'
import { QUERY_CART } from '../graphql/queries'
import { useReactiveVar } from '@apollo/client'
import { useLocalState } from './LocalState'
import { useState, useEffect } from 'react'

const CartItemNumberWrapper = styled.div`
	width: 100%;
	height: 100%;
	background-color: black;
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50px;
	font-size: 12px;
`

const CartItemNumberBadge = () => {
	const { reloadCartItemBadgeNumber } = useLocalState()
	console.log(reloadCartItemBadgeNumber)
	const [totalCartItems, setTotalCartItems] = useState(0)
	// const cartItems = useReactiveVar(cartItemNumer)
	// console.log(cartItems, 'from cart badge')
// 	const {user} = useAuth()
// 
// 	const { data } = useQuery(QUERY_CART, { variables: { id: user?.id }})
// 	const totalCartItems = data?.User.cart?._cartItemsMeta.count || 0

	useEffect(() => {
		const cartItemsInLocalStorage_serialized = localStorage.getItem('osm-cart')
		const cartItemsInLocalStorage = JSON.parse(cartItemsInLocalStorage_serialized)

		setTotalCartItems(cartItemsInLocalStorage || 0)
	},[reloadCartItemBadgeNumber])
	return (
		<CartItemNumberWrapper>{totalCartItems}</CartItemNumberWrapper>
	)
}

export default CartItemNumberBadge