import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { gql, useQuery, useMutation } from '@apollo/client'
import { BsFillTrashFill } from 'react-icons/bs'
import { useLocalState } from './LocalState'
import { QUERY_CART } from '../graphql/queries'
import { useAuth } from '../lib/authentication'
import formatter from '../lib/formatter'
import Image from 'next/image'

const CHANGE_CART_ITEM_QUANTITY = gql`
  mutation CHANGE_CART_ITEM_QUANTITY($cartItemId: ID!, $newQuantity: Int!){
    changeCartItemQuantity(cartItemId: $cartItemId, newQuantity: $newQuantity){
      quantity
    }
  }

`



const CartItemLayout = styled.div`
	width: 100%;
	height: auto;
	border-radius: 7.5px;
	box-shadow: 0px 0px 3px 0.5px rgba(0, 0, 0, 0.25);
	margin: 7.5px 0;
	display: flex;
	padding: 5px;
	/*justify-content: space-around;*/
	/*align-items: center;*/
/*	img {
		width: 10%;
		height: 100%;
		object-fit: contain;
	}*/
	svg {
		cursor: pointer;
	}
	@media (min-width: 650px) {
		height: 50px;
	}
`

const ImageContainer = styled.div`
	width: 50px;
	height: 50px;
	& > img {
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

export default function CartItem({ item, userId }) {
	const { user } = useAuth()
	const { removeFromCart, updateCartItemQuantity } = useLocalState()
	const [itemNumber, setItemNumber] = useState(0)
	const [changeCartItemQuantity] = useMutation(CHANGE_CART_ITEM_QUANTITY, { refetchQueries: [ { query: QUERY_CART, variables: { id: user.id } }] })
	useEffect(() => {
		item && setItemNumber(item.quantity)
	},[item.quantity])
	
	async function handleChange() {
		console.log('cartItem', item)
		const res = await changeCartItemQuantity({ variables: { cartItemId: item.id, newQuantity: itemNumber }})
		setItemNumber(res.data.changeCartItemQuantity.quantity)
	}

	return (
		<CartItemLayout>
			<ImageContainer>
				<Image src={item.item?.image.publicUrl} width={50} height={50} alt=""/>
			</ImageContainer>
			<TitlePriceAndQuantity>
		 		<span>{item.item?.name.replace(/(.{25})..+/, "$1…")}</span>
				<span>{item.item?.price.toFixed(2)} x {itemNumber}</span>
		 	</TitlePriceAndQuantity>
		 	<SingleItemTotalPrice>
			 	<span>{(item.item?.price*itemNumber).toFixed(2)}</span>
		 	</SingleItemTotalPrice>
	 		<IncreaseDecreaseContainer>
				<IncreaseDecrease onMouseDown={() => { setItemNumber(itemNumber+1)}} onMouseUp={handleChange}>+</IncreaseDecrease>
				<IncreaseDecrease onMouseDown={() => {itemNumber > 1 ?  setItemNumber(itemNumber-1) : null}} onMouseUp={handleChange}>-</IncreaseDecrease>
			</IncreaseDecreaseContainer>
			<RemoveCartItemContainer>
				<BsFillTrashFill
					onClick={async () => {
						const res = await removeFromCart({ variables: { cartItemId: item.id } })
						
					}}
				/>
			</RemoveCartItemContainer>
		</CartItemLayout>
	)
}

