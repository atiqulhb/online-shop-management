import { useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { gql, useQuery, useMutation, makeVar } from '@apollo/client'
import{ useLocalState } from '../components/LocalState'
import { useAuth } from '../lib/authentication'
import useUser from '../hooks/useUser'
import TopBar from '../components/TopBar'
import ScrollBarContainer from '../components/ScrollBarContainer'
import NotificationMessage from '../components/NotificationMessage'
import useHasScrollBar from '../hooks/useHasScrollBar'
import Image from 'next/image'

export const SomeDataInApolloLocalState = makeVar('some data')

const SINGLE_PRODUCT_QUERY = gql`
	query SINGLE_PRODUCT_QUERY ($id: ID!) {
	  Product(where: {id: $id}) {
	  	id
	    name
	    weight
	    price
	    image {
	      id
	      publicUrl
	    }
	    brand
	    details
	  }
	}
`

const ProductPageLayout = styled.div`
	width: 100%;
	height: 100%;
`

const LargeImage = styled.div`
	width: 50%;
	height: 100%;
	float: left;
	img {
		object-fit: contain;
	}
`

const DetailsSection = styled.div`
	width: 50%;
	height: 100%;
	float: right;
`

const AddNumberOfProduct = styled.div`
	flex: 2;
	display: -webkit-flex;
	display: -moz-flex;
	display: -ms-flex;
	display: -o-flex;
	display: flex;
	user-select: none;
	width: 100px;
	height: 30px;
	div {
		flex: 1;
		display: -webkit-flex;
		display: -moz-flex;
		display: -ms-flex;
		display: -o-flex;
		display: flex;
		justify-content: center;
		-ms-align-items: center;
		align-items: center;
		border: 1px solid black;
		&:first-child, &:last-child {
			cursor: pointer;
		}

	}
`

const AddToCartWrapper = styled.div`
	width: 100px;
	background-color: black;
	color: white;
	height: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
`

export default function ProductPage(props) {
	 const router = useRouter()
  	const { id } = router.query
	const { user } = useAuth()
	const hasScrollBar = useHasScrollBar()
	// console.log(hasScrollBar)
	const { data, error, loading } = useQuery(SINGLE_PRODUCT_QUERY, { variables: { id }})
	const { SaveToLocalStorage, cartState, setCartState, setNotification, addToCart } = useLocalState()
	const [numberOfItem, setNumberOfItem] = useState(1)
	if (!data) return null
	const { id: productId, name, image, brand, weight, price, details } = data.Product
	return (
		<ProductPageLayout>
			<ScrollBarContainer>
				<LargeImage>
					<Image src={image.publicUrl} width="100%" height="100%" alt=""/>
				</LargeImage>
				<DetailsSection>
					<h1>{brand}</h1>
					<h2>{name}</h2>
					<span>{weight}</span>
					<br/>
					<span>{price}</span>
					<br/>
					<p>{details}</p>
					<AddNumberOfProduct>
						<div onClick={() => {numberOfItem > 1 ?  setNumberOfItem(numberOfItem-1) : null }}>-</div>
						<div>{numberOfItem}</div>
						<div onClick={() => { setNumberOfItem(numberOfItem+1) }}>+</div>
					</AddNumberOfProduct>
					<AddToCartWrapper
						onClick={ async () => {
							console.log(user, 'user from product.js')
							if(user) {
								const res = await addToCart({ variables: { productId, quantity: numberOfItem, userId: user.id } })
								console.log(res, 'from product.js')
							} else {
								SaveToLocalStorage({...data.Product, quantity: numberOfItem})
							}
							if (cartState.initial) {
								setCartState({...cartState, comeIn: true})
							} else {
								setCartState({...cartState, initial: true})
							}
						}}
					>Add To Cart</AddToCartWrapper>
				</DetailsSection>
			</ScrollBarContainer>
		</ProductPageLayout>
	)
}