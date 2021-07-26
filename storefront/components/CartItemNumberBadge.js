import { useEffect, useState, memo } from 'react'
import styled from 'styled-components'
import { useAuth } from '../lib/authentication'
import useUser from '../hooks/useUser'
import { useLocalState } from '../components/LocalState'
import { gql, useQuery } from '@apollo/client'
import { QUERY_CART } from '../graphql/queries'

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
	const {user} = useAuth()

	const { data } = useQuery(QUERY_CART, { variables: { id: user?.id }})
	const totalCartItems = data?.User.cart?._cartItemsMeta.count
	return (
		<CartItemNumberWrapper>{totalCartItems}</CartItemNumberWrapper>
	)
}

export default CartItemNumberBadge