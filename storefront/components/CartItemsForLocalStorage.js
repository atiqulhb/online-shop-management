import { useEffect } from 'react'
import styled from 'styled-components'
import { BsTrash } from 'react-icons/bs'
import CartItemforLocalStorage from './CartItemforLocalStorage'
import{ useLocalState } from '../components/LocalState'
import ScrollBarContainer from '../components/ScrollBarContainer'


const CartItemsWrapper = styled.div`
	width: 100%;
	height: 500px;
`

export default function CartItemsForLocalStorage() {
	const { reloadCartForLocalStorage, setReloadCartForLocalStorage } = useLocalState()
    
	useEffect(() => {
		// console.log('reloading Cart For LocalStorage')
	},[reloadCartForLocalStorage])

	function getCartItemsFromLocalStorage() {
		if (typeof window !== 'undefined') {
			const cartItemsInLocalStorage = localStorage.getItem('ecomm-cart')
			const cartItemsInLocalStorage_deserialized = JSON.parse(cartItemsInLocalStorage)
			return cartItemsInLocalStorage_deserialized
		}
	}

	const AllCartItemsInLocalStorage = getCartItemsFromLocalStorage()
	console.log(AllCartItemsInLocalStorage)

	let arrayofId = [],
		i = 0

	for (i; i<AllCartItemsInLocalStorage?.length; i++) {
		arrayofId[i] = AllCartItemsInLocalStorage[i].id
	}

	console.log(arrayofId)

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

	return (
		<CartItemsWrapper>
			<BsTrash onClick={() => RemoveItemsFromCart(arrayofId)}/>
			<ScrollBarContainer>
				
				{AllCartItemsInLocalStorage?.map((cartItem,key) => (
					<CartItemforLocalStorage key={key} item={cartItem}/>
				))}
			</ScrollBarContainer>
		</CartItemsWrapper>
	)
}