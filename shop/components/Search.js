import Link from 'next/link'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { gql, useQuery } from '@apollo/client'

// const SEARCH_QUERY = gql`
// 	query SEARCH_QUERY($search_input: String){
// 		allProducts(where: { name_contains_i: $search_input }) {
// 			id
// 			name
// 			image
// 		}
// 	}
// `

const SEARCH_QUERY = gql`
	query SEARCH_QUERY($search_input: String){
	  allProducts(search: $search_input){
	  	id
	    name
	  }
	}
`



const SearchWrapper = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
`

const SearchBar = styled.input`
	width: 100%;
	height: 100%;
	border-radius: 50px;
	/*border: 1px solid black;*/
	border: none;
	box-shadow: 0px 0px 0px 0.5px rgba(0, 0, 0, 0.5);
	/*transition: box-shadow 100ms ease-in-out;*/
	&:focus {
		outline: none;
		/*box-shadow: 0px 0px 4px 0.5px rgba(0, 0, 0, 0.25);*/
	}
`

const FoundedProducts = styled.ul`
	position: absolute;
	width: 100%;
	height: auto;
	border-radius: 7.5px;
	/*border: 1px solid black;*/
	box-shadow: 0px 0px 0px 0.5px rgba(0, 0, 0, 0.5);
	background-color: #fff;
	z-index: 999;
	padding: 0;
	list-style-type: none;
	li {
		/*border-bottom: 1px solid black;*/
	box-shadow: 0px 0px 0px 0.5px rgba(0, 0, 0, 0.25);
		text-align: center;
		padding: 5px 0;
		cursor: pointer;
		&:hover {
			background-color: gold;
		}
		&:first-child {
			box-shadow: none;
		}
		&:last-child {
			border: none;
			box-shadow: none;
		}
	}
`

export default function Search() {
	const [searchInput, setSearchInput] = useState('')
	const [showFoundedProductList, setIfToShowFoundedProductList] = useState(false)

	const { data } = useQuery(SEARCH_QUERY, { variables: { search_input: searchInput } })
	const SearchedProducts = data?.allProducts

	function AddSearchInput(e) {
		const { value } = e.target
		if(value === '') {
			setSearchInput('')
		}
		else {
			setSearchInput(value)
		}
	}

	useEffect(() => {
		if (searchInput === '') {
			setIfToShowFoundedProductList(false)
		} else {
			if (SearchedProducts && SearchedProducts.length > 0){
				setIfToShowFoundedProductList(true)
			} else {
				setIfToShowFoundedProductList(false)
			}
		}
		
	},[SearchedProducts])
	
	return (
		<SearchWrapper>
			<SearchBar onChange={AddSearchInput}/>
			{showFoundedProductList ? (
				<FoundedProducts>
					{searchInput !== '' ? data?.allProducts.map(product => (
						<Link href={{ pathname: '/product', query: { id: product.id }}} key={product.id}>
							<li>{product.name}</li>
						</Link>
					)) : null}
				</FoundedProducts>
			) : null}
		</SearchWrapper>
	)
}