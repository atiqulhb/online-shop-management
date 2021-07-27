import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { BsFillTrashFill } from 'react-icons/bs'
import { useLocalState } from './LocalState'


const CartItemforLocalStorageLayout = styled.div`
	width: 100%;
	height: auto;
	border-radius: 7.5px;
	border: 1px solid black;
	box-shadow: 3px 3px 4px 0.5px rgba(0, 0, 0, 0.25);
	margin: 5px 0;
	display: flex;
	padding: 5px;
	/*justify-content: space-around;*/
	/*align-items: center;*/
/*	img {
		width: 50px;
		height: 100%;
		object-fit: contain;
	}*/
`

const ImageContainer = styled.div`
	flex: 1;
	& > img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
`

const TitlePriceAndQuantity = styled.div`
	flex: 5;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	span {
		margin-left: 10px;
	}

`

const SingleItemTotalPrice = styled.div`
	flex: 2;
	display: flex;
	justify-content: center;
	align-items: center;
`

const IncreaseDecreaseContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	font-size: 24px;
	font-weight: bold;
`

const IncreaseDecrease = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	user-select: none;
`

const RemoveCartItemContainer = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	user-select: none;
`

export default function CartItemforLocalStorage({ item }) {
	const { setReloadShoppingCart } = useLocalState()
	
	function IncreaseNumberOfItem(id) {
		if (typeof window !== 'undefined') {
			const itemsInCart = localStorage.getItem('ecomm-cart')
			const itemsInCart_deserialized = JSON.parse(itemsInCart)
			const itemInCart = itemsInCart_deserialized.find(c => c.id === id)
			const index = itemsInCart_deserialized.indexOf(itemInCart)
			if (index >= 0) { itemsInCart_deserialized.splice(index, 1)}
			itemInCart.quantity += 1
			if (index >= 0) { itemsInCart_deserialized.splice(index, 0, itemInCart)}
			const ItemsInCart_serialized = JSON.stringify(itemsInCart_deserialized)
	        localStorage.setItem('ecomm-cart', ItemsInCart_serialized)
	        setReloadShoppingCart(Math.random())
		}
	}

	function DecreaseNumberOfItem(id) {
		if (typeof window !== 'undefined') {
			const itemsInCart = localStorage.getItem('ecomm-cart')
			const itemsInCart_deserialized = JSON.parse(itemsInCart)
			const itemInCart = itemsInCart_deserialized.find(c => c.id === id)
			const index = itemsInCart_deserialized.indexOf(itemInCart)
			if (index >= 0) { itemsInCart_deserialized.splice(index, 1)}
			if (itemInCart.quantity > 1) { itemInCart.quantity -= 1 }
			if (index >= 0) { itemsInCart_deserialized.splice(index, 0, itemInCart)}
			const ItemsInCart_serialized = JSON.stringify(itemsInCart_deserialized)
	        localStorage.setItem('ecomm-cart', ItemsInCart_serialized)
	        setReloadShoppingCart(Math.random())
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
	        setReloadShoppingCart(Math.random())
		}
	}

	return (
		<CartItemforLocalStorageLayout>
			<ImageContainer>
				<img src={item.image.publicUrl} alt=""/>
			</ImageContainer>
			<TitlePriceAndQuantity>
		 		<span>{item.name.replace(/(.{25})..+/, "$1…")}</span>
				<span>{item.price} x {item.quantity}</span>
		 	</TitlePriceAndQuantity>
		 	<SingleItemTotalPrice>
			 	<span>{(item.price*item.quantity).toFixed(2)}</span>
		 	</SingleItemTotalPrice>
	 		<IncreaseDecreaseContainer>
				<IncreaseDecrease onClick={() => IncreaseNumberOfItem(item.id)}>+</IncreaseDecrease>
				<IncreaseDecrease onClick={() => DecreaseNumberOfItem(item.id)}>-</IncreaseDecrease>
			</IncreaseDecreaseContainer>
			<RemoveCartItemContainer>
				<BsFillTrashFill style={{ cursor: 'pointer'}} onClick={() => RemoveItemFromCart(item.id)}/>
			</RemoveCartItemContainer>
		</CartItemforLocalStorageLayout>
	)
}