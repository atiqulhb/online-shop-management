import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { useAuth } from '../lib/authentication'
import{ useLocalState } from '../components/LocalState'

const ProductCardLayout = styled.div`
	width: calc(20% - 50px);
	margin: 25px;
	height: 300px;
	float: left;
	box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.5);
	border-radius: 7.5px;
	z-index: 99;
	@media (max-width: 650px) {
		margin: 5px;
		width: calc(50% - 10px);
	}
	@media (min-width: 651px) and (max-width: 910px) {
		width: calc(33.33333333333333% - 50px);
	}
	@media (min-width: 911px) and (max-width: 1170px) {
		width: calc(25% - 50px);
	}
	@media (min-width: 1171px) {
		width: calc(20% - 50px);
	}
	
`

const InnerWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	height: 270px;
	cursor: pointer;
`

const PriceTag = styled.div`
	width: 100%;
	span {
		float: right;
		margin-right: 10px;
	}
`

const Image = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	img {
		width: 100%;
		height: auto;
		object-fit: contain;
	}
`

const AddTOCartButton = styled.div`
	width: 100%;
	height: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-top: 1px solid rgba(0, 0, 0, 0.125);
	border-radius: 7.5px;
	cursor: pointer;
	font-size: 12px;
`

export default function ProductCard({ data }) {
	const { user } = useAuth()
	const { addToCart, cartState, setCartState, SaveToLocalStorage } = useLocalState()
	const { id, price, image } = data
	return (
		<ProductCardLayout>
			<Link href={{ pathname: '/product', query: { id }}}>
				<InnerWrapper>
					<PriceTag>
						<span>৳{price}</span>
					</PriceTag>
					<Image>
						<img src={image.publicUrl} alt=""/>
					</Image>
				</InnerWrapper>
			</Link>
			<AddTOCartButton onClick={ async () => {
				if(user) {
					const res = await addToCart({ variables: { productId: id, quantity: 1, userId: user.id } })
					console.log(res)
				} else {
					SaveToLocalStorage({...data, quantity: 1})
				}
				if (cartState.initial) {
					setCartState({...cartState, comeIn: true})
				} else {
					setCartState({...cartState, initial: true})
				}
			}}>ADD TO CART</AddTOCartButton>
		</ProductCardLayout>
	)
}